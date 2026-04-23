"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const services = [
  { label: "Web Dev",    value: 35, color: "#2D2555" },
  { label: "Cloud",      value: 25, color: "#068653" },
  { label: "Mobile",     value: 18, color: "#3B82F6" },
  { label: "AI/Data",    value: 12, color: "#A855F7" },
  { label: "Security",   value: 6,  color: "#EF4444" },
  { label: "Consulting", value: 4,  color: "#F59E0B" },
];

const options: ApexCharts.ApexOptions = {
  chart: { type: "donut", toolbar: { show: false }, fontFamily: "Segoe UI, sans-serif" },
  colors: services.map((s) => s.color),
  labels: services.map((s) => s.label),
  legend: { show: false },
  dataLabels: { enabled: false },
  stroke: { width: 1, colors: ["#fff"] },
  plotOptions: {
    pie: {
      donut: {
        size: "55%",
      },
    },
  },
  tooltip: { theme: "dark" },
};

const series = services.map((s) => s.value);

export default function ServiceBreakdownChart() {
  return (
    <div className="flex flex-col bg-white border border-[#F1F5F9] rounded-[16px] p-[23.6px] w-[424px] flex-shrink-0">
      <h3 className="text-[16px] font-bold text-[#0F172A] leading-6">Service Breakdown</h3>
      <p className="text-[12px] text-[#64748B] leading-4 mt-[3px]">RFQs by service type</p>

      <div className="mt-3 overflow-hidden">
        <Chart options={options} series={series} type="donut" height={180} width="100%" />
      </div>

      <div className="flex flex-col gap-[5.2px] mt-1">
        {services.map((s) => (
          <div key={s.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
              <span className="text-[12px] text-[#475569] leading-4">{s.label}</span>
            </div>
            <span className="text-[12px] font-bold text-[#0F172A] leading-4">{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
