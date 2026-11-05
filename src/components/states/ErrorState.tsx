interface ErrorStateProps {
  message: string;
  context?: string;
  onRetry: () => void;
}

/** Estado de erro com ação de "tentar novamente". */
export default function ErrorState({ message, context, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-3xl border border-coral/20 bg-coral/[0.06] px-6 py-12 text-center text-ink-900 shadow-glass sm:py-16"
    >
      <span
        aria-hidden="true"
        className="mb-4 grid size-14 place-items-center rounded-2xl bg-coral/10 text-3xl text-coral"
      >
        ⚠️
      </span>
      {context && <p className="mb-1 font-semibold">{context}</p>}
      <p className="max-w-lg text-ink-700">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
      >
        Tentar novamente
      </button>
    </div>
  );
}
