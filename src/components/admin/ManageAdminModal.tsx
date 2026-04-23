"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Close, CheckmarkOutline } from "@carbon/icons-react";

interface Member {
  name: string;
  initials: string;
  email: string;
  role: string;
}

interface ManageAdminModalProps {
  member: Member | null;
  open: boolean;
  onClose: () => void;
}

const roles = ["Super Admin", "Service Admin", "Content Admin", "Finance Admin"];

export default function ManageAdminModal({ member, open, onClose }: ManageAdminModalProps) {
  const [selectedRole, setSelectedRole] = useState(member?.role ?? "");

  useEffect(() => {
    if (member) setSelectedRole(member.role);
  }, [member]);

  return (
    <AnimatePresence>
      {open && member && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative flex flex-col bg-white border border-[#E5E5E5] rounded-[8px] w-[384px]"
              style={{
                padding: "23.6px 24.2px 24.2px",
                gap: "15.98px",
                boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)",
              }}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-[17.2px] right-[17.19px] opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Close size={16} style={{ color: "#0A0A0A" }} />
              </button>

              {/* Title */}
              <h2
                className="text-[18px] font-semibold text-[#0A0A0A] leading-[18px]"
                style={{ letterSpacing: "-0.45px" }}
              >
                Manage User — {member.name}
              </h2>

              {/* Content */}
              <div className="flex flex-col gap-[15.2px] pt-2">

                {/* User card */}
                <div className="flex items-center gap-3 bg-[#F8FAFC] rounded-[12px] p-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-[#2D2555] rounded-[12px] flex-shrink-0 text-[16px] font-bold text-white">
                    {member.initials}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#0F172A] leading-5">{member.name}</p>
                    <p className="text-[12px] text-[#64748B] leading-4">{member.email}</p>
                  </div>
                </div>

                {/* Change Role */}
                <div className="flex flex-col gap-2">
                  <p
                    className="text-[12px] font-semibold text-[#64748B] leading-4 uppercase"
                    style={{ letterSpacing: "0.3px" }}
                  >
                    Change Role
                  </p>
                  <div className="flex flex-col gap-2">
                    {roles.map((role) => {
                      const active = selectedRole === role;
                      return (
                        <motion.button
                          key={role}
                          onClick={() => setSelectedRole(role)}
                          className="flex items-center justify-between w-full px-4 h-[42.4px] rounded-[12px] border text-[14px] font-semibold cursor-pointer transition-colors"
                          style={
                            active
                              ? {
                                  background: "rgba(6,134,83,0.082)",
                                  borderColor: "#068653",
                                  color: "#068653",
                                }
                              : {
                                  background: "#FFFFFF",
                                  borderColor: "#E2E8F0",
                                  color: "#64748B",
                                }
                          }
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <span>{role}</span>
                          {active && <CheckmarkOutline size={16} style={{ color: "#068653" }} />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2 pt-[0.4px]">
                  <motion.button
                    className="flex items-center justify-center w-full h-[36.79px] bg-[#EF4444] rounded-[6px] text-[14px] font-semibold text-white cursor-pointer"
                    style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Suspend Account
                  </motion.button>
                  <motion.button
                    className="flex items-center justify-center w-full h-[36.79px] bg-white border border-[#EF4444] rounded-[6px] text-[14px] font-semibold text-[#EF4444] cursor-pointer"
                    whileHover={{ scale: 1.02, backgroundColor: "#FEF2F2" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Delete Account
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
