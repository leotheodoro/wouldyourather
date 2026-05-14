export type HistoryItem = {
  dilemma: string
  choices: [string, string]
  chosen: 0 | 1
  consequence: string
}

export type DilemmaResponse = {
  consequence: string
  dilemma: string
  choices: [string, string]
}

export type ArchetypeProfile = {
  archetypeName: string
  quote: string
  traits: {
    empathy: number
    pragmatism: number
    chaos: number
    cruelty: number
  }
  historicalFigure: {
    name: string
    reason: string
  }
  verdict: string
}

export type GamePhase = 'intro' | 'streaming' | 'dilemma' | 'result'

export type GameState = {
  phase: GamePhase
  dilemmaIndex: number
  history: HistoryItem[]
  currentDilemma: {
    text: string
    choices: [string, string]
  } | null
  profile: ArchetypeProfile | null
  error: string | null
}
