"use client";

import { motion } from "framer-motion";
import { Download, RequestQuote, UserMultiple, ArrowRight, Time } from "@carbon/icons-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SelectDropdown from "@/components/shared/SelectDropdown";
import RevenueTrendChart from "@/components/analytics/RevenueTrendChart";
import ServiceBreakdownChart from "@/components/analytics/ServiceBreakdownChart";
import RFQVolumeChart from "@/components/analytics/RFQVolumeChart";
import { useState } from "react";

const statCards = [
  {
    label: "Total RFQs",
    value: "6",
    change: "+12%",
    positive: true,
    bg: "rgba(45,37,85,0.05)",
    iconBg: "rgba(45,37,85,0.08)",
    valueColor: "#2D2555",
    icon: RequestQuote,
    iconColor: "#2D2555",
  },
  {
    label: "Active Clients",
    value: "6",
    change: "+8%",
    positive: true,
    bg: "#FFF0E8",
    iconBg: "rgba(253,101,19,0.1)",
    valueColor: "#FD6513",
    icon: UserMultiple,
    iconColor: "#FD6513",
  },
  {
    label: "Conversion Rate",
    value: "63%",
    change: "+5%",
    positive: true,
    bg: "#E3FFF4",
    iconBg: "rgba(6,134,83,0.05)",
    valueColor: "#068653",
    icon: ArrowRight,
    iconColor: "#068653",
  },
  {
    label: "Avg Response Time",
    value: "36h",
    change: "-20%",
    positive: false,
    bg: "rgba(168,85,247,0.05)",
    iconBg: "rgba(168,85,247,0.07)",
    valueColor: "#A855F7",
    icon: Time,
    iconColor: "#A855F7",
  },
];

const performanceRows = [
  { service: "Web Development", rfqs: 35, conversion: "68%", avgBudget: "$18K", demand: "High" },
  { service: "Cloud Solutions", rfqs: 25, conversion: "72%", avgBudget: "$42K", demand: "High" },
  { service: "Mobile Apps",     rfqs: 18, conversion: "55%", avgBudget: "$28K", demand: "Medium" },
  { service: "AI & Analytics",  rfqs: 12, conversion: "80%", avgBudget: "$65K", demand: "High" },
  { service: "Cybersecurity",   rfqs: 6,  conversion: "50%", avgBudget: "$35K", demand: "Low" },
  { service: "IT Consulting",   rfqs: 4,  conversion: "45%", avgBudget: "$12K", demand: "Low" },
];

const demandStyle: Record<string, { pill: string; text: string }> = {
  High:   { pill: "bg-[#DCFCE7]", text: "text-[#068653]" },
  Medium: { pill: "bg-[#FEF9C3]", text: "text-[#FD6513]" },
  Low:    { pill: "bg-[#FEE2E2]", text: "text-[#E7000B]" },
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("last_7_months");

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Analytics" subtitle="Track performance, revenue and RFQ trends" />

      <main className="px-6 py-6 flex flex-col gap-6 pb-10">

        {/* Period selector + Export */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <SelectDropdown
            value={period}
            onChange={setPeriod}
            className="w-[160px]"
            options={[
              { label: "Last 7 Months", value: "last_7_months" },
              { label: "Last 3 Months", value: "last_3_months" },
              { label: "This Year",     value: "this_year" },
            ]}
          />
          <motion.button
            className="flex items-center gap-[6px] px-4 h-9 bg-[#2D2555] rounded-[6px] text-[12px] font-semibold text-[#FAFAFA] cursor-pointer"
            style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)" }}
            whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(45,37,85,0.3)" }}
            whileTap={{ scale: 0.97 }}
          >
            <Download size={16} />
            <span>Export Data</span>
          </motion.button>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          className="grid grid-cols-4 gap-[34px]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                className="relative rounded-[16px] border border-[#F3F3F3] p-[21px]"
                style={{ background: card.bg }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.12 + i * 0.06 }}
              >
                {/* Top row: icon + badge */}
                <div className="flex items-center justify-between mb-[22px]">
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-[12px]"
                    style={{ background: card.iconBg }}
                  >
                    <Icon size={20} style={{ color: card.iconColor }} />
                  </div>
                  <span
                    className={`text-[12px] font-bold leading-4 px-2 py-[2px] rounded-full ${
                      card.positive
                        ? "bg-[#F0FDF4] text-[#16A34A]"
                        : "bg-[#FEF2F2] text-[#DC2626]"
                    }`}
                  >
                    {card.change}
                  </span>
                </div>

                {/* Value */}
                <p className="text-[24px] font-semibold leading-8" style={{ color: card.valueColor }}>
                  {card.value}
                </p>

                {/* Label */}
                <p className="text-[12px] text-[#64748B] leading-4 mt-[4px]">{card.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts row */}
        <motion.div
          className="flex gap-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <RevenueTrendChart />
          <ServiceBreakdownChart />
        </motion.div>

        {/* Bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <RFQVolumeChart />
        </motion.div>

        {/* Performance Breakdown table */}
        <motion.div
          className="bg-white border border-[#F1F5F9] rounded-[16px] overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {/* Table header */}
          <div className="px-6 py-[15.4px] border-b border-[#F1F5F9]">
            <h3 className="text-[16px] font-bold text-[#0F172A] leading-6">Performance Breakdown</h3>
            <p className="text-[12px] text-[#64748B] leading-4 mt-[3px]">Service-level analytics</p>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC]/80">
                {["Service", "RFQs", "Conversion", "Avg Budget", "Demand"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-[11px] text-left text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.6px] leading-4"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {performanceRows.map((row, i) => {
                const d = demandStyle[row.demand];
                return (
                  <motion.tr
                    key={row.service}
                    className={i > 0 ? "border-t border-[#F8FAFC]" : ""}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.32 + i * 0.04 }}
                  >
                    <td className="px-6 py-[16px] text-[14px] font-semibold text-[#0F172A] leading-5">{row.service}</td>
                    <td className="px-6 py-[16px] text-[14px] text-[#475569] leading-5">{row.rfqs}</td>
                    <td className="px-6 py-[16px] text-[14px] font-semibold text-[#0F172A] leading-5">{row.conversion}</td>
                    <td className="px-6 py-[16px] text-[14px] text-[#475569] leading-5">{row.avgBudget}</td>
                    <td className="px-6 py-[16px]">
                      <span className={`inline-flex items-center px-[9.8px] py-[4px] rounded-full text-[12px] font-semibold leading-4 whitespace-nowrap ${d.pill} ${d.text}`}>
                        {row.demand}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>

      </main>
    </div>
  );
}
