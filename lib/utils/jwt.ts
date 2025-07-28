export interface JWTPayload {
    id: string
    role: "admin" | "student"
    iat: number
    exp: number
}

export function decodeJWT(token: string): JWTPayload | null {
    try {
        const base64Url = token.split(".")[1]
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join(""),
        )
        return JSON.parse(jsonPayload)
    } catch (error) {
        console.error("Error decoding JWT:", error)
        return null
    }
}

export function isTokenExpired(token: string): boolean {
    const payload = decodeJWT(token)
    if (!payload) return true

    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
}
