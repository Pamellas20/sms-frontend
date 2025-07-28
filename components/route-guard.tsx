"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import { initializeAuth } from "@/lib/slices/authSlice"
import { decodeJWT, isTokenExpired } from "@/lib/utils/jwt"
import { Loader2 } from "lucide-react"

interface RouteGuardProps {
    children: React.ReactNode
    allowedRoles?: ("admin" | "student")[]
    requireAuth?: boolean
}

export function RouteGuard({ children, allowedRoles, requireAuth = true }: RouteGuardProps) {
    const { user, isAuthenticated, token, isLoading } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        // Initialize auth state on mount
        dispatch(initializeAuth())
    }, [dispatch])

    useEffect(() => {
        if (isLoading) return

        // Check if authentication is required
        if (requireAuth) {
            if (!token || isTokenExpired(token)) {
                router.push("/auth/login")
                return
            }

            // Decode token to get user role
            const payload = decodeJWT(token)
            if (!payload) {
                router.push("/auth/login")
                return
            }

            // Check role-based access
            if (allowedRoles && !allowedRoles.includes(payload.role)) {
                router.push("/unauthorized")
                return
            }
        }
    }, [isAuthenticated, token, user, allowedRoles, requireAuth, router, isLoading])

    // Show loading while initializing or checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    // Show loading while redirecting
    if (requireAuth && (!token || isTokenExpired(token))) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Redirecting to login...</p>
                </div>
            </div>
        )
    }

    // Check role access with token
    if (requireAuth && allowedRoles && token) {
        const payload = decodeJWT(token)
        if (!payload || !allowedRoles.includes(payload.role)) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Checking permissions...</p>
                    </div>
                </div>
            )
        }
    }

    return <>{children}</>
}
