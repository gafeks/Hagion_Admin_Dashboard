import { WarningAlt } from "@carbon/icons-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  compact?: boolean;
}

export default function ErrorState({ message, onRetry, compact }: ErrorStateProps) {
  if (compact) {
    return <span className="text-[12px] text-[#D42620] text-center">{message}</span>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <WarningAlt size={32} className="text-[#D42620]" />
      <p className="text-[14px] text-[#5F6B7A]">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-[13px] font-medium text-[#2D2555] underline hover:text-[#231d45] transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
