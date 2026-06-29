"use client";

import { useEffect, useState } from "react";
import { examService } from "@/services/examService";
import { bankService } from "@/services/bankService";
import { questionService } from "@/services/questionService";
import { studentService } from "@/services/studentService";
import { Exam, QuestionBank, User } from "@/types";

export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [banks, setBanks] = useState<QuestionBank[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const [examsRes, banksRes, questionsRes, studentsRes] = await Promise.allSettled([
          examService.getAll(),
          bankService.getAll(),
          questionService.getAll({ page: 1, limit: 1 }),
          studentService.getAll({ page: 1, limit: 1000 }),
        ]);

        if (!active) return;

        if (examsRes.status === "fulfilled") setExams(examsRes.value.data.data);
        if (banksRes.status === "fulfilled") setBanks(banksRes.value.data.data);
        if (questionsRes.status === "fulfilled") {
          setTotalQuestions(questionsRes.value.data.pagination?.total ?? 0);
        }
        if (studentsRes.status === "fulfilled") setStudents(studentsRes.value.data.data);
      } catch (err: any) {
        if (active) setError(err?.message || "Failed to load dashboard data");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { loading, error, exams, banks, students, totalQuestions };
}
