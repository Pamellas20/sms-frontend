"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetDashboardStatsQuery } from "@/lib/api/userApi"
import { Users, GraduationCap, UserCheck, UserX, TrendingUp, Calendar } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery()

  if (isLoading) {
    return (
      <div className="p-4 lg:p-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error loading dashboard</h1>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your institution's statistics and management tools</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.users.totalAdmins} admins, {stats?.users.totalStudents} students
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.students.activeStudents}</div>
            <p className="text-xs text-muted-foreground">Currently enrolled</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Graduated</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.students.graduatedStudents}</div>
            <p className="text-xs text-muted-foreground">Completed studies</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.students.totalStudentRecords}</div>
            <p className="text-xs text-muted-foreground">All student records</p>
          </CardContent>
        </Card>
      </div>

      {/* Management Tools and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Management Tools</CardTitle>
            <CardDescription>Quick access to administrative functions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/admin/users">
                <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">Manage Users</p>
                    <p className="text-xs text-muted-foreground">Roles & Permissions</p>
                  </div>
                </Card>
              </Link>
              <Link href="/admin/students">
                <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="text-center">
                    <GraduationCap className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">Student Records</p>
                    <p className="text-xs text-muted-foreground">Academic Data</p>
                  </div>
                </Card>
              </Link>
              <Link href="/admin/analytics">
                <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">Analytics</p>
                    <p className="text-xs text-muted-foreground">Reports & Insights</p>
                  </div>
                </Card>
              </Link>
              <Link href="/admin/settings">
                <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">Settings</p>
                    <p className="text-xs text-muted-foreground">System Config</p>
                  </div>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  )
}
