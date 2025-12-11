"use client"

import SiteHeader from "@/components/site-header"
import ToursSection from "@/components/tours-section"
import { Compass, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function ToursPage() {
    const { t } = useLanguage()

    return (
        <main className="min-h-screen bg-background text-foreground pb-20">
            <SiteHeader />

            {/* Page Header */}
            <div className="relative pt-32 pb-16 px-4 bg-secondary/30">
                <div className="max-w-7xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6 animate-fade-in">
                        <Compass size={14} /> Curated Adventures
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 animate-slide-up">
                        {t('journey.experiences', 'Experiences That')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Inspire</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
                        {t('journey.experiencesDesc', 'Expertly guided tours that take you beyond the typical tourist path. Immerse yourself in local culture and history.')}
                    </p>
                </div>
                <div className="absolute top-40 right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl -z-10" />
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 animate-fade-in-slow">
                <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-1 md:p-8">
                    <ToursSection />
                </div>
            </div>
        </main>
    )
}
