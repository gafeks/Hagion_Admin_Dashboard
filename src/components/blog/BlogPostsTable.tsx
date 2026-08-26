"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, TrashCan, Image as ImageIcon } from "@carbon/icons-react";
import EditPostModal from "@/components/blog/EditPostModal";
import Loader from "@/components/shared/Loader";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { supabase } from "@/lib/supabase";
import { logActivity } from "@/lib/logActivity";

export interface BlogPost {
  id: string;
  title: string;
  status: "Published" | "Draft" | "Archived";
  category: string;
  date: string;
  excerpt: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  coverImagePath: string | null;
  coverImageUrl: string | null;
}

const StatusBadge = ({ status }: { status: "Published" | "Draft" | "Archived" }) => {
  if (status === "Published") {
    return (
      <span className="inline-flex items-center px-[9.8px] py-[1.8px] bg-[#DCFCE7] rounded-[6px] text-[12px] font-medium text-[#3DA58A] leading-4 whitespace-nowrap">
        Published
      </span>
    );
  }
  if (status === "Archived") {
    return (
      <span className="inline-flex items-center px-[9.8px] py-[1.8px] bg-[#F1F5F9] rounded-[6px] text-[12px] font-medium text-[#64748B] leading-4 whitespace-nowrap">
        Archived
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-[9.8px] py-[1.8px] bg-[#FEF9C3] rounded-[6px] text-[12px] font-medium text-[#FD6513] leading-4 whitespace-nowrap">
      Draft
    </span>
  );
};

export interface BlogPostsTableHandle {
  reload: () => void;
}

interface BlogPostsTableProps {
  onCountChange?: (count: number) => void;
}

export default function BlogPostsTable({ onCountChange }: BlogPostsTableProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);

  const loadPosts = () => {
    setLoading(true);
    setError(null);
    supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError || !data) {
          setError("Couldn't load blog posts. Please try again.");
          setLoading(false);
          return;
        }
        const mapped = data.map((row) => ({
          id: row.id,
          title: row.title,
          status: row.status,
          category: row.category || "",
          date: new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          excerpt: row.excerpt || "",
          content: row.content || "",
          seoTitle: row.seo_title || "",
          seoDescription: row.seo_description || "",
          coverImagePath: row.cover_image_path,
          coverImageUrl: row.cover_image_path
            ? supabase.storage.from("blog-images").getPublicUrl(row.cover_image_path).data.publicUrl
            : null,
        }));
        setPosts(mapped);
        onCountChange?.(mapped.length);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (post: BlogPost) => {
    setDeletingPost(null);
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    onCountChange?.(posts.length - 1);
    await supabase.from("blog_posts").delete().eq("id", post.id);
    logActivity({ action: "deleted", module: "Blog", affectedItem: post.title, description: `Deleted blog post: '${post.title}'` });
  };

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={loadPosts} />;
  if (posts.length === 0) return <EmptyState title="No blog posts yet" description="Create your first post to get started." />;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex flex-col bg-white border border-[#F1F5F9] rounded-[16px] overflow-hidden"
            >
              <div className="relative w-full aspect-video bg-[#F1F5F9]">
                {post.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={28} className="text-[#CBD5E1]" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <StatusBadge status={post.status} />
                </div>
              </div>

              <div className="flex flex-col gap-1 p-4 flex-1">
                <h4 className="text-[13px] font-semibold text-[#0F172A] leading-5">
                  {post.title}
                </h4>
                <p className="text-[10.9px] font-normal text-[#64748B] leading-4">
                  {post.category} · {post.date}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 px-4 pb-4">
                <motion.button
                  className="w-9 h-9 flex items-center justify-center rounded-[6px] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Edit post"
                  onClick={() => setEditingPost(post)}
                >
                  <Edit size={16} className="text-[#94A3B8]" />
                </motion.button>
                <motion.button
                  className="w-9 h-9 flex items-center justify-center rounded-[6px] hover:bg-red-50 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeletingPost(post)}
                  aria-label="Delete post"
                >
                  <TrashCan size={16} className="text-[#F87171]" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <EditPostModal
        post={editingPost}
        open={!!editingPost}
        onClose={() => setEditingPost(null)}
        onSaved={loadPosts}
      />

      <ConfirmDialog
        open={!!deletingPost}
        title="Delete this post?"
        message={`"${deletingPost?.title}" will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={() => deletingPost && handleDelete(deletingPost)}
        onCancel={() => setDeletingPost(null)}
      />
    </div>
  );
}
