interface HeroSectionProps {
  tag: string;
  title: string;
  description: string;
  primaryAction: string;
  secondaryAction: string;
}

export function HeroSection({
  tag,
  title,
  description,
  primaryAction,
  secondaryAction,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 sm:pt-32 sm:pb-48">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full filter blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Tag */}
        <div className="mb-6 inline-flex">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-800/50 bg-blue-950/30 px-3 py-1 text-xs font-medium text-blue-200">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            {tag}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
          {title.split(" ").map((word, idx) => (
            <span key={idx}>
              {word}{" "}
            </span>
          ))}
        </h1>

        {/* Description */}
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-300 mb-12 leading-relaxed">
          {description}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 active:scale-95">
            {primaryAction}
          </button>
          <button className="inline-flex items-center justify-center px-6 py-3 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:border-slate-400 hover:text-white hover:bg-slate-800/50 transition-all">
            {secondaryAction}
          </button>
        </div>
      </div>
    </section>
  );
}
