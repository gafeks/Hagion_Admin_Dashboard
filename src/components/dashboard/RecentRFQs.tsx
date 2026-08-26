"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight } from "@carbon/icons-react";
import { supabase } from "@/lib/supabase";

const statusStyles: Record<string, { bg: string; border: string; text: string }> = {
  "New Submission": { bg: "#DCFCE7", border: "#BBF7D0", text: "#068653" },
  "Under Review": { bg: "rgba(253, 101, 19, 0.1)", border: "rgba(253, 101, 19, 0.2)", text: "#FD6513" },
  "Strategy Call Scheduled": { bg: "#DBEAFE", border: "#BFDBFE", text: "#2563EB" },
  "Proposal Sent": { bg: "#F3E8FF", border: "#E9D5FF", text: "#7E22CE" },
  Negotiation: { bg: "#FFF7ED", border: "#FED7AA", text: "#C2410C" },
  Accepted: { bg: "#DCFCE7", border: "#BBF7D0", text: "#068653" },
  Rejected: { bg: "#FEE2E2", border: "#FECACA", text: "#B91C1C" },
  Closed: { bg: "rgba(231, 0, 11, 0.1)", border: "rgba(231, 0, 11, 0.15)", text: "#E7000B" },
};

interface RfqSummary {
  id: string;
  company: string;
  service: string;
  code: string;
  status: string;
  date: string;
}

export default function RecentRFQs() {
  const router = useRouter();
  const [rfqs, setRfqs] = useState<RfqSummary[]>([]);

  useEffect(() => {
    supabase
      .from("rfqs")
      .select("id, company_name, full_name, service, code, status, created_at")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setRfqs(
          (data ?? []).map((row) => ({
            id: row.id,
            company: row.company_name || row.full_name,
            service: row.service,
            code: row.code,
            status: row.status,
            date: new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          }))
        );
      });
  }, []);

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
          onClick={() => router.push("/rfqs")}
        >
          View All
          <ArrowUpRight size={16} />
        </motion.button>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {rfqs.map((rfq, i) => {
          const style = statusStyles[rfq.status] || { bg: "#F1F5F9", border: "#E2E8F0", text: "#475569" };
          return (
            <motion.div
              key={rfq.id}
              className="flex items-center justify-between px-6 py-3.5 border-t border-[#F8FAFC] hover:bg-[#FAFAFA] transition-colors cursor-pointer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              whileHover={{ x: 2 }}
              onClick={() => router.push("/rfqs")}
            >
              {/* Left — avatar + info */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2D2555] flex items-center justify-center text-[12px] font-bold text-white shrink-0">
                  {rfq.company.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#0F172A]">{rfq.company}</p>
                  <p className="text-[12px] text-[#64748B]">{rfq.service} · {rfq.code}</p>
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
