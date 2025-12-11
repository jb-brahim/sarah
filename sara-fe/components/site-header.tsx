"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X, Globe2, Sparkles, Heart, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/hooks/use-auth"
import { useLanguage } from "@/lib/language-context"
import LanguageSwitcher from "@/components/language-switcher"
import UserProfile from "@/components/user-profile"
import AuthModal from "@/components/auth-modal"

export default function SiteHeader() {
    const pathname = usePathname()
    const { t } = useLanguage()
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const { user, setUser, logout } = useAuth()

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navLinks = [
        { href: "/destinations", label: t('header.destinations', 'Destinations') },
        { href: "/hotels", label: t('header.hotels', 'Hotels') },
        { href: "/tours", label: t('header.tours', 'Tours') },
        { href: "/about", label: t('header.about', 'About') },
    ]

    const isActive = (path: string) => pathname === path

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled
                        ? "bg-background/80 backdrop-blur-xl border-border/50 py-3 shadow-sm"
                        : "bg-transparent border-transparent py-5"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg group-hover:shadow-primary/25 transition-all duration-300 group-hover:scale-105">
                                <Globe2 className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-xl tracking-tight text-foreground leading-none">
                                    Dream<span className="text-primary">Travels</span>
                                </span>
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Est. 2025</span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-background/50 backdrop-blur-md border border-border/50 shadow-sm">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive(link.href)
                                            ? "text-primary-foreground bg-primary shadow-md"
                                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="hidden md:flex items-center gap-3">
                                                        <LanguageSwitcher />
                            {user ? (
                                <>
                                    <Link href="/wishlist">
                                        <Button variant="ghost" size="icon" className="hover:bg-secondary/50">
                                            <Heart className="w-5 h-5" />
                                        </Button>
                                    </Link>
                                    <Link href="/reservations">
                                        <Button variant="ghost" size="icon" className="hover:bg-secondary/50">
                                            <Calendar className="w-5 h-5" />
                                        </Button>
                                    </Link>
                                    <UserProfile user={user} onLogout={logout} />
                                </>
                            ) : (
                                <Button
                                    variant="ghost"
                                    onClick={() => setAuthModalOpen(true)}
                                    className="font-medium hover:bg-secondary/50"
                                >
                                    Sign In
                                </Button>
                            )}
                            <Link href="/book">
                                <Button
                                    className="rounded-full bg-gradient-to-r from-accent to-accent/90 hover:opacity-90 shadow-lg shadow-accent/20 font-bold"
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Book Now
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className="md:hidden p-2 text-foreground active:scale-95 transition-transform"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-2xl p-6 flex flex-col gap-4 animate-slide-down">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-lg font-medium text-foreground p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="h-px bg-border my-2"></div>
                                                <div className="px-2 py-2">
                                                    <LanguageSwitcher />
                                                </div>
                                                <div className="h-px bg-border my-2"></div>
                        {user ? (
                            <>
                                <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-foreground p-2 rounded-lg hover:bg-secondary/50 transition-colors flex items-center gap-2">
                                    <Heart className="w-5 h-5" />
                                    My Wishlist
                                </Link>
                                <Link href="/reservations" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-foreground p-2 rounded-lg hover:bg-secondary/50 transition-colors flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    My Reservations
                                </Link>
                                <UserProfile user={user} onLogout={logout} />
                            </>
                        ) : (
                            <Button onClick={() => setAuthModalOpen(true)} className="w-full justify-center">Sign In</Button>
                        )}
                        <Link href="/book" onClick={() => setMobileMenuOpen(false)} className="w-full">
                            <Button className="w-full justify-center bg-accent text-accent-foreground">Book Your Trip</Button>
                        </Link>
                    </div>
                )}
            </header>

            <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} onSuccess={setUser} />
        </>
    )
}
