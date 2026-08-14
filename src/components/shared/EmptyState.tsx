import { DocumentBlank } from "@carbon/icons-react";

interface EmptyStateProps {
  title: string;
  description?: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16">
      <DocumentBlank size={32} className="text-[#94A3B8]" />
      <p className="text-[14px] font-medium text-[#0F172A]">{title}</p>
      {description && <p className="text-[13px] text-[#64748B]">{description}</p>}
    </div>
  );
}
