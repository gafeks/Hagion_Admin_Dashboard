"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const options: ApexCharts.ApexOptions = {
  chart: {
    type: "area",
    toolbar: { show: false },
    fontFamily: "Segoe UI, sans-serif",
  },
  colors: ["#2D2555", "#068653"],
  stroke: { curve: "smooth", width: 2.5 },
  fill: {
    type: "gradient",
    gradient: {
      opacityFrom: 0.09,
      opacityTo: 0,
      stops: [36, 95],
    },
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    labels: { style: { colors: "#94A3B8", fontSize: "11px" } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { colors: "#94A3B8", fontSize: "11px" },
      formatter: (v) => (v >= 1000 ? `${v / 1000}k` : String(v)),
    },
    min: 0,
    max: 60000,
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
  { name: "Revenue ($)", data: [18000, 26000, 22000, 41000, 50000, 35000, 57000] },
  { name: "RFQ Value ($)", data: [12000, 18000, 15000, 28000, 33000, 24000, 38000] },
];

export default function RevenueTrendChart() {
  return (
    <div className="flex flex-col bg-white border border-[#F1F5F9] rounded-[16px] p-[23.6px] flex-1 min-w-0">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-[16px] font-bold text-[#0F172A] leading-6">Revenue & RFQ Trend</h3>
          <p className="text-[12px] text-[#64748B] leading-4 mt-[3px]">Monthly performance overview</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#2D2555]" />
            <span className="text-[11px] text-[#64748B]">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#068653]" />
            <span className="text-[11px] text-[#64748B]">RFQ Value</span>
          </div>
        </div>
      </div>
      <div className="w-full overflow-hidden">
        <Chart options={options} series={series} type="area" height={240} width="100%" />
      </div>
    </div>
  );
}
