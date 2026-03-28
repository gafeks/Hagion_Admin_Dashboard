"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Close, DocumentAttachment } from "@carbon/icons-react";

interface LeadDetail {
  id: string;
  client: string;
  rfqCode: string;
  email?: string;
  phone?: string;
  service: string;
  budget: string;
  timeline: string;
  assigned?: string;
  description?: string;
}

interface LeadDetailModalProps {
  lead: LeadDetail | null;
  currentStage: string;
  open: boolean;
  onClose: () => void;
  onMoveToStage?: (leadId: string, stage: string) => void;
}

const stages = [
  { id: "new-lead", label: "New", bg: "bg-[#2D2555]/[0.08]", border: "border-[#2D2555]/60", text: "text-[#2D2555]", activeBg: "bg-[#2D2555]", activeText: "text-white" },
  { id: "in-review", label: "In Review", bg: "bg-[#F59E0B]/[0.08]", border: "border-[#F59E0B]/25", text: "text-[#F59E0B]", activeBg: "bg-[#F59E0B]", activeText: "text-white" },
  { id: "proposal-sent", label: "Proposal Sent", bg: "bg-[#A855F7]/[0.08]", border: "border-[#A855F7]/25", text: "text-[#A855F7]", activeBg: "bg-[#A855F7]", activeText: "text-white" },
  { id: "won", label: "Won", bg: "bg-[#068653]/10", border: "border-[#068653]/20", text: "text-[#068653]", activeBg: "bg-[#068653]", activeText: "text-white" },
  { id: "lost", label: "Lost", bg: "bg-[#EF4444]/[0.08]", border: "border-[#EF4444]/25", text: "text-[#EF4444]", activeBg: "bg-[#EF4444]", activeText: "text-white" },
];

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[12px] font-normal leading-[15px] tracking-[0.25px] capitalize text-[#A9A9A9]">{label}</span>
      <span className="text-[12.5px] font-semibold leading-[20px] text-[#0F172A] capitalize">{value}</span>
    </div>
  );
}

export default function LeadDetailModal({ lead, currentStage, open, onClose, onMoveToStage }: LeadDetailModalProps) {
  const [note, setNote] = useState("");

  return (
    <AnimatePresence>
      {open && lead && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-[512px] bg-white border border-[#E5E5E5] rounded-lg p-[24px] flex flex-col gap-4"
              style={{ boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)" }}
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button onClick={onClose} className="absolute top-[17px] right-[17px] opacity-70 hover:opacity-100 transition-opacity">
                <Close size={16} className="text-[#0A0A0A]" />
              </button>

              {/* Title */}
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-semibold leading-[18px] tracking-[-0.45px] text-[#0A0A0A]">{lead.client}</span>
                <span className="text-[12px] font-medium leading-[15px] tracking-[0.25px] capitalize text-[#A9A9A9]">· {lead.rfqCode}</span>
              </div>

              {/* Details Grid */}
              <div className="pt-2 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                  <DetailField label="Email" value={lead.email || "—"} />
                  <DetailField label="Phone" value={lead.phone || "—"} />
                  <DetailField label="Service" value={lead.service} />
                  <DetailField label="Budget" value={lead.budget} />
                  <DetailField label="Timeline" value={lead.timeline} />
                  <DetailField label="Assigned" value={lead.assigned || "admin@hagion.com"} />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1 bg-[#F8FAFC] rounded-xl p-3">
                  <span className="text-[12px] font-normal leading-[15px] tracking-[0.25px] capitalize text-[#A9A9A9]">Description</span>
                  <p className="text-[12px] font-normal leading-[18px] text-[#334155]">
                    {lead.description || "No description provided."}
                  </p>
                </div>

                {/* Move to Stage */}
                <div className="flex flex-col gap-2">
                  <span className="text-[12px] font-normal leading-[15px] tracking-[0.25px] capitalize text-[#A9A9A9]">Move to Stage</span>
                  <div className="flex flex-wrap gap-2">
                    {stages.map((stage) => {
                      const isActive = stage.id === currentStage;
                      return (
                        <motion.button
                          key={stage.id}
                          onClick={() => onMoveToStage?.(lead.id, stage.id)}
                          className={`px-3 py-[6px] rounded-lg text-[12px] font-medium leading-[16px] border transition-colors ${
                            isActive
                              ? `${stage.activeBg} border-transparent ${stage.activeText} font-semibold`
                              : `${stage.bg} ${stage.border} ${stage.text}`
                          }`}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {stage.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Internal Notes */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <DocumentAttachment size={12} className="text-[#94A3B8]" />
                    <span className="text-[12px] font-normal leading-[15px] tracking-[0.25px] capitalize text-[#A9A9A9]">Internal Notes</span>
                  </div>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add an internal note..."
                    className="w-full h-[80px] px-3 py-2 bg-transparent border border-[#E5E5E5] rounded-md text-[13px] text-[#0A0A0A] placeholder:text-[#737373] outline-none resize-none focus:border-[#2D2555]/30 transition-colors"
                    style={{ boxShadow: "0px 1px 2px rgba(0,0,0,0.05)" }}
                  />
                  <motion.button
                    className="self-start px-3 h-8 bg-[#2D2555] text-white text-[12px] font-semibold rounded-md hover:bg-[#231d45] transition-colors"
                    style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { console.log("Note:", note); setNote(""); }}
                  >
                    Add Note
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
