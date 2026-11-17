import type { ReactNode } from "react";

interface PageHeadingProps {
  title: string;
  subtitle?: string;
  children?: ReactNode; // optional actions on the right (props.children composition)
}

export default function PageHeading({ title, subtitle, children }: PageHeadingProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle !== undefined && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
