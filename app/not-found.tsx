"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader className="pb-4">
                    <div className="mx-auto mb-4 text-6xl font-bold text-primary">404</div>
                    <CardTitle className="text-2xl">Page Not Found</CardTitle>
                    <CardDescription className="text-base">
                        Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the
                        wrong URL.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button asChild>
                            <Link href="/">
                                <Home className="h-4 w-4 mr-2" />
                                Go Home
                            </Link>
                        </Button>
                        <Button variant="outline" onClick={() => window.history.back()}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Go Back
                        </Button>
                    </div>
                    <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-3">Looking for something specific?</p>
                        <div className="flex flex-col gap-2 text-sm">
                            <Link href="/auth/login" className="text-primary hover:underline">
                                Login to your account
                            </Link>
                            <Link href="/auth/register" className="text-primary hover:underline">
                                Create a new account
                            </Link>
                            <Link href="/" className="text-primary hover:underline">
                                Visit our homepage
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
