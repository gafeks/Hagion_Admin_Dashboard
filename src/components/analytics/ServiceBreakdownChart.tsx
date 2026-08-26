"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface ServiceBreakdownChartProps {
  segments: Segment[];
}

export default function ServiceBreakdownChart({ segments }: ServiceBreakdownChartProps) {
  const options: ApexCharts.ApexOptions = {
    chart: { type: "donut", toolbar: { show: false }, fontFamily: "Segoe UI, sans-serif" },
    colors: segments.map((s) => s.color),
    labels: segments.map((s) => s.label),
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

  const series = segments.map((s) => s.value);

  return (
    <div className="flex flex-col bg-white border border-[#F1F5F9] rounded-[16px] p-[23.6px] w-[424px] flex-shrink-0">
      <h3 className="text-[16px] font-bold text-[#0F172A] leading-6">Service Breakdown</h3>
      <p className="text-[12px] text-[#64748B] leading-4 mt-[3px]">RFQs by service type</p>

      <div className="mt-3 overflow-hidden">
        <Chart options={options} series={series} type="donut" height={180} width="100%" />
      </div>

      <div className="flex flex-col gap-[5.2px] mt-1">
        {segments.map((s) => (
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
