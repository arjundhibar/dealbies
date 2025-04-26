import { DealsList } from "@/components/deals-list"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="w-full">
        <div className="bg-white rounded-md border p-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Deals</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="discussed">Most Discussed</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <DealsList />
        </TabsContent>

        <TabsContent value="popular" className="mt-0">
          <DealsList initialSort="hottest" />
        </TabsContent>

        <TabsContent value="discussed" className="mt-0">
          <DealsList initialSort="comments" />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-bold mb-2">About DealHunter</h3>
            <p className="text-sm text-muted-foreground">
              DealHunter is a community-driven platform where users can share and discover the best deals, discounts,
              and offers. Join our community to never miss a great deal again!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-bold mb-2">How It Works</h3>
            <p className="text-sm text-muted-foreground">
              Members post deals they find online or in stores. Other members vote and comment on these deals to help
              everyone find the best offers available.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-bold mb-2">Join Our Community</h3>
            <p className="text-sm text-muted-foreground">
              Sign up to post deals, save your favorites, and get notified about the hottest offers. Our community helps
              you save money on your favorite products and services.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
