import { AdminCouponForm } from "@/components/admin/admin-coupon-form"

export default function NewCoupon() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Coupon</h1>
        <p className="text-muted-foreground">Create a new coupon on the platform.</p>
      </div>

      <AdminCouponForm />
    </div>
  )
}
