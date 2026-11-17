import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

// Generic container: whatever is placed inside arrives through props.children.
export default function Card({ children, className = "", ...rest }: CardProps) {
  return (
    <div className={`card p-4 sm:p-6 ${className}`} {...rest}>
      {children}
    </div>
  );
}
