"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Add,
  ChartLineSmooth,
  Analytics,
  Checkmark,
} from "@carbon/icons-react";
import { supabase } from "@/lib/supabase";

const quickActions = [
  { label: "New RFQ", icon: Add, iconColor: "#2D2555", iconBg: "rgba(45, 37, 85, 0.082)", href: "/rfqs" },
  { label: "New Blog", icon: Add, iconColor: "#A855F7", iconBg: "rgba(168, 85, 247, 0.082)", href: "/blog" },
  { label: "View CRM", icon: ChartLineSmooth, iconColor: "#068653", iconBg: "rgba(6, 134, 83, 0.082)", href: "/crm" },
  { label: "Analytics", icon: Analytics, iconColor: "#3B82F6", iconBg: "rgba(59, 130, 246, 0.082)", href: "/analytics" },
];

interface ActivityItem {
  id: string;
  description: string;
  time: string;
}

export default function ActivityLog() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [conversionRate, setConversionRate] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("activity_log")
      .select("id, description, created_at")
      .order("created_at", { ascending: false })
      .limit(4)
      .then(({ data }) => {
        setActivities(
          (data ?? []).map((row) => ({
            id: row.id,
            description: row.description || "",
            time: new Date(row.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
          }))
        );
      });

    supabase
      .from("leads")
      .select("stage")
      .then(({ data }) => {
        const leads = data ?? [];
        if (leads.length === 0) return;
        const won = leads.filter((l) => l.stage === "won").length;
        setConversionRate(Math.round((won / leads.length) * 100));
      });
  }, []);

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
          {activities.length === 0 ? (
            <p className="text-[12px] text-[#94A3B8]">No activity yet.</p>
          ) : (
            activities.map((item, i) => (
              <motion.div
                key={item.id}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.06 }}
              >
                <div className="mt-1.5 w-2 h-2 rounded-full bg-[#F59E0B] shrink-0" />
                <div>
                  <p className="text-[12px] font-semibold text-[#334155]">{item.description}</p>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">{item.time}</p>
                </div>
              </motion.div>
            ))
          )}
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
        <p className="text-[14px] font-semibold text-white">
          {conversionRate !== null ? `Conversion rate at ${conversionRate}%` : "Building your pipeline"}
        </p>
        <p className="text-[12px] text-[#94A3B8] mt-1">
          {conversionRate !== null ? "Based on leads won across the CRM pipeline." : "Add leads to the CRM pipeline to track conversion."}
        </p>
      </motion.div>
    </div>
  );
}
