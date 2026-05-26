interface FeatureSectionProps {
  title: string;
  description: string;
  highlight?: string;
}

interface FeatureItem {
  icon: string;
  title: string;
  detail: string;
}

interface FeaturesProps {
  section: FeatureSectionProps;
  features: FeatureItem[];
}

export function FeatureSection({ section, features }: FeaturesProps) {
  return (
    <section className="py-20 sm:py-28 border-t border-slate-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{section.title}</h2>
          <p className="text-lg text-slate-300 leading-relaxed">{section.description}</p>
          {section.highlight && (
            <p className="mt-4 text-sm text-blue-300 font-medium">{section.highlight}</p>
          )}
        </div>

        {/* Features grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-950/50 p-6 hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all duration-300"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-xl group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
