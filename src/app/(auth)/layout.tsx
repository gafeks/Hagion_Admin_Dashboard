"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F5F8FA] overflow-hidden">
      {/* Background logo watermark */}
      <div
        className="absolute w-[1351px] h-[1351px] mix-blend-overlay pointer-events-none"
        style={{
          left: "calc(50% - 1351px/2 - 349.5px)",
          top: "calc(50% - 1351px/2 + 103.5px)",
          backgroundImage: "url('/images/hagion-logo.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div
          className="flex items-center gap-[5px]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Image src="/images/logo-dark.png" alt="Hagion" width={56} height={56} />
          <span className="text-[28px] font-semibold leading-[37px] text-[#2D2555]">
            Hagion
          </span>
        </motion.div>

        {/* Page content */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
