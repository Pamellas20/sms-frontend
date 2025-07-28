import { baseApi } from "./baseApi"

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
  }),
})

export const { useGetDashboardStatsQuery } = userApi
