import api from "./api";
import type { MyResultsResponse, ResultDetail } from "../types/dashboard.types";

const resultService = {
  getMyResults: async () => {
    const { data } = await api.get("/student/results"); // ✅ sahi route
    return data;
  },

  getMyResultDetail: async (attemptId: number | string) => {
    const { data } = await api.get(`/student/results/${attemptId}`); // ✅ sahi route
    return data;
  },
};

export default resultService;
