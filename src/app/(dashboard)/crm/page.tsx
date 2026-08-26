"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "@carbon/icons-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PipelineBoard from "@/components/crm/PipelineBoard";
import LeadDetailModal from "@/components/crm/LeadDetailModal";
import Loader from "@/components/shared/Loader";
import ErrorState from "@/components/shared/ErrorState";
import { supabase } from "@/lib/supabase";
import { logActivity } from "@/lib/logActivity";

interface Lead {
  id: string;
  rfq_id: string | null;
  client: string;
  rfq_code: string | null;
  service: string | null;
  budget: string | null;
  timeline: string | null;
  email: string | null;
  phone: string | null;
  stage: string;
  assigned_to: string | null;
  created_at: string;
}

interface PipelineCard {
  id: string;
  client: string;
  initial: string;
  rfqCode: string;
  service: string;
  budget: string;
  timeline: string;
  date: string;
}

const stageIds = ["new-lead", "in-review", "proposal-sent", "won", "lost"];

function toCard(lead: Lead): PipelineCard {
  return {
    id: lead.id,
    client: lead.client,
    initial: lead.client.charAt(0).toUpperCase(),
    rfqCode: lead.rfq_code || "—",
    service: lead.service || "—",
    budget: lead.budget || "—",
    timeline: lead.timeline || "—",
    date: new Date(lead.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  };
}

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const loadLeads = () => {
    setLoading(true);
    setError(null);
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError || !data) {
          setError("Couldn't load the pipeline. Please try again.");
          setLoading(false);
          return;
        }
        setLeads(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const moveLead = async (leadId: string, toStage: string) => {
    const lead = leads.find((l) => l.id === leadId);
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, stage: toStage } : l)));
    await supabase.from("leads").update({ stage: toStage }).eq("id", leadId);
    if (lead) {
      logActivity({ action: "updated", module: "CRM", affectedItem: lead.client, description: `Moved ${lead.client} to ${toStage.replace("-", " ")}` });
    }
  };

  const cardsByColumn: Record<string, PipelineCard[]> = {};
  for (const stage of stageIds) {
    cardsByColumn[stage] = leads.filter((l) => l.stage === stage).map(toCard);
  }

  const total = leads.length;
  const won = leads.filter((l) => l.stage === "won").length;
  const inPipeline = leads.filter((l) => ["new-lead", "in-review", "proposal-sent"].includes(l.stage)).length;
  const conversion = total > 0 ? Math.round((won / total) * 100) : 0;

  const crmStats = [
    { value: String(total), label: "Total Leads", bg: "bg-[#2D2555]/[0.07]", color: "text-[#2D2555]" },
    { value: String(won), label: "Won", bg: "bg-[#068653]/[0.07]", color: "text-[#068653]" },
    { value: `${conversion}%`, label: "Conversion", bg: "bg-[#A855F7]/10", color: "text-[#A855F7]" },
    { value: String(inPipeline), label: "In Pipeline", bg: "bg-[#F59E0B]/10", color: "text-[#F59E0B]" },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DashboardHeader title="CRM Pipeline" subtitle="Drag cards between stages to update status" />
      <main className="px-6 py-6 flex-1 flex flex-col gap-6 min-h-0 overflow-hidden">
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

        <div className="flex-1 min-h-0 overflow-auto">
          {loading ? (
            <Loader />
          ) : error ? (
            <ErrorState message={error} onRetry={loadLeads} />
          ) : (
            <PipelineBoard
              cardsByColumn={cardsByColumn}
              searchQuery={searchQuery}
              onCardClick={(card) => {
                const lead = leads.find((l) => l.id === card.id);
                if (lead) setSelectedLead(lead);
              }}
              onCardMove={(cardId, _fromCol, toCol) => moveLead(cardId, toCol)}
            />
          )}
        </div>
      </main>

      <LeadDetailModal
        lead={
          selectedLead
            ? {
                id: selectedLead.id,
                client: selectedLead.client,
                rfqCode: selectedLead.rfq_code || "—",
                email: selectedLead.email || undefined,
                phone: selectedLead.phone || undefined,
                service: selectedLead.service || "—",
                budget: selectedLead.budget || "—",
                timeline: selectedLead.timeline || "—",
                assigned: selectedLead.assigned_to || undefined,
              }
            : null
        }
        currentStage={selectedLead?.stage || ""}
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        onMoveToStage={(leadId, stage) => {
          moveLead(leadId, stage);
          setSelectedLead((prev) => (prev ? { ...prev, stage } : prev));
        }}
      />
    </div>
  );
}
