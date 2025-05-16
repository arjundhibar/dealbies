import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import prisma from "@/lib/prisma"
import { BarChart, Users, ShoppingBag, Ticket } from "lucide-react"

export default async function AdminDashboard() {
  // Get counts for dashboard
  const userCount = await prisma.user.count()
  const dealCount = await prisma.deal.count()
  const couponCount = await prisma.coupon.count()
  const commentCount = await prisma.comment.count()

  // Get recent users
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the admin dashboard.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dealCount}</div>
            <p className="text-xs text-muted-foreground">Posted deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{couponCount}</div>
            <p className="text-xs text-muted-foreground">Posted coupons</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commentCount}</div>
            <p className="text-xs text-muted-foreground">User comments</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>Recently registered users on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
