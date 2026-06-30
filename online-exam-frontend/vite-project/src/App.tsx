import { Route, Routes, Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import ForgotPassword from "./features/auth/Forgot-pass";
import RestPassword from "./features/auth/Reset-pass";
import StudentDashboard from "./features/dashboard/StudentDashboard";
import ExamRules from "./features/exam/ExamRules";
import ExamPage from "./features/exam/ExamPage";
import VerifyOtp from "./features/auth/VerifyOtp";
import Results from "./features/result/Result";
import ResultDetail from "./features/result/ResultDetail";
import MyExams from "./features/exam/MyExams";
import ExamDetail from "./features/exam/ExamDetail";
import DashboardLayout from "./layout/DashboardLayout";
import ProtectedRoute from "./Components/ProtectRoute";
import PublicRoute from "./Components/PublicRoute";

// ─── Admin ──────────────────────────────────────────────
import AdminRoute from "./Components/AdminRoutes";
import AdminLayout from "./Components/AdminLayout";
import AdminDashboard from "./features/dashboard/adminDashboard";
import AdminStudents from "./features/admin/students";
import AdminQuestionBanks from "./features/admin/QuestionBank";
import AdminExams from "./features/admin/Exams";
import AdminQuestions from "./features/admin/Questions";
import AdminAssignments from "./features/admin/Assignment";
import AdminResults from "./features/admin/Results";
import AdminSettings from "./features/admin/Settings";

const AuthLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

function App() {
  return (
    <Routes>
      <Route path="/student/exam/:examId/attempt" element={<ExamPage />} />

      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<RestPassword />} />
          <Route path="/verify" element={<VerifyOtp />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/my-exams" element={<MyExams />} />
          <Route path="/my-exams/:id" element={<ExamDetail />} />
          <Route path="/student/exam/:examId/rules" element={<ExamRules />} />
          <Route path="/results" element={<Results />} />
          <Route path="/result/:id" element={<ResultDetail />} />
        </Route>
      </Route>

      {/* Admin only */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/question-banks" element={<AdminQuestionBanks />} />
          <Route path="/admin/exams" element={<AdminExams />} />
          <Route path="/admin/questions" element={<AdminQuestions />} />
          <Route path="/admin/assignments" element={<AdminAssignments />} />
          <Route path="/admin/results" element={<AdminResults />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;