"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StudentEditDialog } from "@/components/student-edit-dialog"
import { useGetStudentsQuery, useDeleteStudentMutation } from "@/lib/api/studentApi"
import type { Student } from "@/lib/api/studentApi"
import { Search, Plus, Edit, Trash2, Mail, Phone, Filter, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [courseFilter, setCourseFilter] = useState<string>("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const { data: studentsData, isLoading, error } = useGetStudentsQuery({})
  const [deleteStudent] = useDeleteStudentMutation()
  const { toast } = useToast()

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student)
    setIsEditDialogOpen(true)
  }

  const handleCloseEditDialog = () => {
    setSelectedStudent(null)
    setIsEditDialogOpen(false)
  }

  const handleDeleteStudent = async (studentId: string) => {
    try {
      await deleteStudent(studentId).unwrap()
      toast({
        title: "Success",
        description: "Student deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to delete student",
        variant: "destructive",
      })
    }
  }

  const filteredStudents =
    studentsData?.students.filter((student) => {
      const matchesSearch =
        student.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || student.status === statusFilter
      const matchesCourse = courseFilter === "all" || student.course === courseFilter

      return matchesSearch && matchesStatus && matchesCourse
    }) || []

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

  const uniqueCourses = Array.from(new Set(studentsData?.students.map((s) => s.course) || []))

  if (isLoading) {
    return (
      <div className="p-4 lg:p-8">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold mb-2">Error loading students</h2>
          <p>Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Students Management</h1>
          <p className="text-muted-foreground">Manage student records and academic information</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search students by name, email, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Graduated">Graduated</SelectItem>
                <SelectItem value="Dropped">Dropped</SelectItem>
              </SelectContent>
            </Select>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {uniqueCourses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            Showing {filteredStudents.length} of {studentsData?.total || 0} students
          </span>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student._id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{student.user?.fullName || "No Name"}</CardTitle>
                  <CardDescription className="truncate">{student.course}</CardDescription>
                </div>
                <Badge className={getStatusColor(student.status)}>{student.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {student.user?.email && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{student.user.email}</span>
                  </div>
                )}
                {student.user?.phone && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{student.user.phone}</span>
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  <strong>Enrollment:</strong> {student.enrollmentYear}
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Joined:</strong> {new Date(student.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => handleEditStudent(student)}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit student</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete student</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the student record for{" "}
                        {student.user?.fullName || "this student"} and all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteStudent(student._id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete Student
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No students found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== "all" || courseFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Get started by adding your first student."}
          </p>
          {(searchTerm || statusFilter !== "all" || courseFilter !== "all") && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setCourseFilter("all")
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Edit Student Dialog */}
      <StudentEditDialog student={selectedStudent} isOpen={isEditDialogOpen} onClose={handleCloseEditDialog} />
    </div>
  )
}
