"use client"
import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, LogOut, Settings, Heart, Calendar } from "lucide-react"

interface UserProfile {
  name: string
  email: string
  avatar?: string
  joinedDate?: string
  preferences?: string[]
}

interface UserProfileProps {
  user: UserProfile & { id?: string } | null
  onLogout?: () => void
}

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold hover:shadow-lg transition"
      >
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
        ) : (
          user.name?.charAt(0).toUpperCase()
        )}
      </button>

      {isOpen && (
        <Card className="absolute right-0 top-12 w-80 z-50 p-0 overflow-hidden shadow-xl">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-semibold">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <p className="text-white/80 text-sm">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-4 space-y-4 border-b border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Member Since</p>
              <p className="text-sm font-medium text-foreground">
                {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : "2025"}
              </p>
            </div>
            {user.preferences && user.preferences.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {user.preferences.map((pref, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 space-y-2">
            <Link href="/reservations" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                My Reservations
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Favorites
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start"
              size="sm"
              onClick={() => {
                setIsOpen(false)
                onLogout?.()
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
