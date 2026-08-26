"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ConversationList from "@/components/messages/ConversationList";
import ChatView from "@/components/messages/ChatView";
import { Conversation } from "@/components/messages/types";

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DashboardHeader title="Messages" subtitle="Communicate with your team and clients" />

      <main className="px-6 py-6 flex-1 min-h-0 overflow-hidden">
        <motion.div
          className="flex gap-5 h-full"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <ConversationList
            activeId={activeConversation?.id ?? null}
            onSelect={setActiveConversation}
          />
          {activeConversation ? (
            <ChatView conversation={activeConversation} />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white border border-[#F1F5F9] rounded-[16px] text-[14px] text-[#94A3B8]">
              Select a conversation to view messages
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
