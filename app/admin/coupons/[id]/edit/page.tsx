import { AdminCouponForm } from "@/components/admin/admin-coupon-form"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function EditCoupon({ params }: { params: { id: string } }) {
  const coupon = await prisma.coupon.findUnique({
    where: { id: params.id },
  })

  if (!coupon) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Coupon</h1>
        <p className="text-muted-foreground">Update the details of this coupon.</p>
      </div>

      <AdminCouponForm coupon={coupon} />
    </div>
  )
}
