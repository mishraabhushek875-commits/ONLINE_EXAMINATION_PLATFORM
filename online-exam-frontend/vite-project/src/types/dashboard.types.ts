export interface MyResultItem {
  attempt_id: number
  exam_title: string
  score: number
  total_marks: number
  passed: boolean
  submitted_at: string | null
}

export interface QuestionReview {
  question_text: string
  options?: { id: number; text: string }[]
  selected_option_id: number | null
  correct_option_id: number | undefined
  is_correct: boolean
}

export interface ResultDetail {
  attempt_id: number
  exam_title: string
  score: number
  total_marks: number
  passed: boolean
  submitted_at: string | null
  questions: QuestionReview[]
}

export interface MyResultsResponse {
  results: MyResultItem[]
}