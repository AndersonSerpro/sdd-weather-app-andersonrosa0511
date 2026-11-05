/** Indicador de carregamento acessível. */
export default function LoadingState() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-3 py-16">
      <span
        aria-hidden="true"
        className="h-10 w-10 animate-spin rounded-full border-4 border-ink-900/15 border-t-accent-500"
      />
      <p className="text-ink-500">Carregando o clima…</p>
    </div>
  );
}
