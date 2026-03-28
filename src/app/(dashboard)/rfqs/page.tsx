"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, View } from "@carbon/icons-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Pagination from "@/components/shared/Pagination";
import RFQDetailModal from "@/components/shared/RFQDetailModal";

const statusOptions = ["All Status", "New Submission", "Under Review", "Strategy Call Scheduled", "Proposal Sent", "Negotiation", "Accepted", "Rejected", "Closed"];

const statusStyles: Record<string, { bg: string; text: string }> = {
  "New": { bg: "bg-[#DCFCE7]", text: "text-[#068653]" },
  "Reviewing": { bg: "bg-[#FEF9C3]", text: "text-[#FD6513]" },
  "Proposal Sent": { bg: "bg-[#F3E8FF]", text: "text-[#7E22CE]" },
  "Accepted": { bg: "bg-[#DCFCE7]", text: "text-[#068653]" },
  "Rejected": { bg: "bg-[#FEE2E2]", text: "text-[#B91C1C]" },
  "Closed": { bg: "bg-[#FEE2E2]", text: "text-[#E7000B]" },
  "New Submission": { bg: "bg-[#DCFCE7]", text: "text-[#068653]" },
  "Under Review": { bg: "bg-[#FEF9C3]", text: "text-[#FD6513]" },
  "Strategy Call Scheduled": { bg: "bg-[#DBEAFE]", text: "text-[#2563EB]" },
  "Negotiation": { bg: "bg-[#FFF7ED]", text: "text-[#C2410C]" },
};

const rfqs = [
  { code: "RFQ-J0K1L2", client: "EduLearn Corp", email: "david@edulearn.com", phone: "+234 801 234 5678", service: "Mobile App", status: "New", date: "Feb 25, 2026", budget: "$5k - $15k", timeline: "1-3 months", description: "We need a mobile learning platform for K-12 students with offline capabilities, progress tracking, and parent dashboards." },
  { code: "RFQ-J0K1L2", client: "EduLearn Corp", email: "david@edulearn.com", phone: "+234 801 234 5678", service: "Mobile App", status: "Reviewing", date: "Feb 25, 2026", budget: "$15k - $50k", timeline: "3-6 months", description: "Extension of existing platform to include AI-powered tutoring and assessment modules." },
  { code: "RFQ-D4E5F6", client: "MedTech Labs", email: "james@medtechlabs.com", phone: "+234 902 345 6789", service: "Web Development", status: "Proposal Sent", date: "Feb 25, 2026", budget: "$15k - $50k", timeline: "3-6 months", description: "We need to migrate our entire on-premise infrastructure including databases, ERP and CRM systems to AWS cloud. Looking for a managed migration service with 99.9% uptime guarantee." },
  { code: "RFQ-A1B2C3", client: "FinanceCore Inc.", email: "sarah@financecore.com", phone: "+234 703 456 7890", service: "Cloud Solutions", status: "Rejected", date: "Feb 25, 2026", budget: "$50k - $100k", timeline: "6-12 months", description: "Cloud migration project for financial systems requiring PCI-DSS compliance." },
  { code: "RFQ-G7H8I9", client: "RetailPulse", email: "amina@retailpulse.com", phone: "+234 805 567 8901", service: "Data Analytics", status: "Accepted", date: "Feb 25, 2026", budget: "$5k - $15k", timeline: "1-3 months", description: "Real-time sales analytics dashboard with inventory forecasting and customer behavior insights." },
  { code: "RFQ-G7H8I9", client: "RetailPulse", email: "amina@retailpulse.com", phone: "+234 805 567 8901", service: "Data Analytics", status: "Closed", date: "Feb 25, 2026", budget: "$5k - $15k", timeline: "1-3 months", description: "Phase 2 of analytics platform — supplier performance tracking module." },
];

const columns = ["Code", "Client", "Service", "Status", "Date", "Actions"];

