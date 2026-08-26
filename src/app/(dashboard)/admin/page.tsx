"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  UserAdmin,
  User,
  Edit,
  UserMultiple,
  CheckmarkOutline,
  CloseOutline,
  Search,
  Add,
} from "@carbon/icons-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ManageAdminModal from "@/components/admin/ManageAdminModal";
import AddAdminModal from "@/components/admin/AddAdminModal";
import Loader from "@/components/shared/Loader";
import ErrorState from "@/components/shared/ErrorState";
import { supabase } from "@/lib/supabase";

const permissions = [
  { label: "View Analytics",      superAdmin: true,  admin: true,  contentAdmin: false },
  { label: "Manage RFQs",         superAdmin: true,  admin: true,  contentAdmin: false },
  { label: "CRM Pipeline",        superAdmin: true,  admin: true,  contentAdmin: false },
  { label: "Publish Blog Posts",  superAdmin: true,  admin: false, contentAdmin: false },
  { label: "Create Blog Drafts",  superAdmin: true,  admin: true,  contentAdmin: true  },
  { label: "Manage Roles",        superAdmin: true,  admin: false, contentAdmin: false },
  { label: "Update Portfolio",    superAdmin: true,  admin: true,  contentAdmin: false },
  { label: "Respond to Messages", superAdmin: true,  admin: true,  contentAdmin: true  },
];

function PermIcon({ allowed }: { allowed: boolean }) {
  return allowed ? (
    <CheckmarkOutline size={16} style={{ color: "#068653" }} className="inline-block" />
  ) : (
    <CloseOutline size={16} style={{ color: "#CBD5E1" }} className="inline-block" />
  );
}

interface Member {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
}

