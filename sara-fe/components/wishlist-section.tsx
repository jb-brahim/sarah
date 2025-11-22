"use client"
import { useState } from "react"
import { Heart, Trash2, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import useWishlist from "@/lib/hooks/use-wishlist"

export default function WishlistSection() {
  const { items: wishlist, removeItem, clear } = useWishlist()
  const [loading] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Your Wishlist is Empty</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Add your favorite sites, hotels, and tours to your wishlist to save them for later.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Wishlist</h2>
          <p className="text-sm text-muted-foreground mt-1">{wishlist.length} saved items</p>
        </div>
        <Button variant="outline" size="sm" onClick={clear}>
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => {
          const key = item.id ?? (item as any)._id ?? JSON.stringify(item)
          return (
            <Card key={key} className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden relative group">
                {item.image || (item as any).images?.[0] ? (
                  <img
                    src={item.image || (item as any).images?.[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Heart className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2">
                  <Heart className="w-4 h-4 fill-current" />
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col">
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{item.name}</h3>
                  <span className="text-xs text-muted-foreground bg-primary/10 inline-block rounded px-2 py-1 mt-2">
                    {(item.type || "").charAt(0).toUpperCase() + (item.type || "").slice(1)}
                  </span>
                </div>

                <div className="space-y-1 text-sm text-muted-foreground flex-1">
                  {item.rating && (
                    <p>⭐ {item.rating.toFixed(1)} Rating</p>
                  )}
                  {(item.price || (item as any).entryFee) && (
                    <p className="font-semibold text-primary">${item.price ?? (item as any).entryFee}</p>
                  )}
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem(item.id ?? (item as any)._id ?? "")}
                  className="w-full mt-2"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
