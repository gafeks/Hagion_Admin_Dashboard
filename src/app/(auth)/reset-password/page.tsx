"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ViewOff, View } from "@carbon/icons-react";
import { supabase } from "@/lib/supabase";
import ErrorState from "@/components/shared/ErrorState";
import Loader from "@/components/shared/Loader";

interface ResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ResetPasswordForm>();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/forgot-password");
        return;
      }
      setCheckingSession(false);
    });
  }, [router]);

  const onSubmit = async (data: ResetPasswordForm) => {
    setAuthError(null);
    const { error } = await supabase.auth.updateUser({ password: data.newPassword });

    if (error) {
      setAuthError("Something went wrong updating your password. Please try again.");
      return;
    }

    sessionStorage.removeItem("hagion-reset-email");
    await supabase.auth.signOut();
    router.push("/password-success");
  };

  if (checkingSession) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-10 bg-white rounded-2xl p-10 w-[469px]">
        {/* Header */}
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-[32px] font-semibold leading-[42px] text-center text-black">
            Create New Password
          </h1>
          <p className="text-[16px] font-normal leading-[19px] text-center tracking-[-0.02em] text-[#5F6B7A]">
            One more step and you are back into your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* New Password */}
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium leading-[16px] tracking-[-0.02em] text-[#212934]">
              Create New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                {...register("newPassword", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Must be at least 8 characters" },
                })}
                className={`w-full h-[48px] px-4 pr-12 border rounded-[5px] text-[12px] text-[#222222] placeholder:text-[#D4D7E0] outline-none focus:border-[#2D2555] transition-colors ${errors.newPassword ? "border-[#D42620]" : "border-[#D9D9D9]"}`}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#808080] hover:text-[#555] transition-colors"
              >
                {showNew ? <View size={20} /> : <ViewOff size={20} />}
              </button>
            </div>
            {errors.newPassword ? (
              <span className="text-[10px] leading-[12px] tracking-[-0.02em] text-[#D42620]">{errors.newPassword.message}</span>
            ) : (
              <span className="text-[10px] leading-[12px] tracking-[-0.02em] text-[#4C4C4D]">
                Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number.
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium leading-[16px] tracking-[-0.02em] text-[#212934]">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter new password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val) => val === watch("newPassword") || "Passwords do not match",
                })}
                className={`w-full h-[48px] px-4 pr-12 border rounded-[5px] text-[12px] text-[#222222] placeholder:text-[#D4D7E0] outline-none focus:border-[#2D2555] transition-colors ${errors.confirmPassword ? "border-[#D42620]" : "border-[#D9D9D9]"}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#808080] hover:text-[#555] transition-colors"
              >
                {showConfirm ? <View size={20} /> : <ViewOff size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-[10px] leading-[12px] tracking-[-0.02em] text-[#D42620]">{errors.confirmPassword.message}</span>
            )}
          </div>
          {authError && <ErrorState message={authError} compact />}

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[56px] bg-[#2D2555] text-white text-[16px] font-medium leading-[19px] tracking-[-0.02em] rounded-lg hover:bg-[#231d45] transition-colors disabled:opacity-70 mt-2"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {isSubmitting ? "Updating..." : "Reset Password"}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
