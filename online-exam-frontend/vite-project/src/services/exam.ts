import api from './api'
import type { AssignedExamsResponse } from '../types/exam.types'

const examService = {
  getMyAssignedExams: async (): Promise<AssignedExamsResponse> => {
    const { data } = await api.get<AssignedExamsResponse>('/exams/assigned/me')
    return data
  },
}

export default examService