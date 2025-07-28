import type React from "react"
import { RouteGuard } from "@/components/route-guard"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return <RouteGuard allowedRoles={["admin", "student"]}>{children}</RouteGuard>
}
