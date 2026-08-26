"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Download, Restart, Search, Filter, View } from "@carbon/icons-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ActivityDetailModal, { LogEntry } from "@/components/activity/ActivityDetailModal";
import Loader from "@/components/shared/Loader";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import { supabase } from "@/lib/supabase";

const actionStyle: Record<string, { bg: string; text: string }> = {
  approved:  { bg: "rgba(6,134,83,0.1)", text: "#068653" },
  published: { bg: "#DCFCE7",            text: "#068653" },
  deleted:   { bg: "#FEE2E2",            text: "#E7000B" },
  rejected:  { bg: "#FEE2E2",            text: "#E7000B" },
  created:   { bg: "#D1FAE5",            text: "#068653" },
  updated:   { bg: "#FEF3C7",            text: "#D97706" },
  edited:    { bg: "#DBEAFE",            text: "#1D4ED8" },
};

const moduleStyle: Record<string, { bg: string; text: string }> = {
  RFQ:       { bg: "#FEF3C7",            text: "#F54900" },
  Blog:      { bg: "#F3E8FF",            text: "#7E22CE" },
  Portfolio: { bg: "#DCFCE7",            text: "#068653" },
  CRM:       { bg: "#DBEAFE",            text: "#1D4ED8" },
  Analytics: { bg: "rgba(45,37,85,0.07)",text: "#2D2555" },
  Messages:          { bg: "#FFF0E8",            text: "#FD6513" },
  Services:          { bg: "#DBEAFE",            text: "#1D4ED8" },
  "Admin Management":{ bg: "#FEE2E2",            text: "#E7000B" },
};

const allRoles   = ["All Roles",   "Super Admin", "Admin", "Content Admin"];
const allModules = ["All Modules", "RFQ", "Blog", "Portfolio", "CRM", "Messages", "Admin Management"];

