interface ContentItem {
  title: string;
  description: string;
  category: string;
  icon?: string;
}

interface ContentShowcaseProps {
  title: string;
  description: string;
  items: ContentItem[];
}

export function ContentShowcase({
  title,
  description,
  items,
}: ContentShowcaseProps) {
  return (
    <section className="py-20 sm:py-28 border-t border-slate-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-lg text-slate-300 leading-relaxed">{description}</p>
        </div>

        {/* Content cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/30 to-slate-950/30 overflow-hidden hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all" />
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                    {item.category}
                  </span>
                  {item.icon && <span className="text-2xl">{item.icon}</span>}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
