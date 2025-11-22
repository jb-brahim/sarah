"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { User, Mail, Calendar, Heart, MapPin, Settings, LogOut, Edit2, Loader2 } from "lucide-react"

interface UserProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any
  onLogout: () => void
}

export default function UserProfileModal({ open, onOpenChange, user, onLogout }: UserProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    interests: user?.interests || ["Monuments", "Nature"],
    memberSince: user?.createdAt || new Date().toLocaleDateString(),
  })

  const bookingHistory: Array<{ id: number; name: string; date: string; status: string }> = [
    { id: 1, name: "Eiffel Tower Tour", date: "2024-11-10", status: "Completed" },
    { id: 2, name: "Hotel Le Marais", date: "2024-11-15", status: "Upcoming" },
    { id: 3, name: "Great Wall Trek", date: "2024-12-05", status: "Upcoming" },
  ]

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsEditing(false)
      // Here you would typically update the user in your backend
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">My Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{formData.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="w-4 h-4" />
                    Member since {formData.memberSince}
                  </p>
                </div>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
              )}
            </div>
          </Card>

          {/* Edit Form */}
          {isEditing && (
            <Card className="p-4 space-y-4 bg-muted/30">
              <div>
                <label className="text-sm font-medium mb-2 block">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Your email"
                  type="email"
                  disabled
                />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest: string, idx: number) => (
                    <div
                      key={idx}
                      className="bg-primary/20 text-primary text-xs rounded-full px-3 py-1 flex items-center gap-2"
                    >
                      {interest}
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            interests: formData.interests.filter((_, i) => i !== idx),
                          })
                        }
                        className="hover:text-primary/70"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </Card>
          )}

          {/* Booking History */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Booking History</h4>
            {bookingHistory.map((booking: { id: number; name: string; date: string; status: string }) => (
              <Card key={booking.id} className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{booking.name}</p>
                  <p className="text-xs text-muted-foreground">{booking.date}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    booking.status === "Completed"
                      ? "bg-green-500/20 text-green-700 dark:text-green-400"
                      : "bg-blue-500/20 text-blue-700 dark:text-blue-400"
                  }`}
                >
                  {booking.status}
                </span>
              </Card>
            ))}
          </div>

          {/* Settings & Logout */}
          <div className="flex gap-2 pt-4 border-t border-border">
            <Button variant="outline" className="flex-1 gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button
              variant="destructive"
              className="flex-1 gap-2"
              onClick={() => {
                onLogout()
                onOpenChange(false)
              }}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
