"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "@carbon/icons-react";

const statusStyles: Record<string, { bg: string; border: string; text: string }> = {
  Rejected: { bg: "#FEE2E2", border: "#FECACA", text: "#B91C1C" },
  "Proposal sent": { bg: "#F3E8FF", border: "#E9D5FF", text: "#7E22CE" },
  Reviewing: { bg: "rgba(253, 101, 19, 0.1)", border: "rgba(253, 101, 19, 0.2)", text: "#FD6513" },
  Accepted: { bg: "#DCFCE7", border: "#BBF7D0", text: "#068653" },
  Closed: { bg: "rgba(231, 0, 11, 0.1)", border: "rgba(231, 0, 11, 0.15)", text: "#E7000B" },
};

const rfqs = [
  { initial: "T", company: "TechBridge Ghana", service: "cloud solutions", rfqId: "RFQ-2026-001", status: "Rejected", date: "Mar 6" },
  { initial: "S", company: "Sahel Agri Solutions", service: "Web development", rfqId: "RFQ-2026-002", status: "Proposal sent", date: "Mar 6" },
  { initial: "L", company: "LogistiCore Nigeria", service: "AI solutions", rfqId: "RFQ-2026-003", status: "Reviewing", date: "Mar 6" },
  { initial: "N", company: "NileHealth Sudan", service: "Cybersecurity", rfqId: "RFQ-2026-004", status: "Reviewing", date: "Mar 6" },
  { initial: "S", company: "Savanna Capital Kenya", service: "Mobile app", rfqId: "RFQ-2026-005", status: "Accepted", date: "Mar 6" },
  { initial: "A", company: "Atlas Retail Morocco", service: "IT consulting", rfqId: "RFQ-2026-006", status: "Closed", date: "Mar 6" },
];

export default function RecentRFQs() {
  return (
    <motion.div
      className="flex-[2] min-w-0 bg-white border border-[#F1F5F9] rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h3 className="text-[16px] font-bold text-[#0F172A]">Recent RFQs</h3>
          <p className="text-[12px] text-[#64748B]">Latest submissions</p>
        </div>
        <motion.button
          className="flex items-center gap-1 px-3 h-8 border border-[#2D2555]/80 rounded-lg text-[12px] font-semibold text-[#2D2555]"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          View All
          <ArrowUpRight size={16} />
        </motion.button>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {rfqs.map((rfq, i) => {
          const style = statusStyles[rfq.status];
          return (
            <motion.div
              key={rfq.rfqId}
              className="flex items-center justify-between px-6 py-3.5 border-t border-[#F8FAFC] hover:bg-[#FAFAFA] transition-colors cursor-pointer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              whileHover={{ x: 2 }}
            >
              {/* Left — avatar + info */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2D2555] flex items-center justify-center text-[12px] font-bold text-white shrink-0">
                  {rfq.initial}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#0F172A]">{rfq.company}</p>
                  <p className="text-[12px] text-[#64748B]">{rfq.service} · {rfq.rfqId}</p>
                </div>
              </div>

              {/* Right — status + date */}
              <div className="flex items-center gap-3">
                <span
                  className="px-2.5 py-0.5 rounded text-[10px] font-semibold border"
                  style={{ background: style.bg, borderColor: style.border, color: style.text }}
                >
                  {rfq.status}
                </span>
                <span className="text-[12px] text-[#94A3B8]">{rfq.date}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
