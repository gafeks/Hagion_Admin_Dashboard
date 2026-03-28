"use client";

import { motion } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import TrafficChart from "@/components/dashboard/TrafficChart";
import CRMSnapshot from "@/components/dashboard/CRMSnapshot";
import RecentRFQs from "@/components/dashboard/RecentRFQs";
import ActivityLog from "@/components/dashboard/ActivityLog";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-w-0">
      <DashboardHeader />

      <div className="px-6 py-6 flex flex-col gap-6 min-w-0 overflow-hidden">
        {/* Overview Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div>
            <h2 className="text-[24px] font-semibold text-[#0A0A0A]">Overview</h2>
            <p className="text-[16px] text-[#676767]">Monitor and manage all the activities</p>
          </div>
          <motion.button
            className="flex items-center justify-center px-4 h-9 bg-[#2D2555] text-white text-[14px] font-semibold rounded-lg shadow-sm shrink-0"
            whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(45,37,85,0.3)" }}
            whileTap={{ scale: 0.97 }}
          >
            Export Analytics
          </motion.button>
        </motion.div>

        <StatsCards />

        <div className="flex gap-6 min-w-0">
          <TrafficChart />
          <CRMSnapshot />
        </div>

        <div className="flex gap-6 min-w-0">
          <RecentRFQs />
          <ActivityLog />
        </div>
      </div>
    </div>
  );
}