export default function ActivityPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search,      setSearch]      = useState("");
  const [roleFilter,  setRoleFilter]  = useState("All Roles");
  const [modFilter,   setModFilter]   = useState("All Modules");
  const [fromDate,    setFromDate]    = useState("");
  const [toDate,      setToDate]      = useState("");
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const loadLogs = () => {
    setLoading(true);
    setError(null);
    supabase
      .from("activity_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data, error: fetchError }) => {
        if (fetchError || !data) {
          setError("Couldn't load the activity log. Please try again.");
          setLoading(false);
          return;
        }
        setLogs(
          data.map((row) => ({
            id: row.id,
            initials: (row.actor_name || row.actor_email || "?").charAt(0).toUpperCase(),
            name: row.actor_name || row.actor_email || "Unknown",
            email: row.actor_email || "",
            role: row.actor_role || "—",
            action: row.action,
            description: row.description || "",
            module: row.module,
            affectedItem: row.affected_item || "",
            date: new Date(row.created_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }),
            device: row.device || "",
            additionalDetails: row.description || "",
          }))
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = !q || l.name.toLowerCase().includes(q) || l.action.toLowerCase().includes(q) || l.affectedItem.toLowerCase().includes(q) || l.description.toLowerCase().includes(q);
    const matchRole   = roleFilter === "All Roles"   || l.role   === roleFilter;
    const matchMod    = modFilter  === "All Modules" || l.module  === modFilter;
    const logDate = new Date(l.date);
    const matchFrom = !fromDate || logDate >= new Date(fromDate);
    const matchTo = !toDate || logDate <= new Date(new Date(toDate).getTime() + 86400000);
    return matchSearch && matchRole && matchMod && matchFrom && matchTo;
  });

  const dropdownCls = "appearance-none h-10 px-3 pr-7 text-[14px] text-[#0A0A0A] bg-white border border-[#E2E8F0] rounded-[12px] outline-none cursor-pointer flex-shrink-0";
  const dropdownStyle = { boxShadow: "0px 1px 2px rgba(0,0,0,0.05)" };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Activity Log" subtitle={`${filtered.length} total entries`} />

      <main className="px-6 py-6 flex flex-col gap-6 pb-10">

        {/* Page header row */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-[12px] flex-shrink-0" style={{ background: "#050752" }}>
              <Activity size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#0F172A] leading-7">Activity Log</h2>
              <p className="text-[14px] text-[#64748B] leading-5">{logs.length} total entries</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              className="flex items-center gap-2 px-[15.8px] h-[37.6px] bg-white border border-[#E2E8F0] rounded-[12px] text-[14px] text-[#475569] cursor-pointer"
              style={{ boxShadow: "0px 1px 2px rgba(0,0,0,0.05)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={loadLogs}
            >
              <Restart size={16} />
              <span>Refresh</span>
            </motion.button>
            <motion.button
              className="flex items-center gap-2 px-4 h-9 bg-[#2D2555] rounded-[8px] text-[14px] text-white cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const header = ["Admin", "Email", "Role", "Action", "Module", "Affected Item", "Date"];
                const rows = filtered.map((l) => [l.name, l.email, l.role, l.action, l.module, l.affectedItem, l.date]);
                const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "activity-log.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download size={16} />
              <span>Export Data</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Filter panel */}
        <motion.div
          className="bg-white border border-[#F1F5F9] rounded-[16px] p-[15.8px] flex flex-col gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          {/* Filters label */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[#94A3B8]" />
            <span className="text-[14px] font-semibold text-[#475569]">Filters</span>
          </div>

          {/* Search + dropdowns */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search by admin, action, or item..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 text-[14px] text-[#0A0A0A] placeholder:text-[#737373] bg-white border border-[#E2E8F0] rounded-[12px] outline-none"
                style={{ boxShadow: "0px 1px 2px rgba(0,0,0,0.05)" }}
              />
            </div>
            <div className="relative flex-shrink-0">
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className={dropdownCls} style={{ ...dropdownStyle, width: 176 }}>
                {allRoles.map((r) => <option key={r}>{r}</option>)}
              </select>
              <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div className="relative flex-shrink-0">
              <select value={modFilter} onChange={(e) => setModFilter(e.target.value)} className={dropdownCls} style={{ ...dropdownStyle, width: 176 }}>
                {allModules.map((m) => <option key={m}>{m}</option>)}
              </select>
              <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>

          {/* Date range */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-[12px] text-[#737373] flex-shrink-0">From</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="flex-1 h-10 px-3 text-[14px] text-[#0A0A0A] bg-white border border-[#E2E8F0] rounded-[12px] outline-none"
                style={{ boxShadow: "0px 1px 2px rgba(0,0,0,0.05)" }}
              />
            </div>
            <div className="flex items-center gap-2 flex-1">
              <span className="text-[12px] text-[#737373] flex-shrink-0">To</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="flex-1 h-10 px-3 text-[14px] text-[#0A0A0A] bg-white border border-[#E2E8F0] rounded-[12px] outline-none"
                style={{ boxShadow: "0px 1px 2px rgba(0,0,0,0.05)" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          className="bg-white border border-[#F1F5F9] rounded-[16px] overflow-x-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          {loading ? (
            <Loader />
          ) : error ? (
            <ErrorState message={error} onRetry={loadLogs} />
          ) : filtered.length === 0 ? (
            <EmptyState title="No activity yet" description="Actions taken across the dashboard will show up here." />
          ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC]">
                {["Admin", "Role", "Action", "Module", "Affected Item", "Date & Time", ""].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-[14px] text-left text-[12px] font-semibold text-[#64748B] uppercase leading-4"
                    style={{ letterSpacing: "0.6px" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => {
                const a = actionStyle[log.action]  ?? { bg: "#F1F5F9", text: "#475569" };
                const m = moduleStyle[log.module]  ?? { bg: "#F1F5F9", text: "#475569" };
                return (
                  <motion.tr
                    key={log.id}
                    className={i > 0 ? "border-t border-[#F8FAFC]" : ""}
                    style={{ borderTopWidth: i > 0 ? "0.8px" : 0 }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, delay: 0.18 + i * 0.04 }}
                  >
                    {/* Admin */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-[10px]">
                        <div className="w-7 h-7 flex items-center justify-center rounded-[8px] flex-shrink-0 text-[12px] font-bold text-white" style={{ background: "#050752" }}>
                          {log.initials}
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-[#0F172A] leading-[18px]">{log.name}</p>
                          <p className="text-[12px] text-[#94A3B8] leading-4">{log.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span className="text-[12px] font-semibold text-[#475569] leading-4">{log.role}</span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center px-[9.8px] py-[1.8px] rounded-[6px] text-[12px] font-semibold leading-4 capitalize whitespace-nowrap flex-shrink-0"
                          style={{ background: a.bg, color: a.text }}
                        >
                          {log.action}
                        </span>
                        <span className="text-[14px] text-[#334155] leading-5 truncate max-w-[180px]">{log.description}</span>
                      </div>
                    </td>

                    {/* Module */}
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center px-[9.8px] py-[1.8px] rounded-[6px] text-[12px] font-semibold leading-4 whitespace-nowrap"
                        style={{ background: m.bg, color: m.text }}
                      >
                        {log.module}
                      </span>
                    </td>

                    {/* Affected Item */}
                    <td className="px-5 py-4">
                      <span className="text-[14px] text-[#334155] leading-5 truncate block max-w-[150px]">{log.affectedItem}</span>
                    </td>

                    {/* Date & Time */}
                    <td className="px-5 py-4">
                      <span className="text-[12px] text-[#64748B] leading-4 whitespace-nowrap">{log.date}</span>
                    </td>

                    {/* View */}
                    <td className="px-5 py-4">
                      <motion.button
                        className="text-[#94A3B8] hover:text-[#475569] transition-colors cursor-pointer"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedLog(log)}
                      >
                        <View size={16} />
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          )}
        </motion.div>

      </main>

      <ActivityDetailModal
        log={selectedLog}
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
