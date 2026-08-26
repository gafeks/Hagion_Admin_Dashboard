"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Add } from "@carbon/icons-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProjectsTable from "@/components/portfolio/ProjectsTable";
import NewProjectModal from "@/components/portfolio/NewProjectModal";

export default function PortfolioPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DashboardHeader title="Portfolio" subtitle="Manage all your projects" />

      <main className="px-6 py-6 flex-1 flex flex-col gap-6 min-h-0 overflow-y-auto">
        {/* Search + New Project */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-white/[0.002] border border-[#E5E5E5] rounded-[6px] text-[14px] text-[#0A0A0A] placeholder:text-[#737373] outline-none focus:border-[#2D2555]/40 transition-colors"
            />
          </div>

          {/* New Project button */}
          <motion.button
            className="flex items-center gap-2 px-4 h-11 bg-[#2D2555] rounded-[6px] text-[14px] font-semibold text-[#FAFAFA] cursor-pointer whitespace-nowrap flex-shrink-0"
            style={{ boxShadow: "0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)" }}
            whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(45,37,85,0.3)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setModalOpen(true)}
          >
            <Add size={16} />
            <span>New Project</span>
          </motion.button>
        </motion.div>

        {/* Projects list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <ProjectsTable key={refreshKey} searchQuery={searchQuery} />
        </motion.div>
      </main>

      <NewProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}
