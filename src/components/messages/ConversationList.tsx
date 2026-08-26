"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "@carbon/icons-react";
import Loader from "@/components/shared/Loader";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import { supabase } from "@/lib/supabase";
import { Conversation } from "@/components/messages/types";

const avatarColors = ["#2D2555", "#068653", "#A855F7", "#F59E0B", "#3B82F6"];

interface ConversationListProps {
  activeId: string | null;
  onSelect: (c: Conversation) => void;
  refreshKey?: number;
}

export default function ConversationList({ activeId, onSelect, refreshKey }: ConversationListProps) {
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    const { data: convRows, error: convError } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false });

    if (convError || !convRows) {
      setError("Couldn't load conversations. Please try again.");
      setLoading(false);
      return;
    }

    const { data: msgRows } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    const lastMessageByConv = new Map<string, { body: string; created_at: string }>();
    for (const m of msgRows ?? []) {
      if (!lastMessageByConv.has(m.conversation_id)) {
        lastMessageByConv.set(m.conversation_id, { body: m.body, created_at: m.created_at });
      }
    }

    const mapped: Conversation[] = convRows.map((row, i) => {
      const last = lastMessageByConv.get(row.id);
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        initials: row.name.split(" ").map((p: string) => p[0]).slice(0, 2).join("").toUpperCase(),
        avatarColor: avatarColors[i % avatarColors.length],
        preview: last?.body || row.subject || "",
        date: new Date(last?.created_at || row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      };
    });

    setConversations(mapped);
    setLoading(false);

    if (!activeId && mapped.length > 0) {
      onSelect(mapped[0]);
    }
  };

  useEffect(() => {
    load();
  }, [refreshKey]);

  const filtered = conversations.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col bg-white border border-[#F1F5F9] rounded-[16px] overflow-hidden flex-shrink-0 w-[340px]">
      {/* Search */}
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
      </div>

      {/* List */}
      <div className="flex flex-col overflow-y-auto flex-1">
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : filtered.length === 0 ? (
          <EmptyState title="No conversations yet" description="Messages from the website's contact form will show up here." />
        ) : (
          filtered.map((conv, index) => {
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
                    <span className="text-[14px] font-semibold text-[#334155] leading-5">
                      {conv.name}
                    </span>
                    <span className="text-[10px] text-[#94A3B8] leading-[15px] pl-2 flex-shrink-0">
                      {conv.date}
                    </span>
                  </div>

                  <p className="text-[12px] text-[#94A3B8] leading-4 truncate">
                    {conv.preview}
                  </p>
                </div>
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
}
