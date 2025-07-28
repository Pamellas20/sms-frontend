import { baseApi } from "./baseApi"

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  phone: string
  password: string
}

export interface AuthResponse {
  message: string
  token: string
}

export interface User {
  _id: string
  fullName: string
  email: string
  phone: string
  role: "admin" | "student"
  profilePicture?: string
  createdAt: string
  updatedAt: string
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    getProfile: builder.query<User, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useGetProfileQuery } = authApi
