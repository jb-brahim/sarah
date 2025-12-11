"use client"

import { Globe2, Sparkles, Users, Award, Heart, Zap } from "lucide-react"
import SiteHeader from "@/components/site-header"
import ToastDisplay from "@/components/toast-display"
import { useToast } from "@/lib/hooks/use-toast-hook"
import Link from "next/link"

export default function About() {
  const { toasts, removeToast } = useToast()

  const values = [
    {
      icon: Globe2,
      title: "Global Reach",
      description: "Connecting travelers with experiences across 150+ destinations worldwide."
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "Leveraging AI and machine learning for personalized travel recommendations."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a vibrant community of adventurers and travel enthusiasts."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to delivering premium travel experiences and exceptional service."
    },
    {
      icon: Heart,
      title: "Sustainability",
      description: "Promoting responsible travel that respects local cultures and environments."
    },
    {
      icon: Zap,
      title: "Efficiency",
      description: "Streamlining every step of your journey from planning to return."
    }
  ]

  const team = [
    {
      name: "Sarah",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000"
    },
    {
      name: "Ahmed",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000"
    },
    {
      name: "Leila",
      role: "Head of Partnerships",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000"
    }
  ]

  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Globe2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">About Us</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Redefining <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Travel Experiences</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              At DreamTravels, we believe every journey should be unforgettable. We're combining cutting-edge technology with genuine hospitality to create personalized travel experiences that matter.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2025, DreamTravels began with a simple vision: to make travel planning effortless and inspiring. Our founder, Sarah, realized that traditional travel platforms lacked the personal touch that transforms a trip into a life-changing experience.
                </p>
                <p>
                  Today, we've grown into a dynamic platform serving thousands of travelers worldwide. We've partnered with luxury hotels, authentic tour operators, and local guides who share our commitment to excellence.
                </p>
                <p>
                  Our AI-powered recommendation engine learns from your preferences, making each suggestion more personalized than the last. We're not just booking trips; we're crafting memories.
                </p>
              </div>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000" 
                alt="Team working together" 
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div 
                  key={index}
                  className="group p-8 rounded-2xl border border-border bg-secondary/30 hover:bg-secondary/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Passionate individuals united by a love for travel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div 
                key={index}
                className="group rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative h-64 overflow-hidden bg-secondary">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6 bg-background">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-accent font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Happy Travelers" },
              { number: "150+", label: "Destinations" },
              { number: "1000+", label: "Properties" },
              { number: "4.9★", label: "Average Rating" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-8 rounded-2xl bg-secondary/30 border border-border hover:border-primary/50 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 p-12 text-center space-y-6">
            <h2 className="text-4xl font-bold">Ready to Start Your Journey?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of travelers who've discovered their next unforgettable experience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/destinations" className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
                Explore Destinations
              </Link>
              <Link href="/" className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-primary text-primary font-semibold hover:bg-primary/10 transition-colors">
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
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
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/destinations" className="hover:text-primary transition-colors">Destinations</Link></li>
                <li><Link href="/hotels" className="hover:text-primary transition-colors">Hotels</Link></li>
                <li><Link href="/tours" className="hover:text-primary transition-colors">Tours</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Support</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 DreamTravels. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <ToastDisplay toasts={toasts} onRemove={removeToast} />
    </main>
  )
}
