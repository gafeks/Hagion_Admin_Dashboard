"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, RequestQuote, UserMultiple, ArrowRight, DocumentBlank } from "@carbon/icons-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RevenueTrendChart from "@/components/analytics/RevenueTrendChart";
import ServiceBreakdownChart from "@/components/analytics/ServiceBreakdownChart";
import RFQVolumeChart from "@/components/analytics/RFQVolumeChart";
import Loader from "@/components/shared/Loader";
import ErrorState from "@/components/shared/ErrorState";
import { supabase } from "@/lib/supabase";
import { parseBudgetMidpoint } from "@/lib/budget";
import { lastNMonths, inMonth } from "@/lib/dateBuckets";

interface RfqRow {
  id: string;
  company_name: string | null;
  full_name: string;
  service: string;
  budget: string | null;
  status: string;
  created_at: string;
}

interface LeadRow {
  id: string;
  service: string | null;
  stage: string;
  created_at: string;
}

const serviceColors = ["#2D2555", "#068653", "#3B82F6", "#A855F7", "#EF4444", "#F59E0B", "#10B981", "#F97316"];
const closedStatuses = ["Accepted", "Rejected", "Closed"];

export default function AnalyticsPage() {
  const [rfqs, setRfqs] = useState<RfqRow[]>([]);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const [rfqRes, leadRes] = await Promise.all([
      supabase.from("rfqs").select("id, company_name, full_name, service, budget, status, created_at"),
      supabase.from("leads").select("id, service, stage, created_at"),
    ]);

    if (rfqRes.error || leadRes.error) {
      setError("Couldn't load analytics data. Please try again.");
      setLoading(false);
      return;
    }

    setRfqs(rfqRes.data ?? []);
    setLeads(leadRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="flex flex-col min-h-screen"><DashboardHeader title="Analytics" subtitle="Track performance, revenue and RFQ trends" /><Loader /></div>;
  if (error) return <div className="flex flex-col min-h-screen"><DashboardHeader title="Analytics" subtitle="Track performance, revenue and RFQ trends" /><ErrorState message={error} onRetry={load} /></div>;

  const totalRfqs = rfqs.length;
  const activeClients = new Set(rfqs.map((r) => (r.company_name || r.full_name).toLowerCase())).size;
  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.stage === "won").length;
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
  const openRfqs = rfqs.filter((r) => !closedStatuses.includes(r.status)).length;

  const statCards = [
    { label: "Total RFQs", value: String(totalRfqs), tag: "All time", bg: "rgba(45,37,85,0.05)", iconBg: "rgba(45,37,85,0.08)", valueColor: "#2D2555", icon: RequestQuote, iconColor: "#2D2555" },
    { label: "Active Clients", value: String(activeClients), tag: "Unique companies", bg: "#FFF0E8", iconBg: "rgba(253,101,19,0.1)", valueColor: "#FD6513", icon: UserMultiple, iconColor: "#FD6513" },
    { label: "Conversion Rate", value: `${conversionRate}%`, tag: "Won / total leads", bg: "#E3FFF4", iconBg: "rgba(6,134,83,0.05)", valueColor: "#068653", icon: ArrowRight, iconColor: "#068653" },
    { label: "Open RFQs", value: String(openRfqs), tag: "Awaiting resolution", bg: "rgba(168,85,247,0.05)", iconBg: "rgba(168,85,247,0.07)", valueColor: "#A855F7", icon: DocumentBlank, iconColor: "#A855F7" },
  ];

  const months = lastNMonths(7);
  const monthLabels = months.map((m) => m.label);

  const pipelineValueSeries = months.map(({ year, month }) =>
    Math.round(
      rfqs
        .filter((r) => inMonth(r.created_at, year, month))
        .reduce((sum, r) => sum + parseBudgetMidpoint(r.budget), 0)
    )
  );

  const submittedSeries = months.map(({ year, month }) => rfqs.filter((r) => inMonth(r.created_at, year, month)).length);

  const wonSeries = months.map(({ year, month }) => leads.filter((l) => l.stage === "won" && inMonth(l.created_at, year, month)).length);

  const serviceCounts = new Map<string, number>();
  for (const r of rfqs) {
    serviceCounts.set(r.service, (serviceCounts.get(r.service) || 0) + 1);
  }
  const serviceSegments = Array.from(serviceCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, count], i) => ({
      label,
      value: totalRfqs > 0 ? Math.round((count / totalRfqs) * 100) : 0,
      color: serviceColors[i % serviceColors.length],
    }));

  const performanceRows = Array.from(serviceCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([service, count]) => {
      const serviceLeads = leads.filter((l) => l.service === service);
      const serviceWon = serviceLeads.filter((l) => l.stage === "won").length;
      const conversion = serviceLeads.length > 0 ? Math.round((serviceWon / serviceLeads.length) * 100) : 0;
      const serviceRfqs = rfqs.filter((r) => r.service === service);
      const avgBudget = serviceRfqs.length > 0 ? Math.round(serviceRfqs.reduce((s, r) => s + parseBudgetMidpoint(r.budget), 0) / serviceRfqs.length) : 0;
      const demand = count >= 8 ? "High" : count >= 3 ? "Medium" : "Low";
      return { service, rfqs: count, conversion: `${conversion}%`, avgBudget: `$${Math.round(avgBudget / 1000)}K`, demand };
    });

  const demandStyle: Record<string, { pill: string; text: string }> = {
    High: { pill: "bg-[#DCFCE7]", text: "text-[#068653]" },
    Medium: { pill: "bg-[#FEF9C3]", text: "text-[#FD6513]" },
    Low: { pill: "bg-[#FEE2E2]", text: "text-[#E7000B]" },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Analytics" subtitle="Track performance, revenue and RFQ trends" />

      <main className="px-6 py-6 flex flex-col gap-6 pb-10">

        {/* Export */}
        <motion.div
          className="flex items-center justify-end"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <motion.button
            className="flex items-center gap-[6px] px-4 h-9 bg-[#2D2555] rounded-[6px] text-[12px] font-semibold text-[#FAFAFA] cursor-pointer"
            style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)" }}
            whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(45,37,85,0.3)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              const header = ["Service", "RFQs", "Conversion", "Avg Budget", "Demand"];
              const rows = performanceRows.map((r) => [r.service, r.rfqs, r.conversion, r.avgBudget, r.demand]);
              const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "analytics.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
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
                  <span className="text-[11px] font-semibold text-[#94A3B8]">{card.tag}</span>
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
          <RevenueTrendChart categories={monthLabels} values={pipelineValueSeries} />
          <ServiceBreakdownChart segments={serviceSegments} />
        </motion.div>

        {/* Bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <RFQVolumeChart categories={monthLabels} submitted={submittedSeries} won={wonSeries} />
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
