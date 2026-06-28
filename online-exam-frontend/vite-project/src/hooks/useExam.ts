import { useQuery } from "@tanstack/react-query";
import examService from "../services/exam";

export const useMyAssignedExams = () => {
  return useQuery({
    queryKey: ["my-assigned-exams"],
    queryFn: examService.getMyAssignedExams,
  });
};
