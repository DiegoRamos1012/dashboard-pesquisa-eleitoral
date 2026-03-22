interface SectionHeaderProps {
  title: string;
  description?: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="space-y-1">
      <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
        {title}
      </h2>
      {description ? (
        <p className="text-sm text-muted-foreground md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
