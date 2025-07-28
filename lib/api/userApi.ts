import { baseApi } from "./baseApi"
import type { User } from "./authApi"

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

export interface UserWithStudent extends User {
  student?: {
    _id: string
    course: string
    enrollmentYear: number
    status: "Active" | "Graduated" | "Dropped"
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
    getAllStudents: builder.query<UserWithStudent[], void>({
      query: () => "/user/students",
      providesTags: ["User"],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `/user/${id}`,
      providesTags: ["User"],
    }),
    changeUserRole: builder.mutation<{ message: string; user: User }, { id: string; role: "admin" | "student" }>({
      query: ({ id, role }) => ({
        url: `/user/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User", "Student"],
    }),
    deleteUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Student"],
    }),
  }),
})

export const {
  useGetDashboardStatsQuery,
  useUpdateProfileMutation,
  useUpdateProfilePictureMutation,
  useGetAllStudentsQuery,
  useGetUserByIdQuery,
  useChangeUserRoleMutation,
  useDeleteUserMutation,
} = userApi
