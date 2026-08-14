"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Loader from "@/components/shared/Loader";

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
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
        return;
      }
      setCheckingSession(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/login");
    });

    return () => subscription.subscription.unsubscribe();
  }, [router]);

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#F5F4F7] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[#F5F4F7]">
        <Sidebar />
        <DashboardContent>{children}</DashboardContent>
      </div>
    </SidebarProvider>
  );
}
