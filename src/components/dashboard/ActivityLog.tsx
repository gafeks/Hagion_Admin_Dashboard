"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Add,
  ChartLineSmooth,
  Analytics,
  Checkmark,
} from "@carbon/icons-react";

const quickActions = [
  { label: "New RFQ", icon: Add, iconColor: "#2D2555", iconBg: "rgba(45, 37, 85, 0.082)", href: "/rfqs/new" },
  { label: "New Blog", icon: Add, iconColor: "#A855F7", iconBg: "rgba(168, 85, 247, 0.082)", href: "/blog/new" },
  { label: "View CRM", icon: ChartLineSmooth, iconColor: "#068653", iconBg: "rgba(6, 134, 83, 0.082)", href: "/crm" },
  { label: "Analytics", icon: Analytics, iconColor: "#3B82F6", iconBg: "rgba(59, 130, 246, 0.082)", href: "/analytics" },
];

const activities = [
  { action: "RFQ updated —", company: "TechBridge Ghana", time: "Mar 6, 11:49 AM" },
  { action: "RFQ updated —", company: "Sahel Agri Solutions", time: "Mar 6, 11:49 AM" },
  { action: "RFQ updated —", company: "LogistiCore Nigeria", time: "Mar 6, 11:49 AM" },
  { action: "RFQ updated —", company: "NileHealth Sudan", time: "Mar 6, 11:49 AM" },
];

export default function ActivityLog() {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-5">
      {/* Quick Actions */}
      <motion.div
        className="bg-white border border-[#F1F5F9] rounded-2xl p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <h3 className="text-[16px] font-bold text-[#0F172A] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <motion.div key={action.label} whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }} whileTap={{ scale: 0.97 }}>
              <Link
                href={action.href}
                className="flex flex-col items-center gap-2 py-3.5 border border-[#F4F4F4] rounded-xl hover:border-[#E0E0E0] transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: action.iconBg }}
                >
                  <action.icon size={16} style={{ color: action.iconColor }} />
                </div>
                <span className="text-[12px] font-semibold text-[#334155]">{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Activity Feed */}
      <motion.div
        className="bg-white border border-[#F1F5F9] rounded-2xl p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-[16px] font-bold text-[#0F172A] mb-4">Activity Feed</h3>
        <div className="flex flex-col gap-3">
          {activities.map((item, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.06 }}
            >
              <div className="mt-1.5 w-2 h-2 rounded-full bg-[#F59E0B] shrink-0" />
              <div>
                <p className="text-[12px] text-[#334155]">
                  <span className="font-semibold">{item.action}</span>{" "}
                  <span className="font-semibold">{item.company}</span>
                </p>
                <p className="text-[10px] text-[#94A3B8] mt-0.5">{item.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Performance Banner */}
      <motion.div
        className="rounded-2xl p-5 overflow-hidden"
        style={{ background: "linear-gradient(109.9deg, #2D2555 0%, #1A1540 100%)" } as React.CSSProperties}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Checkmark size={16} className="text-[#068653]" />
          <span className="text-[12px] font-bold text-[#068653] uppercase tracking-[0.6px]">Performance</span>
        </div>
        <p className="text-[14px] font-semibold text-white">All metrics trending up</p>
        <p className="text-[12px] text-[#94A3B8] mt-1">
          Conversion rate improved 5% this quarter compared to last.
        </p>
      </motion.div>
    </div>
  );
}
