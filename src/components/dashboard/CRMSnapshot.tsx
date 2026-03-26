"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const segments = [
  { label: "reviewing", count: 2, color: "#2D2555" },
  { label: "proposal sent", count: 1, color: "#068653" },
  { label: "accepted", count: 1, color: "#3B82F6" },
  { label: "rejected", count: 1, color: "#E7000B" },
];

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

export default function CRMSnapshot() {
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

      <div className="flex items-center justify-center">
        <Chart options={options} series={series} type="donut" height={152} width={200} />
      </div>

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
