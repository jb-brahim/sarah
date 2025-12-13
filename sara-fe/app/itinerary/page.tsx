
"use client"

import SiteHeader from "@/components/site-header"
import ItineraryBuilder from "@/components/itinerary-builder"
import { useLanguage } from "@/lib/language-context"

export default function ItineraryPage() {
    const { t } = useLanguage()

    return (
        <main className="min-h-screen bg-background">
            <SiteHeader />
            <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="space-y-8">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        {t('header.itinerary', 'Your Itinerary')}
                    </h1>
                    <ItineraryBuilder />
                </div>
            </div>
        </main>
    )
}
