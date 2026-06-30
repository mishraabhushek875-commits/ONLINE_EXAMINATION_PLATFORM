import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaPhone, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useRegister } from "../hooks/useAuth";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterForm() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validate()) {
      registerMutation.mutate(
        {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        },
        {
          onSuccess: () => {
            navigate("/verify", { state: { email: formData.email } });
          },
        },
      );
    }
  };

  const inputBase =
    "w-full pl-9 pr-4 py-2 sm:py-2.5 rounded-lg border text-sm outline-none transition-all bg-white text-gray-800";
  const inputNormal =
    "border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100";
  const inputError =
    "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100";

  return (
    <div className="mt-4 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs sm:text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className={`${inputBase} ${errors.fullName ? inputError : inputNormal}`}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-red-500">{errors.fullName}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs sm:text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs sm:text-sm font-medium text-gray-700">
            Phone
          </label>
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className={`${inputBase} ${errors.phone ? inputError : inputNormal}`}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs sm:text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className={`${inputBase} pr-10 ${errors.password ? inputError : inputNormal}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <HiEyeOff /> : <HiEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${inputBase} pr-10 ${errors.confirmPassword ? inputError : inputNormal}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <HiEyeOff /> : <HiEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <button
            onClick={handleSubmit}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 py-2.5 sm:py-3 font-semibold text-white transition duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95 text-sm sm:text-base"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
