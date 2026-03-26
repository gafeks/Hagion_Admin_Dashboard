"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const options: ApexCharts.ApexOptions = {
  chart: {
    type: "area",
    toolbar: { show: false },
    fontFamily: "Open Sans, sans-serif",
  },
  colors: ["#2D2555", "#068653"],
  stroke: { curve: "smooth", width: 2.5 },
  fill: {
    type: "gradient",
    gradient: {
      opacityFrom: 0.09,
      opacityTo: 0,
      stops: [5, 95],
    },
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    labels: { style: { colors: "#94A3B8", fontSize: "11px" } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: { style: { colors: "#94A3B8", fontSize: "11px" } },
    min: 0,
    max: 24,
    tickAmount: 4,
  },
  grid: {
    borderColor: "#F1F5F9",
    strokeDashArray: 4,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } },
  },
  legend: { show: false },
  dataLabels: { enabled: false },
  tooltip: { theme: "dark" },
};

const series = [
  { name: "RFQs", data: [4, 8, 10, 14, 12, 18, 6] },
  { name: "Leads", data: [12, 6, 8, 4, 10, 2, 22] },
];

export default function TrafficChart() {
  return (
    <motion.div
      className="flex-[2] min-w-0 overflow-hidden bg-white border border-[#F1F5F9] rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[16px] font-bold text-[#0F172A]">Traffic & RFQ Trend</h3>
          <p className="text-[12px] text-[#64748B]">Last 7 months performance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#2D2555]" />
            <span className="text-[12px] text-[#64748B]">RFQs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#068653]" />
            <span className="text-[12px] text-[#64748B]">Leads</span>
          </div>
        </div>
      </div>
      <div className="w-full overflow-hidden">
        <Chart options={options} series={series} type="area" height={220} width="100%" />
      </div>
    </motion.div>
  );
}
