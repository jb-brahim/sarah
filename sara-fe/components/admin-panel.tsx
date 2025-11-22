"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { useApi } from "@/lib/hooks/use-api"
import { Users, BarChart3, TrendingUp, Loader2 } from "lucide-react"

interface AdminStats {
  totalUsers: number
  totalReservations: number
  totalRevenue: number
  averageRating: number
}

interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
  createdAt: string
}

export default function AdminPanel() {
  const { data: stats, loading: statsLoading } = useApi<AdminStats>(() => apiClient.admin.getStats())
  const { data: users, loading: usersLoading } = useApi<User[]>(() => apiClient.admin.getUsers())

  const loading = statsLoading || usersLoading

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
            <Users className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats?.totalUsers || 0}</p>
          <p className="text-xs text-green-600 dark:text-green-400">+5% from last month</p>
        </Card>

        <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Total Reservations</p>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats?.totalReservations || 0}</p>
          <p className="text-xs text-green-600 dark:text-green-400">+12% from last month</p>
        </Card>

        <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
            <BarChart3 className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-foreground">${stats?.totalRevenue || 0}</p>
          <p className="text-xs text-green-600 dark:text-green-400">+8% from last month</p>
        </Card>

        <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Avg. Rating</p>
            <span className="text-2xl">⭐</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats?.averageRating?.toFixed(1) || 0}</p>
          <p className="text-xs text-muted-foreground">Based on reviews</p>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Users Management</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Joined</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-secondary/50 transition">
                  <td className="py-3 px-4 text-foreground">{user.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.isAdmin
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200"
                    }`}>
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Management Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-foreground">Manage Sites</h3>
          <p className="text-sm text-muted-foreground">Create, edit, and delete tourist sites</p>
          <Button className="w-full">Go to Sites</Button>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-foreground">Manage Hotels</h3>
          <p className="text-sm text-muted-foreground">Manage hotel listings and details</p>
          <Button className="w-full">Go to Hotels</Button>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-foreground">Manage Tours</h3>
          <p className="text-sm text-muted-foreground">Create and edit tour packages</p>
          <Button className="w-full">Go to Tours</Button>
        </Card>
      </div>
    </div>
  )
}
