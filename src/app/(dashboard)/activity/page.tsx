"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Download, Restart, Search, Filter, View } from "@carbon/icons-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ActivityDetailModal, { LogEntry } from "@/components/activity/ActivityDetailModal";

const logs: LogEntry[] = [
  { id: 1,  initials: "G", name: "Gift Akemor",    email: "giftakem@hagion.com",  role: "Super Admin",   action: "approved",  description: "Approved RFQ from Nexus Corp",                module: "RFQ",              affectedItem: "RFQ-2025-0042",             date: "Jan 15, 2025 · 2:15 PM",  ipAddress: "192.168.1.101", device: "Web · Windows 11", additionalDetails: "Approved and forwarded RFQ to the project team for proposal preparation." },
  { id: 2,  initials: "D", name: "David Tari",     email: "david@hagion.com",     role: "Blog Admin",    action: "published", description: "Published blog post: 'Digital Transf...'",    module: "Blog",             affectedItem: "Digital Transformation...",  date: "Jan 15, 2025 · 1:00 PM",  ipAddress: "192.168.1.45",  device: "Web · macOS",      additionalDetails: "Published blog post on digital transformation strategies for enterprise clients." },
  { id: 3,  initials: "P", name: "Priya Sharma",   email: "priya@hagion.com",     role: "Content Admin", action: "deleted",   description: "Deleted portfolio item: 'FinTech App...'",    module: "Portfolio",        affectedItem: "FinTech App Redesign",       date: "Jan 15, 2025 · 12:30 PM", ipAddress: "192.168.1.78",  device: "Web · Windows 10", additionalDetails: "Removed outdated FinTech App Redesign portfolio item as it no longer reflects current work." },
  { id: 4,  initials: "J", name: "James Okonkwo",  email: "james@hagion.com",     role: "Service Admin", action: "edited",    description: "Edited service page: 'Cloud Infrastructure'", module: "Services",         affectedItem: "Cloud Infrastructure",       date: "Jan 15, 2025 · 11:45 AM", ipAddress: "192.168.1.23",  device: "Web · macOS",      additionalDetails: "Updated cloud infrastructure service page with revised pricing tiers and feature list." },
  { id: 5,  initials: "S", name: "Sarah Mitchell", email: "sarah@hagion.com",     role: "Super Admin",   action: "created",   description: "Created new blog post: 'Top 5 Business...'",  module: "Blog",             affectedItem: "Top 5 Business Trends...",   date: "Jan 15, 2025 · 10:24 AM", ipAddress: "192.168.1.102", device: "Web · Windows 11", additionalDetails: "Created new blog post draft on top 5 business technology trends for 2025." },
  { id: 6,  initials: "S", name: "Sarah Mitchell", email: "sarah@hagion.com",     role: "Super Admin",   action: "created",   description: "Invited new admin: analytic...",               module: "Admin Management", affectedItem: "analytics@hagion.com",       date: "Jan 15, 2025 · 9:50 AM",  ipAddress: "192.168.1.102", device: "Web · Windows 11", additionalDetails: "Invited analytics@hagion.com to join the platform with Content Admin permissions." },
  { id: 7,  initials: "D", name: "David Tari",     email: "david@hagion.com",     role: "Blog Admin",    action: "rejected",  description: "Rejected RFQ from Delta Logistics",            module: "RFQ",              affectedItem: "RFQ-2025-0039",              date: "Jan 14, 2025 · 3:10 PM",  ipAddress: "192.168.1.45",  device: "Web · macOS",      additionalDetails: "Rejected RFQ from Delta Logistics due to incomplete project specification and budget mismatch." },
  { id: 8,  initials: "P", name: "Priya Sharma",   email: "priya@hagion.com",     role: "Content Admin", action: "updated",   description: "Updated portfolio: 'E-Commerce Platform'",     module: "Portfolio",        affectedItem: "E-Commerce Platform",        date: "Jan 14, 2025 · 1:30 PM",  ipAddress: "192.168.1.78",  device: "Web · Windows 10", additionalDetails: "Updated E-Commerce Platform portfolio entry with new screenshots and project outcome metrics." },
  { id: 9,  initials: "J", name: "James Okonkwo",  email: "james@hagion.com",     role: "Service Admin", action: "approved",  description: "Approved RFQ from BrightPath Ltd",             module: "RFQ",              affectedItem: "RFQ-2025-0038",              date: "Jan 14, 2025 · 11:00 AM", ipAddress: "192.168.1.23",  device: "Web · macOS",      additionalDetails: "Approved RFQ from BrightPath Ltd and escalated to the solutions team for scoping." },
  { id: 10, initials: "G", name: "Gift Akemor",    email: "giftakem@hagion.com",  role: "Super Admin",   action: "created",   description: "Added new team member: Priya Sharma",          module: "Admin Management", affectedItem: "priya@hagion.com",           date: "Jan 14, 2025 · 9:15 AM",  ipAddress: "192.168.1.101", device: "Web · Windows 11", additionalDetails: "Added Priya Sharma as Content Admin with access to portfolio and blog modules." },
];

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

const allRoles   = ["All Roles",   "Super Admin", "Blog Admin", "Content Admin", "Service Admin"];
const allModules = ["All Modules", "RFQ", "Blog", "Portfolio", "CRM", "Analytics", "Messages", "Services", "Admin Management"];

export default function ActivityPage() {
  const [search,      setSearch]      = useState("");
  const [roleFilter,  setRoleFilter]  = useState("All Roles");
  const [modFilter,   setModFilter]   = useState("All Modules");
  const [fromDate,    setFromDate]    = useState("");
  const [toDate,      setToDate]      = useState("");
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = !q || l.name.toLowerCase().includes(q) || l.action.toLowerCase().includes(q) || l.affectedItem.toLowerCase().includes(q) || l.description.toLowerCase().includes(q);
    const matchRole   = roleFilter === "All Roles"   || l.role   === roleFilter;
    const matchMod    = modFilter  === "All Modules" || l.module  === modFilter;
    return matchSearch && matchRole && matchMod;
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
            >
              <Restart size={16} />
              <span>Refresh</span>
            </motion.button>
            <motion.button
              className="flex items-center gap-2 px-4 h-9 bg-[#2D2555] rounded-[8px] text-[14px] text-white cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
