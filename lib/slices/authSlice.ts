import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "../api/authApi"
import { decodeJWT, isTokenExpired } from "../utils/jwt"


interface UserWithStudentData extends User {
  studentData?: {
    course: string
    enrollmentYear: number
    status: "Active" | "Graduated" | "Dropped"
  }
}

interface AuthState {
  user: UserWithStudentData | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

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
    setCredentials: (state, action: PayloadAction<{ user: UserWithStudentData; token: string }>) => {
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
    setToken: (state, action: PayloadAction<string>) => {
      const token = action.payload

      const payload = decodeJWT(token)
      if (!payload || isTokenExpired(token)) {
        return
      }

      state.token = token
      state.isAuthenticated = true
      state.isLoading = true

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token)
      }
    },
    setUser: (state, action: PayloadAction<UserWithStudentData>) => {
      state.user = action.payload
      state.isLoading = false

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload))
      }
    },
    updateUser: (state, action: PayloadAction<UserWithStudentData>) => {
      state.user = action.payload
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload))
      }
    },
    updateStudentData: (state, action: PayloadAction<{
      course: string
      enrollmentYear: number
      status: "Active" | "Graduated" | "Dropped"
    }>) => {
      if (state.user) {
        state.user.studentData = action.payload
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(state.user))
        }
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

export const {
  setCredentials,
  setToken,
  setUser,
  updateUser,
  updateStudentData,
  logout,
  setLoading,
  initializeAuth
} = authSlice.actions
export default authSlice.reducer