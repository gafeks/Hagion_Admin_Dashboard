"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Add } from "@carbon/icons-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import BlogPostsTable from "@/components/blog/BlogPostsTable";
import NewPostModal from "@/components/blog/NewPostModal";

export default function BlogPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DashboardHeader title="Blog Management" subtitle={`${count} Posts`} />

      <main className="px-6 py-6 flex-1 flex flex-col gap-6 min-h-0 overflow-y-auto">
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex flex-col">
            <h1 className="text-[16px] font-semibold text-[#0A0A0A] leading-9">
              Blog Posts
            </h1>
            <p className="text-[14px] font-normal text-[#676767] leading-6">
              Manage all the blog posts
            </p>
          </div>

          <motion.button
            className="flex items-center gap-2 px-4 py-2 text-[#FAFAFA] text-[13px] font-semibold rounded-[6px] h-11 cursor-pointer"
            style={{ background: "linear-gradient(180deg, #2D2555 0%, #1A1540 60%, #2D2555 100%)" }}
            whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(45,37,85,0.3)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setModalOpen(true)}
          >
            <Add size={16} />
            <span>New Post</span>
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <BlogPostsTable key={refreshKey} onCountChange={setCount} />
        </motion.div>
      </main>

      <NewPostModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}
