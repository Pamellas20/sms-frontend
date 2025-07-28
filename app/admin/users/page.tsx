"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetAllStudentsQuery, useChangeUserRoleMutation, useDeleteUserMutation } from "@/lib/api/userApi"
import { Search, Plus, Trash2, Phone, UserCheck, UserX } from "lucide-react"
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export default function UsersManagementPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [newRole, setNewRole] = useState<"admin" | "student">("student")
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)

    const { data: users = [], isLoading, error } = useGetAllStudentsQuery()
    const [changeUserRole] = useChangeUserRoleMutation()
    const [deleteUser] = useDeleteUserMutation()
    const { toast } = useToast()

    const handleRoleChange = async () => {
        if (!selectedUser) return

        try {
            await changeUserRole({ id: selectedUser._id, role: newRole }).unwrap()
            toast({
                title: "Success",
                description: `User role changed to ${newRole} successfully`,
            })
            setIsRoleDialogOpen(false)
            setSelectedUser(null)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.data?.message || "Failed to change user role",
                variant: "destructive",
            })
        }
    }

    const handleDeleteUser = async (userId: string) => {
        try {
            await deleteUser(userId).unwrap()
            toast({
                title: "Success",
                description: "User deleted successfully",
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.data?.message || "Failed to delete user",
                variant: "destructive",
            })
        }
    }

    const openRoleDialog = (user: any) => {
        setSelectedUser(user)
        setNewRole(user.role === "admin" ? "student" : "admin")
        setIsRoleDialogOpen(true)
    }

    const filteredUsers = users.filter(
        (user) =>
            user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const getRoleColor = (role: string) => {
        switch (role) {
            case "admin":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
            case "student":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        }
    }

    const getStatusColor = (status?: string) => {
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
                    <h2 className="text-xl font-semibold mb-2">Error loading users</h2>
                    <p>Please try again later</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
                    <p className="text-muted-foreground">Manage users, roles, and permissions</p>
                </div>
                <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                </Button>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search users by name, email, or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                    <Card key={user._id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{user.fullName || "No Name"}</CardTitle>
                                    <CardDescription>{user.email}</CardDescription>
                                </div>
                                <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {user.phone && (
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Phone className="h-4 w-4 mr-2" />
                                        {user.phone}
                                    </div>
                                )}

                                {user.student && (
                                    <>
                                        <div className="text-sm text-muted-foreground">
                                            <strong>Course:</strong> {user.student.course}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            <strong>Enrollment:</strong> {user.student.enrollmentYear}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Status:</span>
                                            <Badge className={getStatusColor(user.student.status)}>{user.student.status}</Badge>
                                        </div>
                                    </>
                                )}

                                <div className="text-sm text-muted-foreground">
                                    <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 mt-4">
                                <Button variant="outline" size="sm" onClick={() => openRoleDialog(user)}>
                                    <UserCheck className="h-4 w-4" />
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the user account for {user.fullName}{" "}
                                                and all associated data.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                Delete User
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                    <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No users found matching your search.</p>
                </div>
            )}

            {/* Role Change Dialog */}
            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change User Role</DialogTitle>
                        <DialogDescription>
                            {selectedUser && `Change the role for ${selectedUser.fullName} (${selectedUser.email})`}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Current Role: </label>
                                <Badge className={getRoleColor(selectedUser.role)}>{selectedUser.role}</Badge>
                            </div>
                            <div>
                                <label className="text-sm font-medium">New Role:</label>
                                <Select value={newRole} onValueChange={(value: "admin" | "student") => setNewRole(value)}>
                                    <SelectTrigger className="w-full mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="student">Student</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleRoleChange}>Change Role</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
