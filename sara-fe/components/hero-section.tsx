export default function HeroSection() {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden py-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div
          className="absolute top-40 right-10 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute -bottom-8 left-1/2 w-72 h-72 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float-slow"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 animate-slide-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-fade-in-slow">
          <Zap size={16} />
          Introducing the Future of Web Travel
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold text-pretty leading-tight">
          <span className="text-foreground inline-block animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Explore the world,
          </span>
          <br />
          <span
            className="bg-gradient-to-r from-primary to-accent/50 bg-clip-text text-transparent inline-block animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            on your terms
          </span>
        </h1>

        <p
          className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          AI-powered recommendations that respect your privacy. Build itineraries offline. Experience travel like never
          before.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-smooth hover:shadow-lg hover:shadow-primary/20 hover:scale-105 animate-scale-in group relative overflow-hidden">
            <span className="relative z-10">Start Exploring</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-96 transition-transform duration-1000"></div>
          </button>
          <button
            className="px-8 py-3 border border-border rounded-lg font-semibold text-foreground hover:bg-secondary/50 transition-smooth hover:scale-105 animate-scale-in group relative overflow-hidden"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="relative z-10">Learn More</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 group-hover:via-primary/20 transition-all duration-500"></div>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-12">
          {[
            { icon: "100%", label: "Privacy First", delay: "0s" },
            { icon: "5000+", label: "Destinations", delay: "0.1s" },
            { icon: "Offline", label: "Always Ready", delay: "0.2s" },
          ].map((badge, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-white/50 dark:bg-card/50 backdrop-blur border border-border/50 animate-slide-up hover:shadow-lg hover:border-primary/50 transition-smooth group"
              style={{ animationDelay: badge.delay }}
            >
              <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                {badge.icon}
              </div>
              <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                {badge.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Zap({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
  )
}
