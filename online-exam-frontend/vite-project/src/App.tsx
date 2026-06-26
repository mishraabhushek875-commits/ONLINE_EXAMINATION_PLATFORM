import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import ForgotPassword from "../src/features/auth/pages/Forgot-pass";
import RestPassword from "../src/features/auth/pages/Reset-pass";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path={"/login"} element={<Login />} />
        <Route path={"/signup"} element={<Register />} />
        <Route path={"/forgot-password"} element={<ForgotPassword />} />
        <Route path={"/reset-password"} element={<RestPassword />} />
      </Routes>
    </>
  );
}

export default App;
