interface EmptyStateProps {
  title: string;
  hint?: string;
}

/** Estado vazio (nenhuma busca feita ou nenhum resultado). */
export default function EmptyState({ title, hint }: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative flex flex-col items-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.055] to-white/[0.02] px-6 py-12 text-center shadow-glass sm:py-16"
    >
      <span
        aria-hidden="true"
        className="mb-5 grid size-16 place-items-center rounded-2xl border border-accent-400/20 bg-accent-400/10 text-4xl shadow-sm"
      >
        🌍
      </span>
      <p className="text-xl font-semibold tracking-tight text-ink-900 sm:text-2xl">{title}</p>
      {hint && <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-500">{hint}</p>}
    </div>
  );
}
