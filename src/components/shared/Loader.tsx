interface LoaderProps {
  compact?: boolean;
}

export default function Loader({ compact }: LoaderProps) {
  const spinner = (
    <div
      className={`${compact ? "w-4 h-4 border-2" : "w-8 h-8 border-[3px]"} rounded-full border-[#2D2555]/20 border-t-[#2D2555] animate-spin`}
    />
  );

  if (compact) return spinner;

  return <div className="flex items-center justify-center py-16">{spinner}</div>;
}
