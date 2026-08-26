"use client";

import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  DocumentBlank,
  Email,
  ChartLineSmooth,
  Blog,
  Growth,
} from "@carbon/icons-react";
import { supabase } from "@/lib/supabase";

export default function StatsCards() {
  const [totalRfqs, setTotalRfqs] = useState(0);
  const [openLeads, setOpenLeads] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0);
  const [blogPosts, setBlogPosts] = useState(0);
  const [drafts, setDrafts] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);

  useEffect(() => {
    (async () => {
      const [rfqRes, leadRes, projectRes, blogRes] = await Promise.all([
        supabase.from("rfqs").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("stage"),
        supabase.from("portfolio_projects").select("id", { count: "exact", head: true }).eq("status", "In progress"),
        supabase.from("blog_posts").select("status"),
      ]);

      setTotalRfqs(rfqRes.count ?? 0);

      const leads = leadRes.data ?? [];
      setOpenLeads(leads.filter((l) => !["won", "lost"].includes(l.stage)).length);
      const won = leads.filter((l) => l.stage === "won").length;
      setConversionRate(leads.length > 0 ? Math.round((won / leads.length) * 100) : 0);

      setActiveProjects(projectRes.count ?? 0);

      const posts = blogRes.data ?? [];
      setBlogPosts(posts.length);
      setDrafts(posts.filter((p) => p.status === "Draft").length);
    })();
  }, []);

  const stats = [
    {
      label: "Total RFQs",
      value: totalRfqs,
      suffix: "",
      tag: "All time",
      Icon: DocumentBlank,
      iconColor: "#2D2555",
      iconBg: "rgba(45, 37, 85, 0.07)",
    },
    {
      label: "Open Leads",
      value: openLeads,
      suffix: "",
      tag: openLeads > 0 ? "Needs attention" : "All clear",
      Icon: Email,
      iconColor: "#F59E0B",
      iconBg: "rgba(245, 158, 11, 0.08)",
    },
    {
      label: "Active Projects",
      value: activeProjects,
      suffix: "",
      tag: "In progress",
      Icon: ChartLineSmooth,
      iconColor: "#3B82F6",
      iconBg: "rgba(59, 130, 246, 0.08)",
    },
    {
      label: "Blog Posts",
      value: blogPosts,
      suffix: "",
      tag: `${drafts} draft${drafts === 1 ? "" : "s"}`,
      Icon: Blog,
      iconColor: "#A855F7",
      iconBg: "rgba(168, 85, 247, 0.08)",
    },
    {
      label: "Conversion Rate",
      value: conversionRate,
      suffix: "%",
      tag: "Won / total leads",
      Icon: Growth,
      iconColor: "#068653",
      iconBg: "rgba(6, 134, 83, 0.07)",
    },
  ];

  return (
    <div className="flex gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          className="flex-1 bg-white border border-[#F1F5F9] rounded-2xl p-5 h-[150px] flex flex-col justify-between cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: stat.iconBg } as React.CSSProperties}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <stat.Icon size={20} style={{ color: stat.iconColor }} />
            </motion.div>
            <span className="text-[12px] font-semibold text-[#94A3B8]">
              {stat.tag}
            </span>
          </div>

          <span className="text-[24px] font-black text-[#0F172A]">
            <CountUp end={stat.value} duration={1.5} delay={0.3 + i * 0.1} />
            {stat.suffix}
          </span>

          <span className="text-[12px] font-semibold text-[#64748B]">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
