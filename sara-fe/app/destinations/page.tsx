"use client"

import SiteHeader from "@/components/site-header"
import RecommendationsSection from "@/components/recommendations-section"
import { Map, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function DestinationsPage() {
    const { t } = useLanguage()

    return (
        <main className="min-h-screen bg-background text-foreground pb-20">
            <SiteHeader />

            {/* Page Header */}
            <div className="relative pt-32 pb-16 px-4 bg-secondary/30">
                <div className="max-w-7xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 animate-fade-in">
                        <Map size={14} /> {t('pages.destinationsTag', 'Global Discovery')}
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 animate-slide-up">
                        {t('pages.destinationsTitle', 'World Class')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Destinations</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
                        {t('pages.destinationsDesc', 'From ancient wonders to modern marvels, explore the most breathtaking locations our planet has to offer.')}
                    </p>
                </div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 animate-fade-in-slow">
                <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-1 md:p-8">
                    <RecommendationsSection showAI={false} />
                </div>
            </div>
        </main>
    )
}
