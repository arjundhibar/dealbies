import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import prisma from "@/lib/prisma"
import { DollarSign, Users, Tag, Ticket } from "lucide-react"
import { AdminRecentDeals } from "@/components/admin/admin-recent-deals"
import { AdminRecentCoupons } from "@/components/admin/admin-recent-coupons"

export default async function AdminDashboard() {
  // Get counts for dashboard
  const dealsCount = await prisma.deal.count()
  const couponsCount = await prisma.coupon.count()
  const usersCount = await prisma.user.count()

  // Calculate total votes
  const votesCount = await prisma.vote.count()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Deal Hunter admin dashboard.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dealsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{couponsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{votesCount}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="deals">
        <TabsList>
          <TabsTrigger value="deals">Recent Deals</TabsTrigger>
          <TabsTrigger value="coupons">Recent Coupons</TabsTrigger>
        </TabsList>
        <TabsContent value="deals" className="mt-4">
          <AdminRecentDeals />
        </TabsContent>
        <TabsContent value="coupons" className="mt-4">
          <AdminRecentCoupons />
        </TabsContent>
      </Tabs>
    </div>
  )
}
