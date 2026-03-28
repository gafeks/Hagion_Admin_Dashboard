"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "@carbon/icons-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PipelineBoard from "@/components/crm/PipelineBoard";
import LeadDetailModal from "@/components/crm/LeadDetailModal";

const crmStats = [
  { value: "6", label: "Total Leads", bg: "bg-[#2D2555]/[0.07]", color: "text-[#2D2555]" },
  { value: "1", label: "Won", bg: "bg-[#068653]/[0.07]", color: "text-[#068653]" },
  { value: "17%", label: "Conversion", bg: "bg-[#A855F7]/10", color: "text-[#A855F7]" },
  { value: "4", label: "In Pipeline", bg: "bg-[#F59E0B]/10", color: "text-[#F59E0B]" },
];

export default function CRMPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<{ card: { id: string; client: string; rfqCode: string; service: string; budget: string; timeline: string }; colId: string } | null>(null);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DashboardHeader title="CRM Pipeline" subtitle="Drag cards between stages to update status" />
      <main className="px-6 py-6 flex-1 flex flex-col gap-6 min-h-0 overflow-hidden">
        {/* Stats + Search Row */}
        <motion.div
          className="flex items-center justify-between shrink-0"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-wrap gap-3">
            {crmStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex items-center gap-3 px-4 py-3 bg-white border border-[#F1F5F9] rounded-2xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
              >
                <div className={`w-8 h-8 flex items-center justify-center ${stat.bg} rounded-xl`}>
                  <span className={`text-[14px] font-black leading-[20px] ${stat.color}`}>{stat.value}</span>
                </div>
                <span className="text-[12px] font-semibold leading-[16px] text-[#475569]">{stat.label}</span>
              </motion.div>
            ))}
          </div>

          <div className="relative w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white border border-[#E5E5E5] rounded-md text-[14px] text-[#0A0A0A] placeholder:text-[#737373] outline-none focus:border-[#2D2555]/30 transition-colors"
            />
          </div>
        </motion.div>

        {/* Pipeline Board */}
        <div className="flex-1 min-h-0 overflow-auto">
          <PipelineBoard searchQuery={searchQuery} onCardClick={(card, colId) => setSelectedLead({ card, colId })} />
        </div>
      </main>

      <LeadDetailModal
        lead={selectedLead ? { ...selectedLead.card, email: `contact@${selectedLead.card.client.toLowerCase().replace(/\s+/g, "")}.com`, phone: "+234 803 789 0123", assigned: "admin@hagion.com", description: "AI-powered fleet management system with real-time route optimization, predictive maintenance alerts, and driver performance analytics." } : null}
        currentStage={selectedLead?.colId || ""}
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  );
}
