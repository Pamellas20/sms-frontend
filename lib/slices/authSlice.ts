import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "../api/authApi"
import { decodeJWT, isTokenExpired } from "../utils/jwt"

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Initialize state from localStorage if available
const getInitialState = (): AuthState => {
  if (typeof window === "undefined") {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
    }
  }

  const token = localStorage.getItem("token")
  const userData = localStorage.getItem("user")

  if (token && !isTokenExpired(token) && userData) {
    try {
      const user = JSON.parse(userData)
      return {
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      }
    } catch (error) {
      // Clear invalid data
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload

      // Verify token is valid
      const payload = decodeJWT(token)
      if (!payload || isTokenExpired(token)) {
        return
      }

      state.user = user
      state.token = token
      state.isAuthenticated = true
      state.isLoading = false

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
      }
    },
    // New action to set token without user (for login flow)
    setToken: (state, action: PayloadAction<string>) => {
      const token = action.payload

      // Verify token is valid
      const payload = decodeJWT(token)
      if (!payload || isTokenExpired(token)) {
        return
      }

      state.token = token
      state.isAuthenticated = true
      state.isLoading = true // Set loading to true while we fetch user profile

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token)
      }
    },
    // New action to set user data (after profile fetch)
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isLoading = false

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload))
      }
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload))
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false

      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    initializeAuth: (state) => {
      if (typeof window === "undefined") return

      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (token && !isTokenExpired(token) && userData) {
        try {
          const user = JSON.parse(userData)
          state.user = user
          state.token = token
          state.isAuthenticated = true
        } catch (error) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
        }
      }

      state.isLoading = false
    },
  },
})

export const { setCredentials, setToken, setUser, updateUser, logout, setLoading, initializeAuth } = authSlice.actions
export default authSlice.reducer