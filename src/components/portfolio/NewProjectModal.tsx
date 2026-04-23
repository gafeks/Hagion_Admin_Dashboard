"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Close, Upload } from "@carbon/icons-react";
import SelectDropdown from "@/components/shared/SelectDropdown";

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export default function NewProjectModal({ open, onClose }: NewProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [budget, setBudget] = useState("");
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-[70] overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                className="relative w-full max-w-[512px] bg-white border border-[#E5E5E5] rounded-[8px] p-[23.8px] flex flex-col gap-4 my-4"
                style={{ boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)" }}
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close */}
                <button
                  onClick={onClose}
                  className="absolute top-[16.8px] right-[16.8px] opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Close size={16} className="text-[#0A0A0A]" />
                </button>

                {/* Heading */}
                <h2 className="text-[18px] font-semibold leading-[18px] tracking-[-0.45px] text-[#0A0A0A]">
                  New Project
                </h2>

                {/* Form */}
                <div className="pt-4 flex flex-col gap-4">
                  {/* Project Name */}
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full h-9 px-3 border border-[#E5E5E5] rounded-[6px] text-[14px] text-[#0A0A0A] placeholder:text-[#737373] outline-none focus:border-[#2D2555]/40 transition-colors bg-transparent"
                  />

                  {/* Client Name */}
                  <input
                    type="text"
                    placeholder="Client Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full h-9 px-3 border border-[#E5E5E5] rounded-[6px] text-[14px] text-[#0A0A0A] placeholder:text-[#737373] outline-none focus:border-[#2D2555]/40 transition-colors bg-transparent"
                  />

                  {/* Description */}
                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5E5E5] rounded-[6px] text-[14px] text-[#0A0A0A] placeholder:text-[#737373] outline-none focus:border-[#2D2555]/40 transition-colors resize-none bg-transparent"
                    style={{ height: "60px", minHeight: "60px" }}
                  />

                  {/* Image Upload */}
                  <div
                    className={`w-full h-[135px] bg-[#FAFAFA] border border-dashed border-[#2D2555] rounded-[4px] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                      dragOver ? "bg-[#2D2555]/5" : ""
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".png,.jpg,.jpeg,.svg"
                      className="hidden"
                    />
                    <Upload size={20} className="text-[#343330]" />
                    <p className="text-[10.8px] font-bold text-[#2D2555] text-center leading-4">
                      Click or drag and drop here
                    </p>
                    <p className="text-[9.48px] text-[#52525B] text-center">
                      to upload your image or logo
                    </p>
                    <p className="text-[9.48px] text-[#52525B] text-center">
                      .png, .jpg .svg up to 5MB
                    </p>
                  </div>

                  {/* Start Date + End Date */}
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-[12px] text-[#64748B] leading-4">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full h-9 px-3 border border-[#E5E5E5] rounded-[6px] text-[14px] text-[#737373] outline-none focus:border-[#2D2555]/40 transition-colors bg-transparent"
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-[12px] text-[#64748B] leading-4">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full h-9 px-3 border border-[#E5E5E5] rounded-[6px] text-[14px] text-[#737373] outline-none focus:border-[#2D2555]/40 transition-colors bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Status + Budget */}
                  <div className="flex gap-4">
                    <SelectDropdown
                      value={status}
                      onChange={setStatus}
                      placeholder="Planning"
                      className="flex-1"
                      options={[
                        { label: "Planning", value: "Planning" },
                        { label: "In progress", value: "In progress" },
                        { label: "Completed", value: "Completed" },
                        { label: "On hold", value: "On hold" },
                      ]}
                    />
                    <input
                      type="text"
                      placeholder="Budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="flex-1 h-9 px-3 border border-[#E5E5E5] rounded-[6px] text-[14px] text-[#0A0A0A] placeholder:text-[#737373] outline-none focus:border-[#2D2555]/40 transition-colors bg-transparent"
                    />
                  </div>

                  {/* Progress slider */}
                  <div className="flex flex-col gap-[6.4px] pb-[5.6px]">
                    <label className="text-[12px] text-[#64748B] leading-4">
                      Progress: {progress}%
                    </label>
                    <div className="relative flex items-center h-5">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={progress}
                        onChange={(e) => setProgress(Number(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #068653 ${progress}%, rgba(23,23,23,0.2) ${progress}%)`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Create Project */}
                  <motion.button
                    className="w-full h-10 flex items-center justify-center bg-[#2D2555] rounded-[6px] text-[14px] font-semibold text-[#FAFAFA] cursor-pointer"
                    whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(45,37,85,0.3)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create Project
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <style>{`
            input[type="range"]::-webkit-slider-thumb {
              appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #068653;
              cursor: pointer;
              border: none;
            }
            input[type="range"]::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #068653;
              cursor: pointer;
              border: none;
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
