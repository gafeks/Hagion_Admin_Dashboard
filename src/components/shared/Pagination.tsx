"use client";

import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  selectedCount?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, totalItems, selectedCount = 0, onPageChange }: PaginationProps) {
  return (
    <motion.div
      className="flex items-center justify-end gap-2 py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="flex-1" />
      <span className="text-[14px] font-medium text-[#71717A]">
        {selectedCount} of {totalItems} row(s) selected.
      </span>
      <div className="flex-1 flex justify-end gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="px-3 h-9 bg-white border border-[#E4E4E7] rounded-md text-[14px] font-medium text-[#71717A] hover:bg-[#F9FAFB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="px-3 h-9 bg-white border border-[#E4E4E7] rounded-md text-[14px] font-medium text-[#71717A] hover:bg-[#F9FAFB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
