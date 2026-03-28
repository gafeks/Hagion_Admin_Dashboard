"use client";

import { motion } from "framer-motion";
import { CheckmarkFilled } from "@carbon/icons-react";
import Link from "next/link";

export default function PasswordSuccessPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center gap-10 bg-white rounded-2xl p-10 w-[511px]">
        {/* Icon + Text */}
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <CheckmarkFilled size={100} className="text-[#068653]" />
          </motion.div>

          <div className="flex flex-col items-center gap-1">
            <h1 className="text-[32px] font-semibold leading-[39px] text-center text-black">
              Password Changed Successfully
            </h1>
            <p className="text-[16px] font-normal leading-[22px] text-center tracking-[-0.02em] text-[#5F6B7A]">
              You can now log into your account with your new password
            </p>
          </div>
        </div>

        {/* Login Button */}
        <Link href="/login" className="w-full">
          <motion.button
            className="w-full h-[56px] bg-[#2D2555] text-white text-[16px] font-medium leading-[19px] tracking-[-0.02em] rounded-lg hover:bg-[#231d45] transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            Login
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
