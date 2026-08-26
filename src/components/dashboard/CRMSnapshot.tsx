"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const statusColors: Record<string, string> = {
  "New Submission": "#2D2555",
  "Under Review": "#F59E0B",
  "Strategy Call Scheduled": "#3B82F6",
  "Proposal Sent": "#068653",
  Negotiation: "#A855F7",
  Accepted: "#10B981",
  Rejected: "#E7000B",
  Closed: "#64748B",
};

export default function CRMSnapshot() {
  const [segments, setSegments] = useState<{ label: string; count: number; color: string }[]>([]);

  useEffect(() => {
    supabase
      .from("rfqs")
      .select("status")
      .then(({ data }) => {
        const counts = new Map<string, number>();
        for (const row of data ?? []) {
          counts.set(row.status, (counts.get(row.status) || 0) + 1);
        }
        setSegments(
          Array.from(counts.entries()).map(([label, count]) => ({
            label,
            count,
            color: statusColors[label] || "#94A3B8",
          }))
        );
      });
  }, []);

  const options: ApexCharts.ApexOptions = {
    chart: { type: "donut", fontFamily: "Open Sans, sans-serif" },
    colors: segments.map((s) => s.color),
    labels: segments.map((s) => s.label),
    stroke: { width: 2, colors: ["#FFFFFF"] },
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: "55%",
        },
      },
    },
    tooltip: { theme: "dark" },
  };

  const series = segments.map((s) => s.count);

  return (
    <motion.div
      className="flex-1 min-w-0 bg-white border border-[#F1F5F9] rounded-2xl p-6 flex flex-col gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div>
        <h3 className="text-[16px] font-bold text-[#0F172A]">CRM Snapshot</h3>
        <p className="text-[12px] text-[#64748B]">RFQ pipeline breakdown</p>
      </div>

      {segments.length > 0 && (
        <div className="flex items-center justify-center">
          <Chart options={options} series={series} type="donut" height={152} width={200} />
        </div>
      )}

      <div className="flex flex-col gap-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: seg.color }} />
              <span className="text-[12px] text-[#475569] capitalize">{seg.label}</span>
            </div>
            <span className="text-[12px] font-bold text-[#0F172A]">{seg.count}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
