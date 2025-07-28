import type React from "react"
import { RouteGuard } from "@/components/route-guard"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <RouteGuard allowedRoles={["admin"]}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <AdminSidebar />
                <main className="lg:pl-64">
                    <div className="pt-16 min-h-screen">{children}</div>
                </main>
            </div>
        </RouteGuard>
    )
}