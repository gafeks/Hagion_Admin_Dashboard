"use client";

import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  DocumentBlank,
  Email,
  ChartLineSmooth,
  Blog,
  Growth,
} from "@carbon/icons-react";

const stats = [
  {
    label: "Total RFQs",
    value: 6,
    suffix: "",
    change: "+12%",
    Icon: DocumentBlank,
    iconColor: "#2D2555",
    iconBg: "rgba(45, 37, 85, 0.07)",
  },
  {
    label: "Open Leads",
    value: 0,
    suffix: "",
    tag: "Needs attention",
    Icon: Email,
    iconColor: "#F59E0B",
    iconBg: "rgba(245, 158, 11, 0.08)",
  },
  {
    label: "Active Projects",
    value: 2,
    suffix: "",
    change: "+8%",
    Icon: ChartLineSmooth,
    iconColor: "#3B82F6",
    iconBg: "rgba(59, 130, 246, 0.08)",
  },
  {
    label: "Blog Posts",
    value: 4,
    suffix: "",
    tag: "1 drafts",
    Icon: Blog,
    iconColor: "#A855F7",
    iconBg: "rgba(168, 85, 247, 0.08)",
  },
  {
    label: "Conversion Rate",
    value: 17,
    suffix: "%",
    change: "+5%",
    Icon: Growth,
    iconColor: "#068653",
    iconBg: "rgba(6, 134, 83, 0.07)",
  },
];

export default function StatsCards() {
  return (
    <div className="flex gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          className="flex-1 bg-white border border-[#F1F5F9] rounded-2xl p-5 h-[150px] flex flex-col justify-between cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: stat.iconBg } as React.CSSProperties}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <stat.Icon size={20} style={{ color: stat.iconColor }} />
            </motion.div>
            {stat.change && (
              <motion.span
                className="px-2 py-0.5 text-[12px] font-semibold text-[#16A34A] bg-[#F0FDF4] rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 300 }}
              >
                {stat.change}
              </motion.span>
            )}
            {stat.tag && (
              <span className="text-[12px] font-semibold text-[#94A3B8]">
                {stat.tag}
              </span>
            )}
          </div>

          <span className="text-[24px] font-black text-[#0F172A]">
            <CountUp end={stat.value} duration={1.5} delay={0.3 + i * 0.1} />
            {stat.suffix}
          </span>

          <span className="text-[12px] font-semibold text-[#64748B]">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
