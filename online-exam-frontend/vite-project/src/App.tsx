import { Route, Routes } from "react-router-dom";

import DashboardLayout from "./layout/DashboardLayout";

import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import ForgotPassword from "./features/auth/Forgot-pass";
import RestPassword from "./features/auth/Reset-pass";
import VerifyOtp from "./features/auth/VerifyOtp";
import StudentDashboard from "./features/dashboard/StudentDashboard";
import MyExams from "./features/exam/MyExams";
import ExamDetail from "./features/exam/ExamDetail";
import Results from "./features/result/Result";
import ResultDetail from "./features/result/ResultDetail";

function App() {
  return (
    <Routes>
      {/* Dashboard Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<StudentDashboard />} />
        {/* Future dashboard pages */}
        <Route path="/my-exams" element={<MyExams />} />
        <Route path="/my-exams/:id" element={<ExamDetail />} />
        <Route path="/results" element={<Results />} />
        <Route path="/result/:id" element={<ResultDetail />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<RestPassword />} />
      <Route path="/verify" element={<VerifyOtp />} />
    </Routes>
  );
}

export default App;
