"use client";

import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { motion } from "framer-motion";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <motion.main
      className="min-h-screen overflow-x-hidden"
      initial={false}
      animate={{ marginLeft: collapsed ? 72 : 288 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.main>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[#F5F4F7]">
        <Sidebar />
        <DashboardContent>{children}</DashboardContent>
      </div>
    </SidebarProvider>
  );
}
