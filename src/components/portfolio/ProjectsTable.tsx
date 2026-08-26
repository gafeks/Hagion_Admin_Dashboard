"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, TrashCan } from "@carbon/icons-react";
import EditProjectModal from "@/components/portfolio/EditProjectModal";
import Loader from "@/components/shared/Loader";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { supabase } from "@/lib/supabase";
import { logActivity } from "@/lib/logActivity";

export interface Project {
  id: string;
  title: string;
  status: "Planning" | "Completed" | "In progress" | "On hold";
  client: string;
  budget: string;
  progress: number;
  description: string;
  startDate: string;
  endDate: string;
  coverImagePath: string | null;
}

const statusConfig: Record<
  Project["status"],
  { bg: string; text: string; label: string; barColor: string; trackColor: string }
> = {
  Planning: {
    bg: "bg-black/10",
    text: "text-[#737373]",
    label: "Planning",
    barColor: "#068653",
    trackColor: "rgba(6,134,83,0.15)",
  },
  Completed: {
    bg: "bg-[#DCFCE7]",
    text: "text-[#3DA58A]",
    label: "Completed",
    barColor: "#068653",
    trackColor: "rgba(23,23,23,0.2)",
  },
  "In progress": {
    bg: "bg-[#DBEAFE]",
    text: "text-[#1D4ED8]",
    label: "In progress",
    barColor: "#068653",
    trackColor: "rgba(6,134,83,0.1)",
  },
  "On hold": {
    bg: "bg-[#FC5A31]/10",
    text: "text-[#FD6513]",
    label: "On hold",
    barColor: "#FD6513",
    trackColor: "rgba(23,23,23,0.2)",
  },
};

interface ProjectsTableProps {
  searchQuery: string;
  onCountChange?: (count: number) => void;
}

export default function ProjectsTable({ searchQuery, onCountChange }: ProjectsTableProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const loadProjects = () => {
    setLoading(true);
    setError(null);
    supabase
      .from("portfolio_projects")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError || !data) {
          setError("Couldn't load projects. Please try again.");
          setLoading(false);
          return;
        }
        const mapped = data.map((row) => ({
          id: row.id,
          title: row.title,
          status: row.status,
          client: row.client || "",
          budget: row.budget || "",
          progress: row.progress,
          description: row.description || "",
          startDate: row.start_date || "",
          endDate: row.end_date || "",
          coverImagePath: row.cover_image_path,
        }));
        setProjects(mapped);
        onCountChange?.(mapped.length);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (project: Project) => {
    setDeletingProject(null);
    setProjects((prev) => prev.filter((p) => p.id !== project.id));
    onCountChange?.(projects.length - 1);
    await supabase.from("portfolio_projects").delete().eq("id", project.id);
    logActivity({ action: "deleted", module: "Portfolio", affectedItem: project.title, description: `Deleted portfolio item: '${project.title}'` });
  };

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={loadProjects} />;
  if (filtered.length === 0) return <EmptyState title="No projects found" description="Create your first project or adjust your search." />;

  return (
    <>
      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {filtered.map((project, index) => {
            const cfg = statusConfig[project.status];
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white border border-[#F1F5F9] rounded-[16px] px-[23.8px] py-[23.8px]"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Left: info */}
                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    {/* Title + badge */}
                    <div className="flex items-center gap-3">
                      <h4 className="text-[16px] font-semibold text-[#0F172A] leading-6">
                        {project.title}
                      </h4>
                      <span
                        className={`inline-flex items-center px-[9.8px] py-[1.8px] ${cfg.bg} rounded-[6px] text-[12px] font-semibold ${cfg.text} leading-4 whitespace-nowrap`}
                      >
                        {cfg.label}
                      </span>
                    </div>

                    {/* Client + budget */}
                    <p className="text-[14px] text-[#64748B] leading-5">
                      {project.client} · {project.budget}
                    </p>

                    {/* Progress bar */}
                    <div className="flex items-center gap-3 pt-1">
                      <div
                        className="w-[320px] h-2 rounded-full overflow-hidden flex-shrink-0"
                        style={{ background: cfg.trackColor }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: cfg.barColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.2, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-[12px] font-semibold text-[#64748B] leading-4">
                        {project.progress}%
                      </span>
                    </div>
                  </div>

                  {/* Right: action buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <motion.button
                      className="w-9 h-9 flex items-center justify-center rounded-[6px] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Edit project"
                      onClick={() => setEditingProject(project)}
                    >
                      <Edit size={16} className="text-[#94A3B8]" />
                    </motion.button>
                    <motion.button
                      className="w-9 h-9 flex items-center justify-center rounded-[6px] hover:bg-red-50 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeletingProject(project)}
                      aria-label="Delete project"
                    >
                      <TrashCan size={16} className="text-[#F87171]" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <EditProjectModal
        project={editingProject}
        open={!!editingProject}
        onClose={() => setEditingProject(null)}
        onSaved={loadProjects}
      />

      <ConfirmDialog
        open={!!deletingProject}
        title="Delete this project?"
        message={`"${deletingProject?.title}" will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={() => deletingProject && handleDelete(deletingProject)}
        onCancel={() => setDeletingProject(null)}
      />
    </>
  );
}
