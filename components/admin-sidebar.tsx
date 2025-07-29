"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Users, GraduationCap, Settings, BarChart3, Menu } from "lucide-react"

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Students", href: "/admin/students", icon: GraduationCap },
]

interface SidebarContentProps {
    onItemClick?: () => void
    isMobile?: boolean
}

function SidebarContent({ onItemClick, isMobile = false }: SidebarContentProps) {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
                    <p className="text-sm text-muted-foreground mt-1">Management Dashboard</p>
                </div>
            </div>
            <nav className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onItemClick}
                                className={cn(
                                    "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white",
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                        isActive
                                            ? "text-primary-foreground"
                                            : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300",
                                    )}
                                />
                                {item.name}
                            </Link>
                        )
                    })}
                </div>
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-muted-foreground">
                    <p>EduManage v1.0</p>
                    <p>Admin Dashboard</p>
                </div>
            </div>
        </div>
    )
}

export function AdminSidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleClose = () => setIsOpen(false)

    if (!isMounted) {
        return (
            // Position below navbar by adding top-16 (navbar height is h-16)
            <div className="lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:top-16 lg:bg-white lg:dark:bg-gray-800 lg:shadow-lg lg:z-30">
                <div className="flex flex-col h-full bg-white dark:bg-gray-800">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
                        <p className="text-sm text-muted-foreground mt-1">Management Dashboard</p>
                    </div>
                    <nav className="flex-1 p-4">
                        <div className="space-y-2">
                            {navigation.map((item) => (
                                <div
                                    key={item.name}
                                    className="flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300"
                                >
                                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </nav>
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Mobile Sidebar */}
            <div className="lg:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            // Position below navbar with proper spacing
                            className="fixed top-20 left-4 z-40 lg:hidden bg-white dark:bg-gray-800 shadow-md"
                        >
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open sidebar</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <SidebarContent onItemClick={handleClose} isMobile={true} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar - positioned below navbar */}
            <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:top-16 lg:bottom-0 lg:bg-white lg:dark:bg-gray-800 lg:shadow-lg lg:z-30">
                <SidebarContent />
            </div>
        </>
    )
}