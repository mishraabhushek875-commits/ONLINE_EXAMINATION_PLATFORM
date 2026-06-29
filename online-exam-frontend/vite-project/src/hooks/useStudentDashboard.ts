// src/features/student/hooks/useStudentDashboard.ts
// Dashboard data fetch karne ka hook

import { useState, useEffect } from "react";
import { getStudentDashboardApi } from "../services/examAttemptService";
import type { DashboardData } from "../types/exam.types";

export const useStudentDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getStudentDashboardApi();
      setData(result);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return { data, isLoading, error, refetch: fetchDashboard };
};