export default function RFQsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [statusOpen, setStatusOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRFQ, setSelectedRFQ] = useState<typeof rfqs[0] | null>(null);

  const filtered = rfqs.filter((r) => {
    const matchesSearch = r.client.toLowerCase().includes(searchQuery.toLowerCase()) || r.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All Status" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DashboardHeader title="RFQ Management" subtitle={`${rfqs.length} total requests`} />
      <main className="px-6 py-6 flex-1 flex flex-col gap-6 min-h-0 overflow-hidden">
        {/* Search + Filter */}
        <motion.div
          className="flex items-start gap-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[44px] pl-10 pr-4 bg-white rounded-md text-[14px] text-[#0A0A0A] placeholder:text-[#737373] outline-none focus:ring-1 focus:ring-[#2D2555]/20 transition-all"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className="flex items-center justify-between w-[192px] h-[44px] px-3 bg-white rounded-md text-[14px] text-[#0A0A0A] hover:bg-gray-50 transition-colors"
            >
              <span>{statusFilter}</span>
              <ChevronDown size={16} className={`text-[#0A0A0A]/50 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
            </button>
            {statusOpen && (
              <motion.div
                className="absolute top-[50px] right-0 w-[180px] bg-white p-1 flex flex-col gap-3 z-20"
                style={{ boxShadow: "0px 0px 1px rgba(24, 24, 27, 0.3), 0px 4px 8px rgba(24, 24, 27, 0.1)", borderRadius: "4px" }}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {statusOptions.map((s) => {
                  const isSelected = statusFilter === s;
                  return (
                    <button
                      key={s}
                      onClick={() => { setStatusFilter(s); setStatusOpen(false); }}
                      className={`w-full flex items-center justify-between px-1 h-[28px] rounded-[2px] text-[14px] transition-colors ${isSelected ? "bg-[#F4F4F5] font-medium" : "hover:bg-[#F4F4F5] font-normal"} text-black`}
                    >
                      <span>{s}</span>
                      {isSelected && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="#27272A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          className="bg-white rounded-2xl overflow-hidden flex-1 min-h-0 flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="overflow-auto flex-1 min-h-0">
            <table className="w-full">
              {/* Header */}
              <thead>
                <tr className="bg-[#2D2555]/[0.07]">
                  {columns.map((col) => (
                    <th key={col} className="text-left px-6 py-3 text-[12px] font-semibold uppercase text-[#64748B]">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {filtered.map((rfq, i) => (
                  <motion.tr
                    key={`${rfq.code}-${i}`}
                    className="border-t border-[#F8FAFC] hover:bg-[#F9FAFB] transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * i }}
                  >
                    {/* Code */}
                    <td className="px-6 py-6 text-[14px] text-[#475569]">{rfq.code}</td>

                    {/* Client */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-[#0F172A]">{rfq.client}</span>
                        <span className="text-[12px] text-[#64748B]">{rfq.email}</span>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="px-6 py-6 text-[14px] capitalize text-[#475569]">{rfq.service}</td>

                    {/* Status */}
                    <td className="px-6 py-[18px]">
                      <div className="flex items-center justify-between w-[144px] h-[32px] px-3 border border-[#E5E5E5] rounded-md shadow-sm">
                        <span className={`text-[12px] font-semibold px-[10px] py-[2px] rounded-md ${statusStyles[rfq.status]?.bg} ${statusStyles[rfq.status]?.text}`}>
                          {rfq.status}
                        </span>
                        <ChevronDown size={16} className="text-[#0A0A0A]/50" />
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-6 text-[14px] text-[#64748B]">{rfq.date}</td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <motion.button
                        className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#F5F8FA] transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedRFQ(rfq)}
                      >
                        <View size={16} className="text-[#94A3B8]" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filtered.length / 10)}
          totalItems={filtered.length}
          selectedCount={1}
          onPageChange={setCurrentPage}
        />
      </main>

      <RFQDetailModal
        rfq={selectedRFQ}
        open={!!selectedRFQ}
        onClose={() => setSelectedRFQ(null)}
      />
    </div>
  );
}
