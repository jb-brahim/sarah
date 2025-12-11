"use client"
// Re-trigger build

import { Shield, Instagram, Facebook, Twitter, Mail, ArrowRight, Sparkles, Globe2, Clock } from "lucide-react"
import HeroSection from "@/components/hero-section"
import FeatureShowcase from "../components/feature-showcase"
import TestimonialsSection from "../components/testimonials-section"
import CtaSection from "../components/cta-section"
import ToastDisplay from "@/components/toast-display"
import { useToast } from "@/lib/hooks/use-toast-hook"
import { useLanguage } from "@/lib/language-context"
import SiteHeader from "@/components/site-header"
import Link from "next/link"

export default function Home() {
  const { toasts, removeToast } = useToast()
  const { t } = useLanguage()

  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">

      <SiteHeader />

      {/* Hero */}
      <div id="hero" className="relative">
        <HeroSection />
        {/* Gradient overlay for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />
      </div>

      {/* Modern Grid Navigation (Bento Style) */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto animate-fade-in">
            <span className="text-primary font-semibold tracking-wider text-sm uppercase mb-3 block">{t('journey.sectionTag', 'Start Your Journey')}</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{t('journey.title', 'Explore the World Your Way')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"></span></h2>
            <p className="text-muted-foreground text-lg">{t('journey.description', 'Select a category to begin exploring our curated collection of experiences.')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">

            {/* Destinations - Large Card */}
            <Link href="/destinations" className="md:col-span-8 group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 animate-slide-up">
              <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/10 transition-colors z-10" />
              <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Destinations" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20 flex flex-col justify-end p-8 md:p-12">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 text-accent mb-2 font-medium">
                    <Globe2 size={18} />
                    <span>{t('journey.topRated', 'Top Rated')}</span>
                  </div>
                  <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('journey.destinations', 'Destinations')}</h3>
                  <p className="text-gray-300 max-w-md mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{t('journey.destinationsDesc', 'Explore ancient ruins, vibrant cities, and untouched landscapes across the globe.')}</p>
                  <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-4 transition-all">
                    <span>{t('journey.startExploring', 'Start Exploring')}</span> <ArrowRight size={20} className="text-accent" />
                  </div>
                </div>
              </div>
            </Link>

            <div className="md:col-span-4 flex flex-col gap-6">
              {/* Hotels Card */}
              <Link href="/hotels" className="flex-1 group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/10 transition-colors z-10" />
                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Hotels" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-20 flex flex-col justify-end p-8">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-2 text-accent mb-1 font-medium">
                      <Sparkles size={16} />
                      <span>{t('journey.luxury', 'Luxury')}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{t('journey.stays', 'Stays')}</h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <span>{t('journey.viewCollection', 'View Collection')}</span> <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Tours Card */}
              <Link href="/tours" className="flex-1 group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/10 transition-colors z-10" />
                <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Tours" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-20 flex flex-col justify-end p-8">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-2 text-accent mb-1 font-medium">
                      <Clock size={16} />
                      <span>Adventures</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{t('journey.experiences', 'Tours')}</h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <span>Find Experiences</span> <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      </section>

      <div id="about">
        <FeatureShowcase />
      </div>

      <div id="testimonials" className="bg-secondary/20">
        <TestimonialsSection />
      </div>

      <CtaSection />

      {/* Ultra Modern Footer */}
      <footer className="bg-background border-t border-border pt-20 pb-10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

            {/* Brand */}
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white text-xl shadow-lg">
                  <Globe2 size={24} />
                </div>
                <span className="font-bold text-2xl tracking-tight">Dream<span className="text-primary">Travels</span></span>
              </Link>
              <p className="text-muted-foreground leading-relaxed">
                Crafting the future of travel with AI-driven personalization and immersive experiences.
              </p>
              <div className="flex gap-4">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2"><Sparkles size={16} className="text-accent" /> Explore</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/destinations" className="hover:text-primary transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Destinations</Link></li>
                <li><Link href="/hotels" className="hover:text-primary transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Hotels</Link></li>
                <li><Link href="/tours" className="hover:text-primary transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Tours</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-lg mb-6">Support</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-bold text-lg mb-6">Stay Updated</h4>
              <p className="text-sm text-muted-foreground mb-4">Subscribe for exclusive offers and travel inspiration.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email" className="flex-1 bg-secondary rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 DreamTravels. Built for the Future.</p>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50">
              <Shield size={14} className="text-primary" />
              <span>Secure Booking</span>
            </div>
          </div>
        </div>
      </footer>

      <ToastDisplay toasts={toasts} onRemove={removeToast} />

    </main>
  )
}
