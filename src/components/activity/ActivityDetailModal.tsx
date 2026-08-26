"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Close,
  User,
  UserMultiple,
  Activity,
  Apps,
  Laptop,
  Document,
  Time,
} from "@carbon/icons-react";

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
  RFQ:                { bg: "#FEF3C7",             text: "#F54900" },
  Blog:               { bg: "#F3E8FF",             text: "#7E22CE" },
  Portfolio:          { bg: "#DCFCE7",             text: "#068653" },
  CRM:                { bg: "#DBEAFE",             text: "#1D4ED8" },
  Analytics:          { bg: "rgba(45,37,85,0.07)", text: "#2D2555" },
  Messages:           { bg: "#FFF0E8",             text: "#FD6513" },
  Services:           { bg: "#DBEAFE",             text: "#1D4ED8" },
  "Admin Management": { bg: "#FEE2E2",             text: "#E7000B" },
};

export interface LogEntry {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: string;
  action: string;
  description: string;
  module: string;
  affectedItem: string;
  date: string;
  device: string;
  additionalDetails: string;
}

interface ActivityDetailModalProps {
  log: LogEntry | null;
  open: boolean;
  onClose: () => void;
}

type IconComponent = React.ComponentType<{ size?: number; style?: React.CSSProperties }>;

function FieldLabel({ icon: Icon, label }: { icon: IconComponent; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} style={{ color: "#A9A9A9", flexShrink: 0 }} />
      <span
        className="text-[12px] font-semibold uppercase leading-4"
        style={{ fontFamily: "Open Sans, sans-serif", letterSpacing: "0.3px", color: "#A9A9A9" }}
      >
        {label}
      </span>
    </div>
  );
}

export default function ActivityDetailModal({ log, open, onClose }: ActivityDetailModalProps) {
  if (!log) return null;

  const a = actionStyle[log.action] ?? { bg: "#F1F5F9", text: "#475569" };
  const m = moduleStyle[log.module]  ?? { bg: "#F1F5F9", text: "#475569" };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Dialog wrapper with scroll */}
          <motion.div
            className="fixed inset-0 z-[70] overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                className="relative flex flex-col bg-white rounded-[8px] w-[512px] my-4"
                style={{ boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.25)" }}
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div
                  className="flex flex-row justify-between items-start rounded-t-[8px]"
                  style={{ background: "#2D2555", padding: "20px 24px" }}
                >
                  <div className="flex flex-col gap-1">
                    <span
                      className="text-[12px] font-bold uppercase leading-4"
                      style={{ fontFamily: "Open Sans, sans-serif", letterSpacing: "1.2px", color: "#DAD5F3" }}
                    >
                      Activity Detail
                    </span>
                    <span
                      className="text-[18px] font-semibold leading-[25px] text-white"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      {log.description}
                    </span>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-1 flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Close size={20} style={{ color: "white" }} />
                  </button>
                </div>

                {/* Body */}
                <div className="flex flex-col gap-4 p-6">

                  {/* Detail grid */}
                  <div className="flex flex-col gap-4">

                    {/* Row 1: Admin | Role */}
                    <div className="flex justify-between gap-4">
                      <div className="flex flex-col gap-1 w-[224px]">
                        <FieldLabel icon={User} label="Admin" />
                        <span
                          className="text-[14px] font-semibold leading-5 pl-5"
                          style={{ fontFamily: "'Segoe UI', sans-serif", color: "#1E293B" }}
                        >
                          {log.name}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 w-[224px]">
                        <FieldLabel icon={UserMultiple} label="Role" />
                        <span
                          className="text-[14px] font-semibold leading-5 pl-5"
                          style={{ fontFamily: "'Segoe UI', sans-serif", color: "#1E293B" }}
                        >
                          {log.role}
                        </span>
                      </div>
                    </div>

                    {/* Row 2: Action Type | Module */}
                    <div className="flex justify-between gap-4">
                      <div className="flex flex-col gap-1 w-[224px]">
                        <FieldLabel icon={Activity} label="Action Type" />
                        <div className="pl-5">
                          <span
                            className="inline-flex items-center px-[9.8px] py-[1.8px] rounded-[6px] text-[12px] font-semibold leading-4 capitalize"
                            style={{ background: a.bg, color: a.text, fontFamily: "Open Sans, sans-serif" }}
                          >
                            {log.action}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 w-[224px]">
                        <FieldLabel icon={Apps} label="Module" />
                        <div className="pl-5">
                          <span
                            className="inline-flex items-center px-[9.8px] py-[1.8px] rounded-[6px] text-[12px] font-semibold leading-4"
                            style={{ background: m.bg, color: m.text, fontFamily: "'Segoe UI', sans-serif" }}
                          >
                            {log.module}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Device */}
                    <div className="flex flex-col gap-1">
                      <FieldLabel icon={Laptop} label="Device" />
                      <span
                        className="text-[14px] font-semibold leading-5 pl-5"
                        style={{ fontFamily: "'Segoe UI', sans-serif", color: "#1E293B" }}
                      >
                        {log.device || "—"}
                      </span>
                    </div>

                    {/* Row 4: Affected Item (full width) */}
                    <div className="flex flex-col gap-1">
                      <FieldLabel icon={Document} label="Affected Item" />
                      <span
                        className="text-[14px] font-semibold leading-5 pl-5"
                        style={{ fontFamily: "'Segoe UI', sans-serif", color: "#1E293B" }}
                      >
                        {log.affectedItem}
                      </span>
                    </div>

                    {/* Row 5: Date & Time (full width) */}
                    <div className="flex flex-col gap-1">
                      <FieldLabel icon={Time} label="Date & Time" />
                      <span
                        className="text-[14px] font-semibold leading-5 pl-5"
                        style={{ fontFamily: "'Segoe UI', sans-serif", color: "#1E293B" }}
                      >
                        {log.date}
                      </span>
                    </div>

                  </div>

                  {/* Additional Details box */}
                  <div
                    className="flex flex-col rounded-[12px]"
                    style={{
                      background: "#F8FAFC",
                      border: "1px solid #F1F5F9",
                      padding: "15.8px",
                      gap: "3.17px",
                    }}
                  >
                    <span
                      className="text-[12px] font-semibold uppercase leading-4"
                      style={{ fontFamily: "Open Sans, sans-serif", letterSpacing: "0.3px", color: "#A9A9A9" }}
                    >
                      Additional Details
                    </span>
                    <p
                      className="text-[14px] text-[#334155]"
                      style={{ fontFamily: "'Segoe UI', sans-serif", lineHeight: "23px" }}
                    >
                      {log.additionalDetails}
                    </p>
                  </div>

                  {/* Close button */}
                  <motion.button
                    className="w-full h-10 flex items-center justify-center rounded-[8px] border text-[14px] font-semibold text-[#737373] cursor-pointer bg-white"
                    style={{ borderColor: "#E7E7E7", fontFamily: "'Segoe UI', sans-serif" }}
                    whileHover={{ backgroundColor: "#F8FAFC" }}
                    whileTap={{ scale: 0.99 }}
                    onClick={onClose}
                  >
                    Close
                  </motion.button>

                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
