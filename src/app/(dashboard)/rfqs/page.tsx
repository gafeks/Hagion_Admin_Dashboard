"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, View } from "@carbon/icons-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Pagination from "@/components/shared/Pagination";
import RFQDetailModal from "@/components/shared/RFQDetailModal";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import Loader from "@/components/shared/Loader";
import { supabase } from "@/lib/supabase";

const statusOptions = ["All Status", "New Submission", "Under Review", "Strategy Call Scheduled", "Proposal Sent", "Negotiation", "Accepted", "Rejected", "Closed"];

const statusStyles: Record<string, { bg: string; text: string }> = {
  "New Submission": { bg: "bg-[#DCFCE7]", text: "text-[#068653]" },
  "Under Review": { bg: "bg-[#FEF9C3]", text: "text-[#FD6513]" },
  "Strategy Call Scheduled": { bg: "bg-[#DBEAFE]", text: "text-[#2563EB]" },
  "Proposal Sent": { bg: "bg-[#F3E8FF]", text: "text-[#7E22CE]" },
  "Negotiation": { bg: "bg-[#FFF7ED]", text: "text-[#C2410C]" },
  "Accepted": { bg: "bg-[#DCFCE7]", text: "text-[#068653]" },
  "Rejected": { bg: "bg-[#FEE2E2]", text: "text-[#B91C1C]" },
  "Closed": { bg: "bg-[#FEE2E2]", text: "text-[#E7000B]" },
};

interface RFQ {
  id: string;
  code: string;
  client: string;
  email: string;
  phone?: string;
  service: string;
  status: string;
  date: string;
  budget?: string;
  timeline?: string;
  description?: string;
  filePath?: string | null;
}

const columns = ["Code", "Client", "Service", "Status", "CRM", "Date", "Actions"];

export default function RFQsPage() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [statusOpen, setStatusOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [openStatusRowId, setOpenStatusRowId] = useState<string | null>(null);
  const [pipelineRfqIds, setPipelineRfqIds] = useState<Set<string>>(new Set());

  const loadRfqs = async () => {
    setLoading(true);
    setError(null);

    const [rfqRes, leadRes] = await Promise.all([
      supabase.from("rfqs").select("*").order("created_at", { ascending: false }),
      supabase.from("leads").select("rfq_id"),
    ]);

    if (rfqRes.error || !rfqRes.data) {
      setError("Couldn't load RFQs. Please try again.");
      setLoading(false);
      return;
    }

    setPipelineRfqIds(new Set((leadRes.data ?? []).map((l) => l.rfq_id).filter(Boolean)));
    setRfqs(
      rfqRes.data.map((row) => ({
        id: row.id,
        code: row.code,
        client: row.company_name || row.full_name,
        email: row.email,
        phone: row.phone,
        service: row.service,
        status: row.status,
        date: new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        budget: row.budget,
        timeline: row.timeline,
        description: row.description,
        filePath: row.file_path,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    loadRfqs();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setRfqs((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setOpenStatusRowId(null);
    await supabase.from("rfqs").update({ status }).eq("id", id);
  };

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
          {loading ? (
            <Loader />
          ) : error ? (
            <ErrorState message={error} onRetry={loadRfqs} />
          ) : filtered.length === 0 ? (
            <EmptyState title="No RFQs found" description="Try adjusting your search or status filter." />
          ) : (
          <div className="overflow-auto flex-1 min-h-0">
            <table className="w-full">
              {/* Header */}
              <thead>
                <tr className="bg-[#2D2555]/[0.07]">
                  {columns.map((col) => (
                    <th key={col} className="text-left px-4 py-2 text-[10px] font-semibold uppercase text-[#64748B]">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {filtered.map((rfq, i) => (
                  <motion.tr
                    key={rfq.id}
                    className="border-t border-[#F8FAFC] hover:bg-[#F9FAFB] transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * i }}
                  >
                    {/* Code */}
                    <td className="px-4 py-2.5 text-[12px] text-[#475569]">{rfq.code}</td>

                    {/* Client */}
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <span className="text-[12px] font-semibold text-[#0F172A]">{rfq.client}</span>
                        <span className="text-[10px] text-[#64748B]">{rfq.email}</span>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="px-4 py-2.5 text-[12px] capitalize text-[#475569]">{rfq.service}</td>

                    {/* Status */}
                    <td className="px-4 py-2 relative">
                      <button
                        onClick={() => setOpenStatusRowId(openStatusRowId === rfq.id ? null : rfq.id)}
                        className="flex items-center justify-between w-[128px] h-[24px] px-2 border border-[#E5E5E5] rounded-md shadow-sm"
                      >
                        <span className={`text-[10px] font-semibold px-[6px] py-[1px] rounded-md ${statusStyles[rfq.status]?.bg} ${statusStyles[rfq.status]?.text}`}>
                          {rfq.status}
                        </span>
                        <ChevronDown size={12} className="text-[#0A0A0A]/50" />
                      </button>
                      {openStatusRowId === rfq.id && (
                        <motion.div
                          className="absolute top-[46px] left-4 w-[190px] bg-white p-1 flex flex-col gap-1 z-20"
                          style={{ boxShadow: "0px 0px 1px rgba(24, 24, 27, 0.3), 0px 4px 8px rgba(24, 24, 27, 0.1)", borderRadius: "4px" }}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {statusOptions.slice(1).map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(rfq.id, s)}
                              className={`w-full text-left px-2 h-[24px] rounded-[2px] text-[11px] transition-colors ${rfq.status === s ? "bg-[#F4F4F5] font-medium" : "hover:bg-[#F4F4F5] font-normal"} text-black`}
                            >
                              {s}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </td>

                    {/* CRM */}
                    <td className="px-4 py-2">
                      {pipelineRfqIds.has(rfq.id) ? (
                        <span className="inline-flex items-center px-2 py-[2px] rounded-md text-[10px] font-semibold bg-[#DBEAFE] text-[#1D4ED8] whitespace-nowrap">
                          In Pipeline
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#CBD5E1]">—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-2.5 text-[12px] text-[#64748B]">{rfq.date}</td>

                    {/* Actions */}
                    <td className="px-4 py-2">
                      <motion.button
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#F5F8FA] transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedRFQ(rfq)}
                      >
                        <View size={14} className="text-[#94A3B8]" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </motion.div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(filtered.length / 10))}
          totalItems={filtered.length}
          selectedCount={1}
          onPageChange={setCurrentPage}
        />
      </main>

      <RFQDetailModal
        rfq={selectedRFQ}
        open={!!selectedRFQ}
        onClose={() => setSelectedRFQ(null)}
        onAddedToPipeline={(rfqId) => setPipelineRfqIds((prev) => new Set(prev).add(rfqId))}
      />
    </div>
  );
}
