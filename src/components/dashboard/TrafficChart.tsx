"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { lastNMonths, inMonth } from "@/lib/dateBuckets";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function TrafficChart() {
  const [categories, setCategories] = useState<string[]>([]);
  const [rfqSeries, setRfqSeries] = useState<number[]>([]);
  const [leadSeries, setLeadSeries] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      const months = lastNMonths(7);
      setCategories(months.map((m) => m.label));

      const [rfqRes, leadRes] = await Promise.all([
        supabase.from("rfqs").select("created_at"),
        supabase.from("leads").select("created_at"),
      ]);

      const rfqs = rfqRes.data ?? [];
      const leads = leadRes.data ?? [];

      setRfqSeries(months.map(({ year, month }) => rfqs.filter((r) => inMonth(r.created_at, year, month)).length));
      setLeadSeries(months.map(({ year, month }) => leads.filter((l) => inMonth(l.created_at, year, month)).length));
    })();
  }, []);

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
      categories,
      labels: { style: { colors: "#94A3B8", fontSize: "11px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#94A3B8", fontSize: "11px" } },
      min: 0,
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
    { name: "RFQs", data: rfqSeries },
    { name: "Leads", data: leadSeries },
  ];

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
