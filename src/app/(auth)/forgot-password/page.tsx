"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordForm>();

  const onSubmit = (data: ForgotPasswordForm) => {
    console.log(data);
    router.push("/verify-otp");
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-col gap-10 bg-white rounded-2xl p-10 w-[469px]">
        {/* Header */}
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-[32px] font-semibold leading-[39px] text-center text-black">
            Reset Password
          </h1>
          <p className="text-[16px] font-normal leading-[22px] text-center tracking-[-0.02em] text-[#5F6B7A]">
            {"Don't worry, It happens to the best of us 🤗"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
            {errors.email ? (
              <span className="text-[11px] text-[#D42620]">{errors.email.message}</span>
            ) : (
              <span className="text-[12px] font-normal leading-[16px] tracking-[-0.02em] text-[#068653]">
                You will receive a One-Time-Password via email
              </span>
            )}
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[56px] bg-[#2D2555] text-white text-[16px] font-medium leading-[19px] tracking-[-0.02em] rounded-lg hover:bg-[#231d45] transition-colors disabled:opacity-70"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {isSubmitting ? "Sending..." : "Send OTP"}
          </motion.button>
        </form>
      </div>

      {/* Back to Sign In */}
      <Link href="/login">
        <motion.span
          className="text-[16px] font-normal leading-[19px] tracking-[-0.02em] text-[#068653] underline hover:text-[#057a4a] transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Back to Sign In
        </motion.span>
      </Link>
    </div>
  );
}