export default function AdminManagementPage() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [managingMember, setManagingMember] = useState<Member | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMembers = () => {
    setLoading(true);
    setError(null);
    supabase
      .from("admin_profiles")
      .select("*")
      .order("created_at", { ascending: true })
      .then(({ data, error: fetchError }) => {
        if (fetchError || !data) {
          setError("Couldn't load team members. Please try again.");
          setLoading(false);
          return;
        }
        setMembers(
          data.map((row) => ({
            id: row.id,
            name: row.full_name || row.email.split("@")[0],
            initials: (row.full_name || row.email).charAt(0).toUpperCase(),
            email: row.email,
            role: row.role,
          }))
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const statCards = [
    {
      label: "Super Admins",
      value: String(members.filter((m) => m.role === "Super Admin").length),
      bg: "rgba(45,37,85,0.05)",
      iconBg: "rgba(45,37,85,0.07)",
      valueColor: "#2D2555",
      iconColor: "#2D2555",
      icon: UserAdmin,
    },
    {
      label: "Admins",
      value: String(members.filter((m) => m.role === "Admin").length),
      bg: "#E3FFF4",
      iconBg: "rgba(6,134,83,0.07)",
      valueColor: "#068653",
      iconColor: "#068653",
      icon: User,
    },
    {
      label: "Content Admins",
      value: String(members.filter((m) => m.role === "Content Admin").length),
      bg: "rgba(168,85,247,0.05)",
      iconBg: "rgba(168,85,247,0.1)",
      valueColor: "#A855F7",
      iconColor: "#A855F7",
      icon: Edit,
    },
    {
      label: "Total Users",
      value: String(members.length),
      bg: "#FFF0E8",
      iconBg: "rgba(253,101,19,0.1)",
      valueColor: "#FD6513",
      iconColor: "#FD6513",
      icon: UserMultiple,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Admin Management" subtitle="Manage admin roles and permissions" />

      <main className="px-6 py-6 flex flex-col gap-6 pb-10">

        {/* Stat cards */}
        <motion.div
          className="grid grid-cols-4 gap-[34px]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                className="rounded-[16px] border border-[#F3F3F3] p-[21px]"
                style={{ background: card.bg }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.08 + i * 0.06 }}
              >
                <div className="mb-[22px]">
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-[12px]"
                    style={{ background: card.iconBg }}
                  >
                    <Icon size={20} style={{ color: card.iconColor }} />
                  </div>
                </div>
                <p className="text-[24px] font-semibold leading-8" style={{ color: card.valueColor }}>
                  {card.value}
                </p>
                <p className="text-[12px] text-[#64748B] leading-4 mt-[4px]">{card.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Team Members */}
        <motion.div
          className="bg-white border border-[#F1F5F9] rounded-[16px] overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="px-6 py-4 flex flex-col gap-3 border-b border-[#F1F5F9]">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-[#0F172A] leading-6">Team Members</h3>
              <div className="flex items-center gap-2">
                <motion.button
                  className="flex items-center gap-1.5 px-3 h-7 bg-[#2D2555] rounded-[8px] text-[12px] font-semibold text-white cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setAddOpen(true)}
                >
                  <Add size={14} />
                  Add Admin
                </motion.button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-full text-[14px] text-[#0A0A0A] placeholder:text-[#737373] outline-none bg-transparent"
                style={{ border: "0.6px solid #E5E5E5" }}
              />
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <ErrorState message={error} onRetry={loadMembers} />
          ) : (
          <div className="flex flex-col">
            {filtered.map((member, i) => (
              <motion.div
                key={member.email}
                className={`flex items-center justify-between px-6 py-4 ${i > 0 ? "border-t border-[#F8FAFC]" : ""}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.18 + i * 0.05 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 flex items-center justify-center bg-[#2D2555] rounded-[12px] text-[14px] font-bold text-white flex-shrink-0">
                    {member.initials}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#0F172A] leading-5">{member.name}</p>
                    <p className="text-[12px] text-[#64748B] leading-4">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex items-center px-[10px] py-1 rounded-full text-[12px] font-semibold text-[#068653]"
                    style={{ background: "rgba(6,134,83,0.082)" }}
                  >
                    {member.role}
                  </span>
                  <motion.button
                    className="flex items-center justify-center px-3 h-7 rounded-[6px] border border-[#E2E8F0] text-[12px] font-semibold text-[#0A0A0A] cursor-pointer bg-transparent"
                    whileHover={{ scale: 1.03, backgroundColor: "#F8FAFC" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setManagingMember(member)}
                  >
                    Manage
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </motion.div>

        {/* Permission Matrix */}
        <motion.div
          className="bg-white border border-[#F1F5F9] rounded-[16px] overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <div className="px-6 py-[15.4px] border-b border-[#F1F5F9]">
            <h3 className="text-[16px] font-semibold text-[#0F172A] leading-6">Permission Matrix</h3>
            <p className="text-[12px] text-[#64748B] leading-4 mt-[3px]">Role-based access control overview</p>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC]/80">
                <th className="px-6 py-[11.2px] text-left text-[12px] font-semibold uppercase tracking-[0.6px] leading-4 text-[#64748B]">
                  Permission
                </th>
                <th className="px-6 py-[11.2px] text-center text-[12px] font-semibold uppercase tracking-[0.6px] leading-4 text-[#2D2555]">
                  Super Admin
                </th>
                <th className="px-6 py-[11.2px] text-center text-[12px] font-semibold uppercase tracking-[0.6px] leading-4 text-[#068653]">
                  Admin
                </th>
                <th className="px-6 py-[11.2px] text-center text-[12px] font-semibold uppercase tracking-[0.6px] leading-4 text-[#A855F7]">
                  Content Admin
                </th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm, i) => (
                <motion.tr
                  key={perm.label}
                  className={i > 0 ? "border-t border-[#F8FAFC]" : ""}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.28 + i * 0.04 }}
                >
                  <td className="px-6 py-[12.2px] text-[14px] font-semibold text-[#334155] leading-5">
                    {perm.label}
                  </td>
                  <td className="px-6 py-[14.6px] text-center">
                    <PermIcon allowed={perm.superAdmin} />
                  </td>
                  <td className="px-6 py-[14.6px] text-center">
                    <PermIcon allowed={perm.admin} />
                  </td>
                  <td className="px-6 py-[14.6px] text-center">
                    <PermIcon allowed={perm.contentAdmin} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

      </main>

      <AddAdminModal open={addOpen} onClose={() => setAddOpen(false)} onAdded={loadMembers} />

      <ManageAdminModal
        member={managingMember}
        open={!!managingMember}
        onClose={() => setManagingMember(null)}
        onRoleChanged={loadMembers}
      />
    </div>
  );
}
