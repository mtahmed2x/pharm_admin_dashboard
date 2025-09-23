"use client";

import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import banner from "../../../public/login-bg.png";

type FormData = {
  email: string;
  password: string;
  remember: boolean;
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // submit handler
  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-5xl shadow-lg rounded-2xl overflow-hidden bg-white text-gray-800">
        {/* Left Side */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-t from-pink-100 to-pink-200 items-center justify-center">
          <Image
            src={banner}
            alt="Doctor"
            width={400}
            height={600}
            className="rounded-lg object-contain"
            priority
          />
        </div>

        {/* Right Side Form */}
        <div className="flex flex-col justify-center w-full md:w-1/2 px-8 sm:px-16 py-10">
          <div className="max-w-md w-full mx-auto">
            {/* Logo + Title */}
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-pink-500 text-xl">💊</span>
              <h1 className="font-bold text-xl">herPILL</h1>
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-semibold mb-6">Log In</h2>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full px-4 py-2 border border-pink-400 rounded focus:ring-2 focus:ring-pink-600 outline-none"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="w-full px-4 py-2 border border-pink-400 rounded focus:ring-2 focus:ring-pink-600 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember me + Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register("remember")}
                    className="accent-pink-500"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-pink-500 hover:underline">
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 rounded bg-pink-400 text-white font-semibold hover:bg-pink-500 transition cursor-pointer"
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
