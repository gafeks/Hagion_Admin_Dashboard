"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Notification, ChevronDown, Settings, Logout } from "@carbon/icons-react";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <motion.header
      className="flex items-center justify-between px-6 h-[80px] bg-white z-10"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="flex flex-col gap-1"
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h1 className="text-[18px] font-bold leading-[28px] text-[#0F172A]">{title || "Dashboard"}</h1>
        <p className="text-[14px] text-[#64748B]">{subtitle || `Welcome back, Udeme — ${today}`}</p>
      </motion.div>

      <motion.div
        className="flex items-center gap-[31px]"
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="relative w-[211px] h-10">
          <div className="absolute inset-0 bg-[#F5F7FA] border border-[#F1EEFE] rounded-full" />
          <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#2D2555]" />
          <input
            placeholder="Search for something"
            className="absolute inset-0 bg-transparent pl-[50px] pr-4 text-[12px] text-[#2D2555] placeholder:text-[#2D2555]/60 outline-none rounded-full"
          />
        </div>

        <motion.button
          className="relative w-9 h-9 flex items-center justify-center rounded-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Notification size={20} className="text-[#475569]" />
          <motion.span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#EF4444] rounded-full flex items-center justify-center text-[10px] font-semibold text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 400 }}
          >
            3
          </motion.span>
        </motion.button>

        {/* Profile + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            className="flex items-center gap-1.5"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
              alt="Profile"
              width={30}
              height={30}
              className="rounded-full object-cover"
            />
            <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={20} className="text-[#737373]" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                className="absolute right-0 top-[calc(100%+8px)] w-[224px] bg-white border-2 border-[#E5E5E5] rounded-md shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] p-1"
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                {/* User info */}
                <div className="px-3 py-1.5">
                  <p className="text-[14px] font-semibold text-[#0A0A0A]">Gift Hagion</p>
                  <p className="text-[12px] text-[#737373]">gifthegion@gmail.com</p>
                </div>

                <div className="h-px bg-[#F5F5F5] my-1" />

                {/* Settings */}
                <motion.button
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-left hover:bg-[#F5F5F5] transition-colors"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDropdownOpen(false)}
                >
                  <Settings size={16} className="text-[#0A0A0A]" />
                  <span className="text-[14px] text-[#0A0A0A]">Settings</span>
                </motion.button>

                <div className="h-px bg-[#F5F5F5] my-1" />

                {/* Sign out */}
                <motion.button
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-left hover:bg-[#FEF2F2] transition-colors"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDropdownOpen(false)}
                >
                  <Logout size={16} className="text-[#DC2626]" />
                  <span className="text-[14px] text-[#DC2626]">Sign out</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.header>
  );
}
