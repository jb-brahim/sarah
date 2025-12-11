import type React from "react"
import { Shield, Wifi, Zap, Globe } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
}

export default function FeatureShowcase() {
  const { t } = useLanguage()

  const features: Feature[] = [
    {
      icon: <Shield size={24} />,
      title: t('features.privacy', 'Privacy-First Design'),
      description: t('features.privacyDesc', 'On-device processing. No tracking. Your data stays yours.'),
      gradient: "from-primary to-accent/50",
    },
    {
      icon: <Wifi size={24} />,
      title: t('features.offline', 'Offline-First'),
      description: t('features.offlineDesc', 'Build itineraries, explore destinations offline. Sync when ready.'),
      gradient: "from-accent to-primary/50",
    },
    {
      icon: <Zap size={24} />,
      title: t('features.ai', 'AI-Powered'),
      description: t('features.aiDesc', 'Intelligent recommendations that learn your preferences.'),
      gradient: "from-primary/70 to-accent",
    },
    {
      icon: <Globe size={24} />,
      title: t('features.multilang', 'Multi-Language'),
      description: t('features.multilangDesc', 'Support for English, French, and Arabic with RTL support.'),
      gradient: "from-accent/70 to-primary",
    },
  ]

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">{t('features.title', 'Why Portail Touristique?')}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('features.description', 'Built for the future with the latest web standards, privacy-respecting architecture, and delightful user experiences.')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, idx) => (
          <div
            key={feature.title}
            className="group relative p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden animate-scale-in"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {/* Gradient background */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${feature.gradient} transition-opacity duration-300`}
            ></div>

            {/* Content */}
            <div className="relative space-y-3">
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} text-white flex items-center justify-center`}
              >
                {feature.icon}
              </div>

              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 rounded-3xl p-8 md:p-12 border border-primary/20 text-center space-y-6">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground">{t('features.cta', 'Ready to experience the future of travel?')}</h3>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {t('features.ctaDesc', 'Start exploring destinations with AI-powered recommendations, all while maintaining your privacy.')}
        </p>
        <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
          {t('features.getStarted', 'Get Started Today')}
        </button>
      </div>
    </section>
  )
}
