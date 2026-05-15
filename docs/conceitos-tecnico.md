# Conceitos Técnicos — Moral Roulette

> Como eu explicaria em uma entrevista de emprego o que aprendi e implementei nesse projeto.

---

## tRPC

tRPC é uma biblioteca que permite criar APIs type-safe entre o servidor e o cliente sem precisar escrever nenhum código de serialização, validação de contrato ou geração de tipos — tudo isso vem automaticamente porque o servidor e o cliente compartilham o mesmo código TypeScript.

**O problema que ele resolve:** Em APIs REST tradicionais, você define uma rota no servidor, aí no cliente você faz um `fetch` para aquela rota e torce para os tipos baterem. Se o servidor mudar o formato da resposta, o cliente só vai descobrir em runtime. Com tRPC, se você mudar a assinatura de uma função no servidor, o TypeScript já quebra no cliente na hora — antes de rodar qualquer coisa.

**Como eu usei no projeto:** Criei um router `share` com dois procedimentos:
- `saveProfile` — mutation que salva o perfil do usuário no banco de dados e retorna um UUID
- `getProfile` — query que busca um perfil pelo UUID quando alguém abre um link compartilhado

No cliente, uso assim:
```ts
const save = api.share.saveProfile.useMutation()
const profile = api.share.getProfile.useQuery({ id: shareId })
```

O autocomplete funciona, os tipos são inferidos automaticamente, e se eu mudar qualquer coisa no servidor o TypeScript avisa imediatamente.

---

## SSE — Server-Sent Events

SSE é um protocolo HTTP que permite o servidor enviar dados para o cliente de forma contínua, em uma única conexão que fica aberta. É diferente de WebSocket porque é unidirecional — só o servidor fala, o cliente escuta.

**O problema que ele resolve:** Quando você chama um modelo de linguagem como o Claude, a resposta não chega de uma vez — ela é gerada token por token. Se você esperasse a resposta completa para mandar pro cliente, o usuário ficaria olhando para uma tela em branco por vários segundos. Com SSE, você começa a transmitir cada caractere assim que ele chega, dando a sensação de que o texto está sendo digitado em tempo real.

**Como eu usei no projeto:** Criei duas rotas de API em Next.js (`/api/dilemma` e `/api/profile`) que retornam um `ReadableStream`. Para cada caractere da resposta do Claude, o servidor envia um evento no formato:

```
data: {"token": "A"}

data: {"token": "s"}

data: {"done": true, "profile": {...}}
```

No cliente, criei um hook `useSSEStream` que abre a conexão com `fetch`, lê o stream byte a byte com `ReadableStream` e chama um callback a cada token recebido. O resultado é o efeito de typewriter — texto aparecendo caractere por caractere.

**Por que não usar WebSocket aqui?** Porque a comunicação é só do servidor pro cliente. SSE é mais simples, funciona sobre HTTP normal, e tem reconexão automática nativa no browser.

**Detalhe importante — o SSE aqui é só efeito visual:** O Claude transmite token por token para o servidor (streaming nativo da API), mas nesse projeto eu deliberadamente ignorei esse streaming e esperei a resposta completa antes de repassar pro cliente. O fluxo real é:

```
Claude → (stream nativo) → servidor recebe tudo → aí SIM faz SSE pro cliente
```

Isso acontece porque usei `generateText` do AI SDK, que aguarda a resposta inteira. Se tivesse usado `streamText`, teria os tokens chegando um a um no servidor e poderia repassar em tempo real. O SSE pro cliente é puramente para o efeito de typewriter — o conteúdo já está completo no servidor antes de começar a transmitir.

A razão dessa escolha: preciso parsear o JSON da resposta antes de começar a stremar. Se transmitisse token por token, o cliente receberia fragmentos quebrados como `{"dilemma": "Voc` e não saberia o que fazer. Ao esperar a resposta completa, dou parse, valido com Zod, e só então inicio o SSE com o texto formatado. Se a resposta fosse texto livre em vez de JSON estruturado, valeria usar `streamText` e transmitir diretamente — seria mais rápido e mais honesto.

---

## Vercel AI SDK

O AI SDK é uma biblioteca que abstrai a comunicação com diferentes provedores de modelos de linguagem (Anthropic, OpenAI, etc.) por trás de uma interface unificada. Você troca de provedor mudando uma linha de código.

**O problema que ele resolve:** Cada provedor de IA tem sua própria SDK, seu próprio formato de request, sua própria forma de fazer streaming. O AI SDK padroniza tudo isso: a função `generateText` funciona igual independente de você estar usando Claude, GPT ou qualquer outro modelo.

**Como eu usei no projeto:**
```ts
import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'

const result = await generateText({
  model: anthropic('claude-sonnet-4-5'),
  messages: [{ role: 'user', content: buildDilemmaPrompt(history) }],
})
```

Usei `generateText` (não streaming do SDK) porque queria controle manual sobre o streaming — o Claude gera o JSON completo do dilema, eu extraio o JSON da resposta, valido com Zod, e aí faço meu próprio streaming caractere por caractere. Isso me deu controle total sobre o formato dos eventos SSE e o delay entre os caracteres (12ms por caractere para dar o efeito de terminal).

