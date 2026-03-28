"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Email } from "@carbon/icons-react";

interface OTPForm {
  otp: string[];
}

export default function VerifyOTPPage() {
  const router = useRouter();
  const { setValue, watch, handleSubmit, formState: { isSubmitting } } = useForm<OTPForm>({
    defaultValues: { otp: ["", "", "", "", "", ""] },
  });
  const otp = watch("otp");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setValue("otp", newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setValue("otp", newOtp);
    const nextEmpty = Math.min(pasted.length, 5);
    inputRefs.current[nextEmpty]?.focus();
  };

  const onSubmit = (data: OTPForm) => {
    const code = data.otp.join("");
    console.log("OTP:", code);
    router.push("/reset-password");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center gap-[30px] bg-white rounded-2xl py-10 px-[76px] w-[523px]">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-[#E6FDE6] flex items-center justify-center">
            <Email size={36} className="text-[#068653]" />
          </div>
          <h1 className="text-[32px] font-semibold leading-[51px] text-center text-black">
            Email Verification
          </h1>
          <p className="text-[16px] font-normal leading-[24px] text-center text-[#71717A] max-w-[324px]">
            We sent a verification code to your email address
          </p>
        </div>

        {/* OTP + Submit */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-6 w-full">
          {/* OTP Input */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2" onPaste={handlePaste}>
              {/* First group (1-3) */}
              <div className="flex border border-[#E4E4E7] rounded-md overflow-hidden">
                {[0, 1, 2].map((i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[i]}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`w-[47px] h-[40px] text-center text-[16px] text-black bg-white outline-none focus:bg-[#F5F8FA] transition-colors ${i > 0 ? "border-l border-[#E4E4E7]" : ""}`}
                  />
                ))}
              </div>

              {/* Dot separator */}
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="w-[4px] h-[4px] rounded-full bg-[#09090B]" />
              </div>

              {/* Second group (4-6) */}
              <div className="flex border border-[#E4E4E7] rounded-md overflow-hidden">
                {[3, 4, 5].map((i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[i]}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`w-[47px] h-[40px] text-center text-[16px] text-black bg-white outline-none focus:bg-[#F5F8FA] transition-colors ${i > 3 ? "border-l border-[#E4E4E7]" : ""}`}
                  />
                ))}
              </div>
            </div>

            <span className="text-[14px] font-normal leading-[20px] text-[#09090B] text-center pt-2">
              Enter the OTP here
            </span>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isSubmitting || otp.some((d) => !d)}
            className="w-[370px] h-[54px] bg-[#2D2555] text-white text-[20px] font-medium leading-[24px] rounded-md hover:bg-[#231d45] transition-colors disabled:opacity-70"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {isSubmitting ? "Verifying..." : "Submit"}
          </motion.button>

          {/* Resend */}
          <div className="flex items-center gap-[5px]">
            <span className="text-[16px] font-normal leading-[19px] text-[#0B0B0B]">
              {"Didn't receive a code?"}
            </span>
            <motion.button
              type="button"
              className="text-[16px] font-medium leading-[19px] text-[#068653] hover:text-[#057a4a] transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Resend
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
