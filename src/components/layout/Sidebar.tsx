"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/context/SidebarContext";
import {
  Dashboard,
  DocumentBlank,
  ChartLineSmooth,
  Blog,
  Portfolio,
  Chat,
  Analytics,
  UserAdmin,
  Activity,
  Settings,
  Logout,
  ChevronLeft,
  ChevronRight,
} from "@carbon/icons-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Dashboard },
  { label: "RFQs", href: "/rfqs", icon: DocumentBlank },
  { label: "CRM", href: "/crm", icon: ChartLineSmooth },
  { label: "Blog", href: "/blog", icon: Blog },
  { label: "Portfolio", href: "/portfolio", icon: Portfolio },
  { label: "Messages", href: "/messages", icon: Chat },
  { label: "Analytics", href: "/analytics", icon: Analytics },
  { label: "Admin Mgmt", href: "/admin", icon: UserAdmin },
  { label: "Activity Log", href: "/activity", icon: Activity },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen bg-[#2D2555] flex flex-col z-50"
      initial={false}
      animate={{ width: collapsed ? 72 : 288 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Scrollable area — logo + nav */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Logo + Collapse */}
        <div className="flex items-center justify-between px-5 h-[80px] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <Image src="/images/hagion-logo.png" alt="Hagion" width={50} height={48} className="shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  className="flex flex-col whitespace-nowrap"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-[16px] font-bold text-white leading-[24px]">Hagion</span>
                  <span className="text-[10px] font-semibold text-[#068653] uppercase tracking-[1px] leading-[15px]">International Ltd</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            onClick={toggle}
            className="text-[#94A3B8] hover:text-white transition-colors shrink-0"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </motion.button>
        </div>

        {/* Nav */}
        <nav className="px-3 py-5">
        <AnimatePresence>
          {!collapsed && (
            <motion.p
              className="px-3 text-[10px] font-bold text-[#64748B] uppercase tracking-[1px] mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Main Menu
            </motion.p>
          )}
        </AnimatePresence>
        <div className="flex flex-col gap-0.5">
          {navItems.map((item, i) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-semibold transition-colors ${
                    isActive
                      ? "bg-[#068653]/[0.145] text-[#068653]"
                      : "text-[#94A3B8] hover:bg-white/[0.04]"
                  } ${collapsed ? "justify-center" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-[28px] bg-[#068653] rounded-r-full"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  <item.icon size={18} className="shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </nav>
      </div>

      {/* Bottom — Logout */}
      <div className="px-3 py-3 border-t border-white/5">
        <motion.button
          className={`flex items-center gap-3 w-full px-3 py-2.5 bg-white rounded-lg text-[14px] font-semibold text-[#E7000B] transition-colors hover:bg-gray-50 ${collapsed ? "justify-center" : ""}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Logout size={18} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
}
