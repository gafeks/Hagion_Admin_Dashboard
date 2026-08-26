"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Close } from "@carbon/icons-react";
import { supabase } from "@/lib/supabase";
import { logActivity } from "@/lib/logActivity";
import ErrorState from "@/components/shared/ErrorState";

interface AddAdminModalProps {
  open: boolean;
  onClose: () => void;
  onAdded?: () => void;
}

const roleOptions = ["Super Admin", "Admin", "Content Admin"];

export default function AddAdminModal({ open, onClose, onAdded }: AddAdminModalProps) {
  const [form, setForm] = useState({ name: "", email: "", role: "Admin" });
  const [step, setStep] = useState<"form" | "instructions">("form");
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleClose() {
    setForm({ name: "", email: "", role: "Admin" });
    setStep("form");
    setError(null);
    onClose();
  }

  async function handleConfirmCreated() {
    setApplying(true);
    setError(null);

    const update: Record<string, string> = { role: form.role };
    if (form.name.trim()) update.full_name = form.name.trim();

    const { data, error: updateError } = await supabase
      .from("admin_profiles")
      .update(update)
      .eq("email", form.email.trim())
      .select();

    if (updateError || !data || data.length === 0) {
      setError("No admin found with that email yet. Make sure you've created the login in Supabase first, then try again.");
      setApplying(false);
      return;
    }

    logActivity({ action: "created", module: "Admin Management", affectedItem: form.email, description: `Added new team member: ${form.name || form.email}` });
    onAdded?.();
    setApplying(false);
    handleClose();
  }

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
            onClick={handleClose}
          />

          {/* Dialog */}
          <motion.div
            className="fixed inset-0 z-[70] overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              className="relative bg-white rounded-[12px] w-[621px] my-4"
              style={{ padding: "24px 38.22px 38.22px" }}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-[38px] w-10 h-10 flex items-center justify-center rounded-full border border-[#737373] text-[#737373] hover:opacity-70 transition-opacity cursor-pointer"
              >
                <Close size={16} />
              </button>

              {step === "form" ? (
                <>
                  {/* Header */}
                  <div className="flex flex-col items-center gap-2 mb-[38px]">
                    <h2 className="text-[32px] font-bold text-[#1A1A1A] leading-[44px] text-center" style={{ fontFamily: "Open Sans, sans-serif" }}>
                      Add Team Member
                    </h2>
                    <p className="text-[14px] text-[#000000] leading-5 text-center" style={{ fontFamily: "Open Sans, sans-serif" }}>
                      You can easily add a team member and assign them to a role
                    </p>
                  </div>

                  {/* Form */}
                  <div className="flex flex-col gap-[25.48px]">
                    <div className="flex flex-col gap-4">

                      {/* Full Name */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[12px] text-[#212934] leading-4" style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter full name"
                          value={form.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          className="w-full h-12 px-4 text-[12px] text-[#1A1A1A] placeholder:text-[#D4D7E0] outline-none rounded-[4px]"
                          style={{
                            fontFamily: "Inter, sans-serif",
                            letterSpacing: "-0.02em",
                            border: "1px solid #D4D7E0",
                            boxShadow: "0px 1px 2px rgba(63,63,68,0.1)",
                          }}
                        />
                      </div>

                      {/* Email Address */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[12px] text-[#212934] leading-4" style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="Enter email address"
                          value={form.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          className="w-full h-12 px-4 text-[12px] text-[#1A1A1A] placeholder:text-[#D4D7E0] outline-none rounded-[4px]"
                          style={{
                            fontFamily: "Inter, sans-serif",
                            letterSpacing: "-0.02em",
                            border: "1px solid #D4D7E0",
                            boxShadow: "0px 1px 2px rgba(63,63,68,0.1)",
                          }}
                        />
                      </div>

                      {/* Role (dropdown) */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[12px] text-[#212934] leading-4" style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>
                          Role
                        </label>
                        <div className="relative">
                          <select
                            value={form.role}
                            onChange={(e) => handleChange("role", e.target.value)}
                            className="w-full h-14 px-4 text-[12px] outline-none rounded-[4px] appearance-none cursor-pointer"
                            style={{
                              fontFamily: "Inter, sans-serif",
                              letterSpacing: "-0.02em",
                              color: "#1A1A1A",
                              border: "1px solid #D4D7E0",
                              boxShadow: "0px 1px 2px rgba(63,63,68,0.1)",
                              background: "#FFFFFF",
                            }}
                          >
                            {roleOptions.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                          {/* Caret */}
                          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                              <path d="M1 1L5 5L9 1" stroke="#5F6B7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Submit */}
                    <motion.button
                      className="w-full h-14 bg-[#2D2555] rounded-[6px] text-white font-medium capitalize disabled:opacity-60"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "19.1px",
                        letterSpacing: "-0.02em",
                      }}
                      whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(45,37,85,0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!form.email.trim()}
                      onClick={() => setStep("instructions")}
                    >
                      Continue
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col items-center gap-2 mb-2">
                    <h2 className="text-[24px] font-bold text-[#1A1A1A] leading-[32px] text-center" style={{ fontFamily: "Open Sans, sans-serif" }}>
                      One manual step
                    </h2>
                    <p className="text-[14px] text-[#5F6B7A] leading-5 text-center" style={{ fontFamily: "Open Sans, sans-serif" }}>
                      Admin logins can't be created from this page for security reasons — create it in Supabase, then come back here.
                    </p>
                  </div>

                  <ol className="flex flex-col gap-3 text-[14px] text-[#334155] list-decimal pl-5">
                    <li>Go to your Supabase project → Authentication → Users</li>
                    <li>Click "Add user" and enter <strong>{form.email}</strong> with a password</li>
                    <li>Come back here and click the button below to set their role as <strong>{form.role}</strong></li>
                  </ol>

                  {error && <ErrorState message={error} compact />}

                  <motion.button
                    className="w-full h-14 bg-[#2D2555] rounded-[6px] text-white font-medium disabled:opacity-60"
                    style={{ fontFamily: "Inter, sans-serif", fontSize: "16px" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={applying}
                    onClick={handleConfirmCreated}
                  >
                    {applying ? "Checking..." : "I've created their login — Set Role"}
                  </motion.button>

                  <button
                    className="text-[13px] text-[#64748B] underline self-center"
                    onClick={() => setStep("form")}
                  >
                    Back
                  </button>
                </div>
              )}
            </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
