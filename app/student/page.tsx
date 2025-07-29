"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useUpdateOwnStudentDataMutation } from "@/lib/api/studentApi"
import { updateStudentData } from "@/lib/slices/authSlice"
import type { RootState } from "@/lib/store"
import { User, Mail, Phone, Calendar, BookOpen, Edit, Save, GraduationCap, Activity } from "lucide-react"

export default function StudentDashboard() {
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const { toast } = useToast()
  const [updateOwnStudentData, { isLoading }] = useUpdateOwnStudentDataMutation()

  const [isEditing, setIsEditing] = useState(false)
  type StatusType = "Active" | "Graduated" | "Dropped"

  const [formData, setFormData] = useState<{
    course: string
    enrollmentYear: number
    status: StatusType
  }>({
    course: user?.studentData?.course || "Computer Science",
    enrollmentYear: user?.studentData?.enrollmentYear || 2023,
    status: user?.studentData?.status || "Active",
  })

  useEffect(() => {
    if (user?.studentData) {
      setFormData({
        course: user.studentData.course,
        enrollmentYear: user.studentData.enrollmentYear,
        status: user.studentData.status,
      })
    }
  }, [user?.studentData])

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    try {
      const result = await updateOwnStudentData(formData).unwrap()

      dispatch(updateStudentData(formData))

      setIsEditing(false)
      toast({
        title: "Success",
        description: "Your profile has been updated successfully!",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Graduated":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Dropped":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user?.fullName}</h1>
        <p className="text-muted-foreground">Manage your academic profile and view your information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Academic Profile</CardTitle>
                  <CardDescription>Your academic and personal information</CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  disabled={isLoading}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save"}
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Full Name</p>
                      <p className="text-sm text-muted-foreground">{user?.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{user?.phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Course</p>
                      {isEditing ? (
                        <Select value={formData.course} onValueChange={(value) => handleInputChange("course", value)}>
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                            <SelectItem value="Data Science">Data Science</SelectItem>
                            <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                            <SelectItem value="Information Technology">Information Technology</SelectItem>
                            <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                            <SelectItem value="Undeclared">Undeclared</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm text-muted-foreground">{formData.course}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Enrollment Year</p>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={formData.enrollmentYear}
                          onChange={(e) => handleInputChange("enrollmentYear", Number.parseInt(e.target.value))}
                          min="2020"
                          max="2030"
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">{formData.enrollmentYear}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Status</p>
                      {isEditing ? (
                        <Select
                          value={formData.status}
                          onValueChange={(value) => handleInputChange("status", value as StatusType)}
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Graduated">Graduated</SelectItem>
                            <SelectItem value="Dropped">Dropped</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={getStatusColor(formData.status)}>{formData.status}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Current Semester</span>
                <span className="text-sm text-muted-foreground">Fall 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Credits Completed</span>
                <span className="text-sm text-muted-foreground">45/120</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">GPA</span>
                <span className="text-sm text-muted-foreground">3.8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Expected Graduation</span>
                <span className="text-sm text-muted-foreground">May 2026</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">Profile updated</p>
                <p className="text-muted-foreground text-xs">2 days ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Course enrollment</p>
                <p className="text-muted-foreground text-xs">1 week ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Grade posted</p>
                <p className="text-muted-foreground text-xs">2 weeks ago</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <GraduationCap className="h-4 w-4 mr-2" />
                View Transcript
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <BookOpen className="h-4 w-4 mr-2" />
                Course Catalog
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Calendar className="h-4 w-4 mr-2" />
                Academic Calendar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}