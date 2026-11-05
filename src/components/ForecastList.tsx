import type { ForecastDay, Unit } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  forecast: ForecastDay[];
  unit: Unit;
}

/** Grid responsivo com a previsão de 5 dias. */
export default function ForecastList({ forecast, unit }: ForecastListProps) {
  return (
    <section aria-label="Previsão de 5 dias">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent-400">
            Panorama
          </p>
          <h2 className="text-xl font-bold tracking-tight">Próximos 5 dias</h2>
        </div>
        <span aria-hidden="true" className="text-lg tracking-[0.24em] text-ink-500/60">
          ·····
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {forecast.map((day, index) => (
          <ForecastCard key={day.date} day={day} index={index} unit={unit} />
        ))}
      </ul>
    </section>
  );
}
