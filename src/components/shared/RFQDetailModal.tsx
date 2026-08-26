"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Close, DocumentDownload, ChartLineSmooth } from "@carbon/icons-react";
import { supabase } from "@/lib/supabase";
import { logActivity } from "@/lib/logActivity";

interface RFQDetail {
  id: string;
  code: string;
  client: string;
  email: string;
  phone?: string;
  service: string;
  budget?: string;
  timeline?: string;
  description?: string;
  filePath?: string | null;
}

interface RFQDetailModalProps {
  rfq: RFQDetail | null;
  open: boolean;
  onClose: () => void;
  onAddedToPipeline?: (rfqId: string) => void;
}

function DetailField({ label, value, capitalize = true }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="text-[13px] font-normal leading-[17px] text-[#64748B]">{label}</span>
      <span className={`text-[15px] font-semibold leading-[22px] text-[#0A0A0A] ${capitalize ? "capitalize" : ""}`}>{value}</span>
    </div>
  );
}

export default function RFQDetailModal({ rfq, open, onClose, onAddedToPipeline }: RFQDetailModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [inPipeline, setInPipeline] = useState(false);
  const [addingToPipeline, setAddingToPipeline] = useState(false);

  useEffect(() => {
    if (!rfq) return;
    setInPipeline(false);
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("rfq_id", rfq.id)
      .then(({ count }) => setInPipeline(!!count && count > 0));
  }, [rfq?.id]);

  const handleDownload = async () => {
    if (!rfq?.filePath) return;
    setDownloading(true);
    const { data } = await supabase.storage.from("rfq-attachments").createSignedUrl(rfq.filePath, 60);
    setDownloading(false);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  const handleAddToPipeline = async () => {
    if (!rfq) return;
    setAddingToPipeline(true);
    const { error } = await supabase.from("leads").insert({
      rfq_id: rfq.id,
      client: rfq.client,
      rfq_code: rfq.code,
      service: rfq.service,
      budget: rfq.budget,
      timeline: rfq.timeline,
      email: rfq.email,
      phone: rfq.phone,
      stage: "new-lead",
    });
    if (!error) {
      setInPipeline(true);
      onAddedToPipeline?.(rfq.id);
      logActivity({ action: "created", module: "CRM", affectedItem: rfq.client, description: `Added ${rfq.client} to the CRM pipeline` });
    }
    setAddingToPipeline(false);
  };

  return (
    <AnimatePresence>
      {open && rfq && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-[558px] bg-white border border-[#E5E5E5] rounded-[9px] p-[26px] flex flex-col gap-[17px]"
              style={{ boxShadow: "0px 11px 16px -3px rgba(0,0,0,0.1), 0px 4px 7px -4px rgba(0,0,0,0.1)" }}
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-[18px] right-[18px] opacity-70 hover:opacity-100 transition-opacity"
              >
                <Close size={17} className="text-[#0A0A0A]" />
              </button>

              {/* Title */}
              <h2 className="text-[20px] font-semibold leading-[20px] tracking-[-0.49px] text-[#0A0A0A]">
                RFQ Details — {rfq.code}
              </h2>

              {/* Details Grid */}
              <div className="pt-[17px] flex flex-col gap-[17px]">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-x-[17px] gap-y-[17px]">
                  <DetailField label="Client" value={rfq.client} />
                  <DetailField label="Email" value={rfq.email} capitalize={false} />
                  <DetailField label="Phone" value={rfq.phone || "—"} />
                  <DetailField label="Service" value={rfq.service} />
                  <DetailField label="Budget" value={rfq.budget || "—"} />
                  <DetailField label="Timeline" value={rfq.timeline || "—"} />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] font-normal leading-[17px] text-[#64748B]">Description</span>
                  <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-[13px] p-[17px]">
                    <p className="text-[15px] font-normal leading-[22px] text-[#334155]">
                      {rfq.description || "No description provided."}
                    </p>
                  </div>
                </div>

                {rfq.filePath && (
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex items-center gap-2 text-[14px] font-medium text-[#2D2555] hover:underline disabled:opacity-60"
                  >
                    <DocumentDownload size={18} />
                    {downloading ? "Preparing download..." : "Download attachment"}
                  </button>
                )}

                <button
                  onClick={handleAddToPipeline}
                  disabled={addingToPipeline || inPipeline}
                  className="flex items-center justify-center gap-2 h-10 bg-[#2D2555] text-white text-[14px] font-semibold rounded-lg hover:bg-[#231d45] transition-colors disabled:opacity-60"
                >
                  <ChartLineSmooth size={16} />
                  {inPipeline ? "Already in CRM Pipeline" : addingToPipeline ? "Adding..." : "Add to CRM Pipeline"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
