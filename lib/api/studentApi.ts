import { baseApi } from "./baseApi"
import type { User } from "./authApi"

export interface Student {
  _id: string
  user: User | null
  course: string
  enrollmentYear: number
  status: "Active" | "Graduated" | "Dropped"
  createdAt: string
  updatedAt: string
}

export interface StudentsResponse {
  students: Student[]
  total: number
}

export const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<StudentsResponse, { page?: number; limit?: number; course?: string; status?: string }>({
      query: ({ page = 1, limit = 10, course, status } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        })
        if (course) params.append("course", course)
        if (status) params.append("status", status)
        return `/students?${params.toString()}`
      },
      providesTags: ["Student"],
    }),
    getStudentById: builder.query<Student, string>({
      query: (id) => `/students/${id}`,
      providesTags: ["Student"],
    }),
    createStudent: builder.mutation<{ message: string; student: Student }, Partial<Student>>({
      query: (student) => ({
        url: "/students",
        method: "POST",
        body: student,
      }),
      invalidatesTags: ["Student"],
    }),
    updateStudent: builder.mutation<{ message: string; student: Student }, { id: string; data: Partial<Student> }>({
      query: ({ id, data }) => ({
        url: `/students/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Student"],
    }),
    deleteStudent: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Student"],
    }),
    updateOwnStudentData: builder.mutation<{ message: string; student: Student }, Partial<Student>>({
      query: (data) => ({
        url: "/students/me",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Student", "Auth"],
    }),
  }),
})

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useUpdateOwnStudentDataMutation,
} = studentApi
