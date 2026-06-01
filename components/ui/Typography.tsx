import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span className={cn("text-[11px] font-bold uppercase tracking-[0.3em] text-gold mb-6 block", className)}>
      {children}
    </span>
  );
}

export function GoldDivider({ centered = false }: { centered?: boolean }) {
  return (
    <div 
      className={cn(
        "w-[80px] h-[1px] bg-gradient-gold my-8 opacity-60",
        centered && "mx-auto"
      )} 
    />
  );
}