---

## Como esses três conceitos se conectam no projeto

```
Usuário clica em uma opção
        ↓
useGameSession (hook) chama /api/dilemma via fetch
        ↓
Route Handler recebe o histórico de escolhas
        ↓
AI SDK → Claude gera o próximo dilema (JSON completo)
        ↓
Route Handler abre um ReadableStream e envia caractere por caractere via SSE
        ↓
useSSEStream recebe os tokens e atualiza o estado no cliente em tempo real
        ↓
Quando o jogo termina, tRPC salva o perfil no PostgreSQL e retorna um UUID
        ↓
O link /?result=<uuid> carrega o perfil via tRPC query
```

A divisão de responsabilidades ficou clara: **tRPC para dados persistidos** (salvar e buscar perfis no banco), **SSE para dados em tempo real** (streaming das respostas da IA), e o **AI SDK como camada de abstração** sobre o Claude para não ficar acoplado a um provedor específico.

---

## Drizzle ORM

Drizzle é um ORM TypeScript-first que define o schema do banco diretamente em TypeScript — sem arquivos de configuração separados, sem linguagem própria. O schema vira automaticamente o tipo das suas queries.

**Como eu usei:** Defini a tabela `shared_profiles` com colunas `jsonb` para armazenar o perfil e o histórico de escolhas como JSON. O Drizzle gera as migrations SQL a partir do schema TypeScript e garante que os tipos das queries batem com a estrutura do banco.

```ts
const [row] = await db
  .insert(sharedProfiles)
  .values({ profile, history })
  .returning({ id: sharedProfiles.id })
```

Tudo tipado — o TypeScript sabe o formato do `row` sem precisar de nenhuma anotação manual.

---

## "Como você garante que a IA sempre retorna o formato que você quer?"

Essa é uma das perguntas mais importantes quando se trabalha com LLMs em produção, porque você não tem garantia absoluta — o modelo é uma caixa preta que pode alucinar, adicionar texto fora do formato, ou simplesmente errar a estrutura em casos de borda.

A resposta é: **você cria camadas de defesa**, e cada camada captura um tipo diferente de falha.

### Camada 1 — Prompt Engineering

O primeiro passo é ser extremamente explícito no prompt sobre o formato esperado. No projeto, o prompt termina assim:

```
Retorne APENAS JSON válido neste formato, sem markdown:
{
  "consequence": "...",
  "dilemma": "...",
  "choices": ["opção A", "opção B"]
}
```

"APENAS JSON válido" e "sem markdown" são instruções diretas para o modelo não envolver a resposta em ```json ... ``` ou adicionar texto explicativo antes e depois. Isso resolve a maioria dos casos.

### Camada 2 — Extração por Regex

Mesmo com a instrução, alguns modelos às vezes adicionam um preâmbulo como "Aqui está o JSON:" ou envolvem em markdown. Por isso, antes de tentar parsear, extraio o JSON da resposta com uma regex:

```ts
const match = raw.match(/\{[\s\S]*\}/)
if (!match) throw new Error('No JSON in response')
```

Essa regex pega tudo entre o primeiro `{` e o último `}` da resposta, ignorando qualquer texto antes ou depois. Se não achar nenhum JSON na resposta, já lança um erro antes de tentar parsear.

### Camada 3 — Validação com Zod

Mesmo que o JSON seja válido sintaticamente, o modelo pode retornar campos errados, tipos errados, ou campos faltando. Por isso, depois do `JSON.parse`, passo pelo schema Zod:

```ts
const dilemmaResponseSchema = z.object({
  consequence: z.string(),
  dilemma: z.string().min(10),
  choices: z.tuple([z.string().min(1), z.string().min(1)]),
})

dilemmaResponse = dilemmaResponseSchema.parse(JSON.parse(match[0]))
```

O `.parse()` do Zod lança uma exceção se qualquer campo estiver fora do esperado — tipo errado, campo ausente, string vazia onde não deveria. Isso garante que o objeto que chega no cliente é exatamente o que o TypeScript espera.

### Camada 4 — Try/Catch com fallback

Todas essas três camadas estão dentro de um `try/catch`. Se qualquer uma falhar — seja o modelo retornando lixo, seja o JSON malformado, seja o Zod rejeitando — o erro é capturado e o cliente recebe uma resposta de erro tratada:

```ts
try {
  const result = await generateText({ ... })
  const match = result.text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON in response')
  dilemmaResponse = dilemmaResponseSchema.parse(JSON.parse(match[0]))
} catch (err) {
  return new Response(JSON.stringify({ error: message }), { status: 500 })
}
```

**Resumindo para a entrevista:** Você nunca tem 100% de garantia com LLMs, mas você empilha defesas — prompt explícito, extração robusta, validação de schema, e tratamento de erro — de forma que qualquer desvio do modelo seja capturado antes de chegar no cliente ou causar um crash silencioso.
