interface Stat {
  label: string;
  value: string;
  detail: string;
}

interface StatsGridProps {
  stats: Stat[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-xl border border-slate-800/50 bg-slate-900/30 p-6 hover:border-blue-500/50 hover:bg-slate-900/50 transition-all backdrop-blur-sm"
            >
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
                  <span className="h-2 w-2 bg-blue-400 rounded-full" />
                </div>
              </div>
              <p className="mt-4 text-3xl sm:text-4xl font-bold text-white">{stat.value}</p>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">{stat.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
