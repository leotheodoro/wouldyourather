export type Lang = 'pt' | 'en';

export const translations = {
  pt: {
    intro: {
      protocol: 'PROTOCOLO MNEMOSYNE // v4.2.1 // INICIALIZANDO...',
      welcome: 'Bem-vindo ao Protocolo de Avaliação MNEMOSYNE.',
      scenarios: 'Você será submetido a',
      scenariosHighlight: '7 cenários',
      analyzed: 'Suas escolhas serão analisadas.',
      noRightAnswer: 'Não existe resposta certa.',
      startButton: '> INICIAR AVALIAÇÃO',
    },
    dilemma: {
      initializing: 'INICIALIZANDO PROTOCOLO MNEMOSYNE...',
      label: 'DILEMA',
      complexity: 'COMPLEXIDADE:',
      error: '> ERRO: MNEMOSYNE não respondeu.',
      retry: '[TENTAR NOVAMENTE]',
    },
    result: {
      processing: 'PROCESSANDO ANÁLISE MORAL...',
      newProtocol: '> NOVO PROTOCOLO',
      analysisComplete: 'ANÁLISE CONCLUÍDA // PERFIL GERADO',
      similarTo: 'Similar a:',
    },
    traits: {
      empathy: 'Empatia',
      pragmatism: 'Pragmatismo',
      chaos: 'Caos',
      cruelty: 'Crueldade',
    },
    share: {
      trigger: '> COMPARTILHAR RESULTADO',
      title: 'COMPARTILHAR RESULTADO',
      copyLink: '> COPIAR LINK',
      linkCopied: '> LINK COPIADO!',
      close: '> FECHAR',
    },
    page: {
      loading: 'CARREGANDO...',
      notFound: 'Perfil não encontrado.',
    },
  },
  en: {
    intro: {
      protocol: 'MNEMOSYNE PROTOCOL // v4.2.1 // INITIALIZING...',
      welcome: 'Welcome to the MNEMOSYNE Evaluation Protocol.',
      scenarios: 'You will be subjected to',
      scenariosHighlight: '7 scenarios',
      analyzed: 'Your choices will be analyzed.',
      noRightAnswer: 'There is no right answer.',
      startButton: '> START EVALUATION',
    },
    dilemma: {
      initializing: 'INITIALIZING MNEMOSYNE PROTOCOL...',
      label: 'DILEMMA',
      complexity: 'COMPLEXITY:',
      error: '> ERROR: MNEMOSYNE did not respond.',
      retry: '[TRY AGAIN]',
    },
    result: {
      processing: 'PROCESSING MORAL ANALYSIS...',
      newProtocol: '> NEW PROTOCOL',
      analysisComplete: 'ANALYSIS COMPLETE // PROFILE GENERATED',
      similarTo: 'Similar to:',
    },
    traits: {
      empathy: 'Empathy',
      pragmatism: 'Pragmatism',
      chaos: 'Chaos',
      cruelty: 'Cruelty',
    },
    share: {
      trigger: '> SHARE RESULT',
      title: 'SHARE RESULT',
      copyLink: '> COPY LINK',
      linkCopied: '> LINK COPIED!',
      close: '> CLOSE',
    },
    page: {
      loading: 'LOADING...',
      notFound: 'Profile not found.',
    },
  },
} as const;
