import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

function Progress({ className, value, ...props }: ProgressProps) {
  const bounded = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
        className,
      )}
      {...props}
    >
      <div
        className="h-full bg-primary transition-all"
        style={{ width: `${bounded}%` }}
      />
    </div>
  );
}

export { Progress };
