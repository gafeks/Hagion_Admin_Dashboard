"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "@carbon/icons-react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  label: string;
  value: string;
}

interface SelectDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export default function SelectDropdown({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
}: SelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-9 px-3 flex items-center justify-between border border-[#E5E5E5] rounded-[6px] bg-transparent cursor-pointer"
      >
        <span className={`text-[13px] ${value ? "text-[#0A0A0A]" : "text-[#737373]"}`}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#0A0A0A] opacity-50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-[calc(100%+4px)] left-0 w-full bg-white z-[200] p-1 flex flex-col gap-3"
            style={{
              boxShadow: "0px 0px 1px rgba(24, 24, 27, 0.3), 0px 4px 8px rgba(24, 24, 27, 0.1)",
              borderRadius: "4px",
            }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => { onChange(option.value); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-1 h-[28px] rounded-[2px] text-[14px] font-medium text-black transition-colors ${
                    isSelected ? "bg-[#F4F4F5]" : "hover:bg-[#F4F4F5]"
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M13.3337 4L6.00033 11.3333L2.66699 8"
                        stroke="#27272A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
