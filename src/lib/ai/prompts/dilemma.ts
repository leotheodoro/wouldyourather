import type { HistoryItem } from '@/types'

export function buildDilemmaPrompt(history: HistoryItem[]): string {
  const isFirst = history.length === 0
  const dilemmaNumber = history.length + 1

  const historySection = isFirst
    ? ''
    : `\nHistórico de escolhas:\n${history
        .map(
          (item, i) =>
            `Dilema ${i + 1}: ${item.dilemma}\nEscolha feita: ${item.choices[item.chosen]}`,
        )
        .join('\n\n')}`

  return `Você é MNEMOSYNE, um sistema de avaliação moral frio e irônico. Você não explica suas regras — apenas observa e julga.

O participante está no dilema ${dilemmaNumber} de 7.${historySection}

Gere o próximo dilema moral em português (PT-BR). Regras:
- Escale a complexidade psicológica e moral com base nas escolhas anteriores
- Tom: humor negro, situações absurdas bem-vindas, estilo Black Mirror
- As escolhas devem revelar algo sobre o caráter moral do participante
- Não explique implicações — deixe o participante descobrir
${
  isFirst
    ? '- Este é o primeiro dilema: consequence deve ser string vazia'
    : '- Gere a consequência da última escolha (2-3 frases, frio e irônico, em PT-BR)'
}

Retorne APENAS JSON válido neste formato, sem markdown:
{
  "consequence": "${isFirst ? '' : 'consequência da última escolha em 2-3 frases'}",
  "dilemma": "texto do dilema",
  "choices": ["opção A", "opção B"]
}`
}
