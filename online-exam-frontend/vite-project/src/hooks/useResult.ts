import { useQuery } from "@tanstack/react-query";
import resultService from "../services/result";

export const useMyResults = () => {
  return useQuery({
    queryKey: ["my-results"],
    queryFn: resultService.getMyResults,
  });
};

export const useResultDetail = (attemptId: number | string) => {
  return useQuery({
    queryKey: ["result-detail", attemptId],
    queryFn: () => resultService.getMyResultDetail(attemptId),
    enabled: !!attemptId,
  });
};
