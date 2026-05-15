'use client';

type Props = {
  onStart: () => void;
};

export function IntroScreen({ onStart }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg w-full space-y-8 font-mono">
        <div>
          <p className="text-terminal-green-dark text-xs tracking-widest mb-6">
            {'PROTOCOLO MNEMOSYNE // v4.2.1 // INICIALIZANDO...'}
          </p>
          <h1 className="text-terminal-green text-2xl font-bold tracking-widest mb-6">
            WOULD YOU RATHER
          </h1>
          <div className="text-terminal-green-dim text-sm leading-loose space-y-1">
            <p>Bem-vindo ao Protocolo de Avaliação MNEMOSYNE.</p>
            <p>
              Você será submetido a <span className="text-terminal-green">7 cenários</span>.
            </p>
            <p>Suas escolhas serão analisadas.</p>
          </div>
          <p className="text-[#444] text-sm mt-3">Não existe resposta certa.</p>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="border border-terminal-green text-terminal-green
                     px-6 py-2.5 text-xs tracking-widest font-mono
                     hover:bg-terminal-green hover:text-terminal-bg
                     transition-colors duration-150"
        >
          &gt; INICIAR AVALIAÇÃO
        </button>
      </div>
    </div>
  );
}
