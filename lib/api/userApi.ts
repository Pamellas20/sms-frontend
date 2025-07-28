import { baseApi } from "./baseApi"
export enum UserRole {
  Admin = "admin",
  Student = "student",
}

export interface User {
  _id?: string
  fullName: string
  email: string
  phone: string
  role: UserRole
  password?: string
  profilePicture?: string
  createdAt?: string
  updatedAt?: string
}

export interface DashboardStats {
  users: {
    totalUsers: number
    totalStudents: number
    totalAdmins: number
  }
  students: {
    totalStudentRecords: number
    activeStudents: number
    graduatedStudents: number
    droppedStudents: number
  }
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "/user/admin/dashboard-stats",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<{ message: string; user: User }, Partial<User>>({
      query: (userData) => ({
        url: "/user/me",
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: ["Auth", "User"],
    }),
    updateProfilePicture: builder.mutation<{ message: string; user: User }, FormData>({
      query: (formData) => ({
        url: "/user/me/profile-pic",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Auth", "User"],
    }),
  }),
})

export const { useGetDashboardStatsQuery, useUpdateProfileMutation, useUpdateProfilePictureMutation } = userApi
