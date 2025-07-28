"use client"

import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type { RootState } from "@/lib/store"

export function useAuth(requiredRole?: "admin" | "student") {
  const { user, isAuthenticated, token } = useSelector((state: RootState) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push("/auth/login")
      return
    }

    if (requiredRole && user?.role !== requiredRole) {
      router.push("/unauthorized")
      return
    }
  }, [isAuthenticated, token, user, requiredRole, router])

  return { user, isAuthenticated }
}
