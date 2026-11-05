/** Indicador de carregamento acessível. */
export default function LoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center rounded-3xl border border-white/10 bg-white/[0.035] py-12 shadow-glass"
    >
      <span
        aria-hidden="true"
        className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-accent-400"
      />
      <p className="mt-4 text-sm font-medium text-ink-500">Carregando o clima…</p>
    </div>
  );
}
