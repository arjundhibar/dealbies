import { Button } from "@/components/ui/button"
import { DealsList } from "@/components/deals-list"
import { HottestDealsSidebar } from "@/components/hottest-deal-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"

// Sample data for hottest deals
const hottestDeals = [
  {
    id: "1",
    title: "[Lidl Webshop] Free shipping from €49.99 – activate coupon in the Lidl Plus app",
    score: 1206,
    price: "€0",
    imageUrl: "/generic-supermarket-logo.png",
    dealUrl: "#",
  },
  {
    id: "2",
    title: "Sticker Mule 10 custom stickers for €1",
    score: 496,
    price: "€1",
    imageUrl: "/placeholder.svg?height=64&width=64&query=sticker",
    dealUrl: "#",
  },
  {
    id: "3",
    title: "BYD DOLPHIN SURF Boost (43.2kWh 332Km, 88hp)",
    score: 436,
    price: "€24,990",
    imageUrl: "/placeholder.svg?height=64&width=64&query=car",
    dealUrl: "#",
  },
]

export default function Home() {
  return (
    <div className="mx-auto max-w-[82.5rem] px-4 w-full box-border">
      <div className="space-y-4 lg:m-5">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <Tabs defaultValue="all" className="w-full">
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
          </div>

          <div className="hidden lg:block mt-16">
            <HottestDealsSidebar deals={hottestDeals} />

            <div className="mt-8">
              <Card className="bg-white p-4 dark:bg-dark-secondary">
                <h3 className="font-medium mb-2">Advertisement</h3>
                <div className="bg-gray-100 h-[300px] flex items-center justify-center text-gray-400">Ad Space</div>
                <div className="flex justify-end mt-2">
                  <Button variant="link" className="text-xs text-gray-500 p-0">
                    Show less
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>

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
    </div>
  )
}
