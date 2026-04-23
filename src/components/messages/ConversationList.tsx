"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Add } from "@carbon/icons-react";
import { conversations, Conversation } from "@/components/messages/data";

interface ConversationListProps {
  activeId: string;
  onSelect: (c: Conversation) => void;
}

export default function ConversationList({ activeId, onSelect }: ConversationListProps) {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col bg-white border border-[#F1F5F9] rounded-[16px] overflow-hidden flex-shrink-0 w-[340px]">
      {/* Search + Compose */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-[#F8FAFC]">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 border border-[#E5E5E5] rounded-[6px] text-[14px] text-[#0A0A0A] placeholder:text-[#737373] outline-none focus:border-[#2D2555]/40 transition-colors bg-transparent"
            style={{ boxShadow: "0px 1px 2px rgba(0,0,0,0.05)" }}
          />
        </div>
        <motion.button
          className="w-9 h-9 flex items-center justify-center bg-[#2D2555] rounded-[12px] flex-shrink-0 cursor-pointer"
          style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Add size={16} className="text-white" />
        </motion.button>
      </div>

      {/* List */}
      <div className="flex flex-col overflow-y-auto flex-1">
        {filtered.map((conv, index) => {
          const isActive = conv.id === activeId;
          return (
            <motion.button
              key={conv.id}
              onClick={() => onSelect(conv)}
              className={`w-full text-left flex items-center gap-3 px-4 py-[14px] transition-colors cursor-pointer ${
                isActive ? "bg-[#F8FAFC]" : "hover:bg-[#F8FAFC]/60"
              } ${index > 0 ? "border-t border-[#F8FAFC]" : ""}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              {/* Avatar */}
              <div
                className="w-10 h-10 flex items-center justify-center rounded-[12px] flex-shrink-0 text-[14px] font-bold text-white"
                style={{ background: conv.avatarColor }}
              >
                {conv.initials}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-[2px]">
                  <span
                    className={`text-[14px] leading-5 ${
                      conv.unread > 0
                        ? "font-bold text-[#0F172A]"
                        : "font-semibold text-[#334155]"
                    }`}
                  >
                    {conv.name}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] leading-[15px] pl-2 flex-shrink-0">
                    {conv.date}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12px] text-[#94A3B8] leading-4 truncate flex-1">
                    {conv.preview}
                  </p>
                  {conv.unread > 0 && (
                    <div className="w-5 h-5 flex items-center justify-center bg-[#2D2555] rounded-full flex-shrink-0">
                      <span className="text-[10px] font-bold text-white leading-[15px]">
                        {conv.unread}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
