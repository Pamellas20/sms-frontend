"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserAvatar } from "@/components/user-avatar"
import { useToast } from "@/hooks/use-toast"
import { useUpdateProfileMutation, useUpdateProfilePictureMutation } from "@/lib/api/userApi"
import { setCredentials } from "@/lib/slices/authSlice"
import type { RootState } from "@/lib/store"
import { Camera, Save, User, Mail, Phone } from "lucide-react"

export default function ProfilePage() {
    const { user, token } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch()
    const { toast } = useToast()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phone: user?.phone || "",
    })

    const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation()
    const [updateProfilePicture, { isLoading: isUpdatingPicture }] = useUpdateProfilePictureMutation()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const result = await updateProfile(formData).unwrap()

            if (user && token) {
                dispatch(
                    setCredentials({
                        user: {
                            ...result.user,
                            _id: result.user._id ?? user._id,
                            createdAt: result.user.createdAt
                                ? result.user.createdAt
                                : user.createdAt
                                    ? user.createdAt
                                    : "",
                            updatedAt: result.user.updatedAt
                                ? result.user.updatedAt
                                : user.updatedAt
                                    ? user.updatedAt
                                    : "",
                        },
                        token,
                    }),
                )
            }

            toast({
                title: "Success",
                description: "Profile updated successfully!",
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.data?.message || "Failed to update profile",
                variant: "destructive",
            })
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast({
                title: "Error",
                description: "Please select a valid image file",
                variant: "destructive",
            })
            return
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "Error",
                description: "Image size should be less than 5MB",
                variant: "destructive",
            })
            return
        }

        const formData = new FormData()
        formData.append("image", file)

        try {
            const result = await updateProfilePicture(formData).unwrap()
            
            if (user && token) {
                dispatch(
                    setCredentials({
                        user: {
                            ...result.user,
                            _id: result.user._id ?? user._id,
                            createdAt: result.user.createdAt
                                ? result.user.createdAt
                                : user.createdAt
                                    ? user.createdAt
                                    : "",
                            updatedAt: result.user.updatedAt
                                ? result.user.updatedAt
                                : user.updatedAt
                                    ? user.updatedAt
                                    : "",
                        },
                        token,
                    }),
                )
            }

            toast({
                title: "Success",
                description: "Profile picture updated successfully!",
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.data?.message || "Failed to update profile picture",
                variant: "destructive",
            })
        }
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-muted-foreground">Please log in to view your profile.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your account information and preferences</p>
            </div>

            <div className="space-y-6">

                <Card>
                    <CardHeader>
                        <CardTitle>Profile Picture</CardTitle>
                        <CardDescription>Update your profile picture</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center space-x-6">
                        <div className="relative">
                            <UserAvatar user={user} size="lg" />
                            <Button
                                size="icon"
                                variant="outline"
                                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-transparent"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUpdatingPicture}
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-2">
                                Click the camera icon to upload a new profile picture. Supported formats: JPG, PNG, GIF (max 5MB)
                            </p>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            {isUpdatingPicture && <p className="text-sm text-blue-600">Uploading...</p>}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update your personal information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={isUpdatingProfile}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {isUpdatingProfile ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>Your account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                                <p className="text-sm capitalize">{user.role}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                                <p className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
