"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface RFQVolumeChartProps {
  categories: string[];
  submitted: number[];
  won: number[];
}

export default function RFQVolumeChart({ categories, submitted, won }: RFQVolumeChartProps) {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "Segoe UI, sans-serif",
    },
    colors: ["#2D2555", "#068653"],
    plotOptions: {
      bar: {
        columnWidth: "55%",
        borderRadius: 4,
        borderRadiusApplication: "end",
        dataLabels: { position: "top" },
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
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
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    fill: { opacity: 1 },
    legend: { show: false },
    tooltip: { theme: "dark" },
  };

  const series = [
    { name: "Submitted", data: submitted },
    { name: "Won", data: won },
  ];

  return (
    <div className="bg-white border border-[#F1F5F9] rounded-[16px] p-[23.6px]">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-[16px] font-bold text-[#0F172A] leading-6">Monthly RFQ Volume</h3>
          <p className="text-[12px] text-[#64748B] leading-4 mt-[3px]">New submissions per month</p>
        </div>
        <div className="flex items-center gap-4 mt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#2D2555]" />
            <span className="text-[11px] text-[#64748B]">Submitted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#068653]" />
            <span className="text-[11px] text-[#64748B]">Won</span>
          </div>
        </div>
      </div>
      <div className="w-full overflow-hidden">
        <Chart options={options} series={series} type="bar" height={200} width="100%" />
      </div>
    </div>
  );
}
