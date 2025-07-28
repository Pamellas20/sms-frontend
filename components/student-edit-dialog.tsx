"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useUpdateStudentMutation } from "@/lib/api/studentApi"
import type { Student } from "@/lib/api/studentApi"
import { Save, Loader2 } from "lucide-react"

interface StudentEditDialogProps {
    student: Student | null
    isOpen: boolean
    onClose: () => void
}

export function StudentEditDialog({ student, isOpen, onClose }: StudentEditDialogProps) {
    const { toast } = useToast()
    const [updateStudent, { isLoading }] = useUpdateStudentMutation()

    const [formData, setFormData] = useState({
        course: "",
        enrollmentYear: new Date().getFullYear(),
        status: "Active" as "Active" | "Graduated" | "Dropped",
    })

    // Update form data when student changes
    useEffect(() => {
        if (student) {
            setFormData({
                course: student.course,
                enrollmentYear: student.enrollmentYear,
                status: student.status,
            })
        }
    }, [student])

    const handleInputChange = (field: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!student) return

        try {
            await updateStudent({
                id: student._id,
                data: formData,
            }).unwrap()

            toast({
                title: "Success",
                description: "Student information updated successfully!",
            })
            onClose()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.data?.message || "Failed to update student information",
                variant: "destructive",
            })
        }
    }

    const handleClose = () => {
        onClose()
    }

    if (!student) return null

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Student Information</DialogTitle>
                    <DialogDescription>
                        Update academic information for {student.user?.fullName || "this student"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        {/* Student Basic Info (Read-only) */}
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Student Information</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="font-medium">Name:</span> {student.user?.fullName || "N/A"}
                                </div>
                                <div>
                                    <span className="font-medium">Email:</span> {student.user?.email || "N/A"}
                                </div>
                                <div>
                                    <span className="font-medium">Phone:</span> {student.user?.phone || "N/A"}
                                </div>
                                <div>
                                    <span className="font-medium">Role:</span> {student.user?.role || "N/A"}
                                </div>
                            </div>
                        </div>

                        {/* Editable Academic Information */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="course">Course of Study</Label>
                                <Select value={formData.course} onValueChange={(value) => handleInputChange("course", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                                        <SelectItem value="Data Science">Data Science</SelectItem>
                                        <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                                        <SelectItem value="Information Technology">Information Technology</SelectItem>
                                        <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                                        <SelectItem value="Web Development">Web Development</SelectItem>
                                        <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                                        <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                                        <SelectItem value="Business Administration">Business Administration</SelectItem>
                                        <SelectItem value="Undeclared">Undeclared</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="enrollmentYear">Enrollment Year</Label>
                                <Input
                                    id="enrollmentYear"
                                    type="number"
                                    min="2020"
                                    max="2030"
                                    value={formData.enrollmentYear}
                                    onChange={(e) => handleInputChange("enrollmentYear", Number.parseInt(e.target.value))}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value: "Active" | "Graduated" | "Dropped") => handleInputChange("status", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Graduated">Graduated</SelectItem>
                                        <SelectItem value="Dropped">Dropped</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Update Student
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
