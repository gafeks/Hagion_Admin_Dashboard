"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Close, Upload } from "@carbon/icons-react";
import SelectDropdown from "@/components/shared/SelectDropdown";

interface NewPostModalProps {
  open: boolean;
  onClose: () => void;
}

export default function NewPostModal({ open, onClose }: NewPostModalProps) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Draft");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <AnimatePresence>
      {open && (
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
            className="fixed inset-0 z-[70] overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              className="relative w-full max-w-[672px] bg-white border border-[#E5E5E5] rounded-[8px] p-[23.8px] flex flex-col gap-4 my-4"
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
              <h2 className="text-[16.5px] font-semibold leading-[18px] tracking-[-0.45px] text-[#0A0A0A]">
                New Post
              </h2>

              {/* Form */}
              <div className="pt-4 flex flex-col gap-4">
                {/* Post Title */}
                <input
                  type="text"
                  placeholder="Post Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-9 px-3 border border-[#E5E5E5] rounded-[6px] text-[14px] text-[#0A0A0A] placeholder:text-[#737373] outline-none focus:border-[#2D2555]/40 transition-colors bg-transparent"
                />

                {/* Short Excerpt */}
                <textarea
                  placeholder="Short excerpt..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-[6px] text-[14px] text-[#0A0A0A] placeholder:text-[#737373] outline-none focus:border-[#2D2555]/40 transition-colors resize-none bg-transparent"
                  style={{ height: "80px", minHeight: "80px" }}
                />

                {/* Content */}
                <textarea
                  placeholder="Write your post content..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-[6px] text-[14px] text-[#0A0A0A] placeholder:text-[#737373] outline-none focus:border-[#2D2555]/40 transition-colors resize-none bg-transparent"
                  style={{ height: "181px" }}
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

                {/* Category + Status */}
                <div className="flex gap-4">
                  <SelectDropdown
                    value={category}
                    onChange={setCategory}
                    placeholder="Category"
                    className="flex-1"
                    options={[
                      { label: "Technology", value: "Technology" },
                      { label: "Insights", value: "Insights" },
                      { label: "Case study", value: "Case study" },
                      { label: "Business", value: "Business" },
                    ]}
                  />
                  <SelectDropdown
                    value={status}
                    onChange={setStatus}
                    className="flex-1"
                    options={[
                      { label: "Draft", value: "Draft" },
                      { label: "Published", value: "Published" },
                      { label: "Archived", value: "Archived" },
                    ]}
                  />
                </div>

                {/* SEO Title */}
                <input
                  type="text"
                  placeholder="SEO Title"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full h-9 px-3 border border-[#E5E5E5] rounded-[6px] text-[12.7px] text-[#0A0A0A] placeholder:text-[#737373] outline-none focus:border-[#2D2555]/40 transition-colors bg-transparent"
                />

                {/* SEO Description */}
                <input
                  type="text"
                  placeholder="SEO Description"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full h-9 px-3 border border-[#E5E5E5] rounded-[6px] text-[12.9px] text-[#0A0A0A] placeholder:text-[#737373] outline-none focus:border-[#2D2555]/40 transition-colors bg-transparent"
                />

                {/* Publish */}
                <motion.button
                  className="w-full h-10 flex items-center justify-center bg-[#2D2555] rounded-[6px] text-[13px] font-semibold text-[#FAFAFA] cursor-pointer"
                  whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(45,37,85,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Publish Post
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
