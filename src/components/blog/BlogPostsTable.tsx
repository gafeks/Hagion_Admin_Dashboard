"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, TrashCan } from "@carbon/icons-react";
import EditPostModal from "@/components/blog/EditPostModal";

interface BlogPost {
  id: string;
  title: string;
  status: "Published" | "Draft" | "Archived";
  category: string;
  date: string;
  excerpt: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
}

const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "Cloud Migration Best Practices for African Enterprises",
    status: "Published",
    category: "Technology",
    date: "Feb 25, 2026",
    excerpt: "A comprehensive guide to migrating your enterprise infrastructure to the cloud while minimizing downtime and maximizing ROI.",
    content: "As Africa's digital economy grows rapidly, enterprises are increasingly looking to the cloud to scale their operations. In this comprehensive guide, we explore the key strategies for a successful cloud migration...",
    seoTitle: "Cloud Migration Best Practices – Hagion International",
    seoDescription: "Learn cloud migration strategies tailored for African enterprises from Hagion's expert team.",
  },
  {
    id: "2",
    title: "How AI is Transforming Logistics in West Africa",
    status: "Published",
    category: "Insights",
    date: "Feb 25, 2026",
    excerpt: "Discover how artificial intelligence is revolutionizing supply chain and logistics operations across West Africa.",
    content: "The logistics sector in West Africa is undergoing a massive transformation driven by AI-powered solutions...",
    seoTitle: "AI in West Africa Logistics – Hagion International",
    seoDescription: "Explore how AI is reshaping logistics and supply chain management in West Africa.",
  },
  {
    id: "3",
    title: "Cybersecurity for Healthcare: Protecting Patient Data in Africa",
    status: "Published",
    category: "Technology",
    date: "Feb 25, 2026",
    excerpt: "A deep dive into the cybersecurity challenges facing healthcare providers across Africa and how to protect sensitive patient data.",
    content: "With the digitisation of health records accelerating across Africa, healthcare institutions face growing cybersecurity threats...",
    seoTitle: "Healthcare Cybersecurity in Africa – Hagion International",
    seoDescription: "Learn how African healthcare providers can safeguard patient data with modern cybersecurity practices.",
  },
  {
    id: "4",
    title: "Case Study: Building a Fintech App for East Africa",
    status: "Published",
    category: "Case study",
    date: "Mar 6, 2026",
    excerpt: "How Hagion partnered with a leading East African fintech to build a scalable mobile payments platform from the ground up.",
    content: "This case study explores the end-to-end development of a fintech application serving over 500,000 users across East Africa...",
    seoTitle: "Fintech App Development East Africa – Hagion International",
    seoDescription: "Read how Hagion built a scalable fintech app for East Africa's growing mobile payments market.",
  },
  {
    id: "5",
    title: "The Future of Digital Payments in Sub-Saharan Africa",
    status: "Draft",
    category: "Business",
    date: "Mar 6, 2026",
    excerpt: "An exploration of emerging digital payment trends and what they mean for businesses operating in Sub-Saharan Africa.",
    content: "Sub-Saharan Africa is rapidly becoming one of the world's most dynamic digital payments markets, driven by mobile penetration and a young population...",
    seoTitle: "Digital Payments Sub-Saharan Africa – Hagion International",
    seoDescription: "Explore the future of digital payments and fintech innovation across Sub-Saharan Africa.",
  },
];

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

export default function BlogPostsTable() {
  const [posts, setPosts] = useState<BlogPost[]>(mockPosts);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="bg-white border border-[#F1F5F9] rounded-[16px] overflow-hidden">
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`flex items-center justify-between px-6 py-4 ${
              index > 0 ? "border-t border-[#F8FAFC]" : ""
            }`}
            style={{ minHeight: "73.6px" }}
          >
            <div className="flex flex-col gap-1 min-w-0 flex-1 pr-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h4 className="text-[13px] font-semibold text-[#0F172A] leading-5">
                  {post.title}
                </h4>
                <StatusBadge status={post.status} />
              </div>
              <p className="text-[10.9px] font-normal text-[#64748B] leading-4">
                {post.category} · {post.date}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
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
                onClick={() => handleDelete(post.id)}
                aria-label="Delete post"
              >
                <TrashCan size={16} className="text-[#F87171]" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <EditPostModal
        post={editingPost}
        open={!!editingPost}
        onClose={() => setEditingPost(null)}
      />
    </div>
  );
}
