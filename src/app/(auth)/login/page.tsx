"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ViewOff, View } from "@carbon/icons-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ErrorState from "@/components/shared/ErrorState";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setAuthError("Invalid email or password.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center gap-5 pb-7">
      <div className="flex flex-col gap-10 bg-white rounded-2xl p-10 w-[469px]">
        {/* Header */}
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-[32px] font-semibold leading-[39px] text-center text-black">
            Admin Login
          </h1>
          <p className="text-[16px] font-normal leading-[22px] text-center tracking-[-0.02em] text-[#5F6B7A]">
            Enter your admin credentials to login
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-[7px]">
              <label className="text-[13px] font-medium leading-[17px] text-[#222222]">
                Email Address
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                {...register("email", { required: "Email is required" })}
                className={`w-full h-[42px] px-4 border rounded-[5px] text-[13px] text-[#222222] placeholder:text-[#808080]/70 outline-none focus:border-[#2D2555] transition-colors ${errors.email ? "border-[#D42620]" : "border-[#D9D9D9]"}`}
              />
              {errors.email && <span className="text-[11px] text-[#D42620]">{errors.email.message}</span>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-[7px]">
              <label className="text-[13px] font-medium leading-[17px] text-[#222222]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  {...register("password", { required: "Password is required" })}
                  className={`w-full h-[42px] px-4 pr-12 border rounded-[5px] text-[13px] text-[#222222] placeholder:text-[#808080]/70 outline-none focus:border-[#2D2555] transition-colors ${errors.password ? "border-[#D42620]" : "border-[#D9D9D9]"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#808080] hover:text-[#555] transition-colors"
                >
                  {showPassword ? <View size={20} /> : <ViewOff size={20} />}
                </button>
              </div>
              {errors.password && <span className="text-[11px] text-[#D42620]">{errors.password.message}</span>}
            </div>
            {authError && <ErrorState message={authError} compact />}
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[56px] bg-[#2D2555] text-white text-[16px] font-medium leading-[19px] tracking-[-0.02em] rounded-lg hover:bg-[#231d45] transition-colors disabled:opacity-70"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </motion.button>
        </form>
      </div>

      {/* Forgot Password */}
      <Link href="/forgot-password">
        <motion.span
          className="text-[16px] font-normal leading-[19px] tracking-[-0.02em] text-[#D42620] underline hover:text-[#b81f1a] transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Forgot Password?
        </motion.span>
      </Link>
    </div>
  );
}
