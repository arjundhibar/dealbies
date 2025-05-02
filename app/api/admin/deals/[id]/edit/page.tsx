import { AdminDealForm } from "@/components/admin/admin-deal-form"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { formatDealForForm } from "@/lib/prisma-helper"

export default async function EditDeal({ params }: { params: { id: string } }) {
  const deal = await prisma.deal.findUnique({
    where: { id: params.id },
  })

  if (!deal) {
    notFound()
  }

  // Format the deal for the form
  const formattedDeal = formatDealForForm(deal)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Deal</h1>
        <p className="text-muted-foreground">Update the details of this deal.</p>
      </div>

      <AdminDealForm deal={formattedDeal} />
    </div>
  )
}
