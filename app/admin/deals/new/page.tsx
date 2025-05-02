import { AdminDealForm } from "@/components/admin/admin-deal-form"

export default function NewDeal() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Deal</h1>
        <p className="text-muted-foreground">Create a new deal on the platform.</p>
      </div>

      <AdminDealForm />
    </div>
  )
}
