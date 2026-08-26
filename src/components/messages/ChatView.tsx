"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendFilled } from "@carbon/icons-react";
import { Conversation, Message } from "@/components/messages/types";
import Loader from "@/components/shared/Loader";
import { supabase } from "@/lib/supabase";
import { logActivity } from "@/lib/logActivity";

interface ChatViewProps {
  conversation: Conversation;
}

export default function ChatView({ conversation }: ChatViewProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversation.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setMessages(
          (data ?? []).map((row) => ({
            id: row.id,
            from: row.sender,
            text: row.body,
            time: new Date(row.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }))
        );
        setLoading(false);
      });
  }, [conversation.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput("");

    const { data, error } = await supabase
      .from("messages")
      .insert({ conversation_id: conversation.id, sender: "admin", body: text })
      .select()
      .single();

    if (!error && data) {
      setMessages((prev) => [
        ...prev,
        { id: data.id, from: "admin", text: data.body, time: new Date(data.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);
      logActivity({ action: "created", module: "Messages", affectedItem: conversation.name, description: `Replied to ${conversation.name}` });
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col bg-white border border-[#F1F5F9] rounded-[16px] overflow-hidden flex-1">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F1F5F9] flex-shrink-0">
        <div
          className="w-10 h-10 flex items-center justify-center rounded-[12px] flex-shrink-0 text-[14px] font-bold text-white"
          style={{ background: conversation.avatarColor }}
        >
          {conversation.initials}
        </div>
        <div className="flex flex-col gap-[2px]">
          <span className="text-[14px] font-bold text-[#0F172A] leading-5">
            {conversation.name}
          </span>
          <span className="text-[12px] text-[#94A3B8] leading-4">
            {conversation.email}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3 min-h-0">
        {loading ? (
          <Loader />
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isAdmin = msg.from === "admin";
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex flex-col gap-1 max-w-[521px]">
                    {/* Sender label for incoming */}
                    {!isAdmin && (
                      <span className="text-[10px] text-[#94A3B8] leading-[15px]">
                        {conversation.name}
                      </span>
                    )}

                    {/* Bubble */}
                    <div
                      className="px-4 py-[10px]"
                      style={{
                        background: isAdmin ? "#2D2555" : "#F1F5F9",
                        borderRadius: isAdmin
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px",
                      }}
                    >
                      <p
                        className="text-[14px] leading-[23px]"
                        style={{ color: isAdmin ? "#FFFFFF" : "#1E293B" }}
                      >
                        {msg.text}
                      </p>
                    </div>

                    {/* Timestamp */}
                    <span
                      className={`text-[10px] text-[#94A3B8] leading-[15px] ${
                        isAdmin ? "text-right" : "text-left"
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="flex items-end gap-3 px-4 py-4 border-t border-[#F1F5F9] flex-shrink-0">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 h-10 px-3 border border-[#E5E5E5] rounded-[6px] text-[14px] text-[#0A0A0A] placeholder:text-[#737373] outline-none focus:border-[#2D2555]/40 transition-colors bg-transparent"
          style={{ boxShadow: "0px 1px 2px rgba(0,0,0,0.05)" }}
        />
        <motion.button
          onClick={handleSend}
          className={`w-10 h-10 flex items-center justify-center bg-[#2D2555] rounded-[12px] flex-shrink-0 cursor-pointer transition-opacity ${
            input.trim() ? "opacity-100" : "opacity-50"
          }`}
          style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)" }}
          whileHover={input.trim() ? { scale: 1.05 } : {}}
          whileTap={input.trim() ? { scale: 0.95 } : {}}
        >
          <SendFilled size={16} className="text-white" />
        </motion.button>
      </div>
    </div>
  );
}
