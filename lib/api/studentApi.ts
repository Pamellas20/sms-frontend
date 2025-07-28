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
    getStudents: builder.query<StudentsResponse, void>({
      query: () => "/students",
      providesTags: ["Student"],
    }),
    createStudent: builder.mutation<Student, Partial<Student>>({
      query: (student) => ({
        url: "/students",
        method: "POST",
        body: student,
      }),
      invalidatesTags: ["Student"],
    }),
    updateStudent: builder.mutation<Student, { id: string; data: Partial<Student> }>({
      query: ({ id, data }) => ({
        url: `/students/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Student"],
    }),
    deleteStudent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Student"],
    }),
  }),
})

export const { useGetStudentsQuery, useCreateStudentMutation, useUpdateStudentMutation, useDeleteStudentMutation } =
  studentApi
