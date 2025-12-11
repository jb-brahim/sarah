"use client"

import { Star, Quote } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const testimonialsData = [
    {
        name: "Sarah Johnson",
        role: "Adventure Traveler",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
        key: "testimonials.sarah"
    },
    {
        name: "Michael Chen",
        role: "Food Critic",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
        key: "testimonials.michael"
    },
    {
        name: "Emma Davis",
        role: "Family Vacationer",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop",
        key: "testimonials.emma"
    }
]

export default function TestimonialsSection() {
    const { t } = useLanguage()

    const testimonials = testimonialsData.map(t_data => ({
        ...t_data,
        content: t(t_data.key, '')
    })).map((item, idx) => ({
        ...item,
        rating: idx === 2 ? 4 : 5
    }))

    return (
        <section className="py-24 bg-secondary/30 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute top-10 left-10 text-primary/10 rotate-12"><Quote size={120} /></div>
                <div className="absolute bottom-10 right-10 text-primary/10 -rotate-12"><Quote size={120} /></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">{t('testimonials.title', 'What Travelers Say')}</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t('testimonials.description', 'Join thousands of satisfied explorers who have found their perfect journey with us.')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t_item, i) => (
                        <div key={i} className="bg-background/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 group">
                            <div className="flex items-center gap-4 mb-6">
                                <img src={t_item.image} alt={t_item.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary transition-all" />
                                <div>
                                    <h4 className="font-bold text-foreground">{t_item.name}</h4>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{t_item.role}</p>
                                </div>
                            </div>

                            <div className="flex mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className={`${i < t_item.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} mr-1`} />
                                ))}
                            </div>

                            <p className="text-muted-foreground italic leading-relaxed">"{t_item.content}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
