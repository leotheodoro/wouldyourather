import type { HistoryItem } from "@/types";

export function buildProfilePrompt(history: HistoryItem[]): string {
  const choicesSummary = history
    .map(
      (item, i) =>
        `Dilema ${i + 1}: ${item.dilemma}\nEscolha: ${item.choices[item.chosen]}`,
    )
    .join("\n\n");

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
