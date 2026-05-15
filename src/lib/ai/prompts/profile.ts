import type { Lang } from '@/lib/i18n';
import type { HistoryItem } from '@/types';

export function buildProfilePrompt(history: HistoryItem[], lang: Lang): string {
  if (lang === 'en') {
    const choicesSummary = history
      .map((item, i) => `Dilemma ${i + 1}: ${item.dilemma}\nChoice: ${item.choices[item.chosen]}`)
      .join('\n\n');

    return `You are MNEMOSYNE. The evaluation protocol is complete. Analyze the full moral pattern.

History of ${history.length} choices:
${choicesSummary}

Generate the moral profile in English:
- archetypeName: dramatic and unique name (e.g. "The Good-Faith Utilitarian", "Armed Benevolence")
- quote: a quote that defines the participant — must sound like an epitaph
- traits: values 0-100 for empathy, pragmatism, chaos, cruelty — based on actual choices
- historicalFigure: historical/fictional figure with a similar moral pattern + reason in 1 sentence
- verdict: 2-3 dramatic sentences about the participant's character

Return ONLY valid JSON in this format, no markdown:
{
  "archetypeName": "...",
  "quote": "...",
  "traits": {
    "empathy": 0,
    "pragmatism": 0,
    "chaos": 0,
    "cruelty": 0
  },
  "historicalFigure": {
    "name": "...",
    "reason": "..."
  },
  "verdict": "..."
}`;
  }

  const choicesSummary = history
    .map((item, i) => `Dilema ${i + 1}: ${item.dilemma}\nEscolha: ${item.choices[item.chosen]}`)
    .join('\n\n');

  return `Você é MNEMOSYNE. O protocolo de avaliação foi concluído. Analise o padrão moral completo.

Histórico das ${history.length} escolhas:
${choicesSummary}

Gere o perfil moral em português (PT-BR):
- archetypeName: nome dramático e único (ex: "O Utilitarista de Má Fé", "A Benevolência Armada")
- quote: citação que define o participante — deve soar como epitáfio
- traits: valores 0-100 para empathy, pragmatism, chaos, cruelty — baseados nas escolhas reais
- historicalFigure: figura histórica/fictícia com padrão moral similar + motivo em 1 frase
- verdict: 2-3 frases dramáticas sobre o caráter do participante

Retorne APENAS JSON válido neste formato, sem markdown:
{
  "archetypeName": "...",
  "quote": "...",
  "traits": {
    "empathy": 0,
    "pragmatism": 0,
    "chaos": 0,
    "cruelty": 0
  },
  "historicalFigure": {
    "name": "...",
    "reason": "..."
  },
  "verdict": "..."
}`;
}
