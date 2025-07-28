"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserAvatarProps {
    user: {
        fullName: string
        profilePicture?: string
    }
    size?: "sm" | "md" | "lg"
}

export function UserAvatar({ user, size = "md" }: UserAvatarProps) {
    const sizeClasses = {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-16 w-16",
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <Avatar className={sizeClasses[size]}>
            <AvatarImage src={user.profilePicture || "/placeholder.svg"} alt={user.fullName} />
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                {getInitials(user.fullName)}
            </AvatarFallback>
        </Avatar>
    )
}
