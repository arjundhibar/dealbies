  // app/admin/layout.tsx
  import { AdminSidebar } from "@/components/admin/admin-sidebar"
import ProtectedAdminLayout from "./protected-admin-layout"
 

  export default function AdminLayout({ children }: { children: React.ReactNode }) {

    return (
     
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8">{children}</main>
        </div>
        
    )
  }
