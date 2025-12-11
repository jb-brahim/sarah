"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Plane } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function CtaSection() {
    const { t } = useLanguage()

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary -z-20"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-20 mixed-blend-overlay -z-10"></div>

            <div className="max-w-5xl mx-auto px-4 text-center">
                <h2 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
                    {t('features.cta', 'Ready to Start Your Adventure?')}
                </h2>
                <p className="text-primary-foreground/80 text-xl mb-10 max-w-2xl mx-auto">
                    {t('features.ctaDesc', 'Create your custom itinerary today and unlock exclusive deals on top-rated hotels and tours.')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/book">
                        <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 h-12 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                            Plan My Trip
                        </Button>
                    </Link>
                    <Link href="/destinations">
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold text-lg px-8 h-12 rounded-full">
                            Browse Destinations <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
