import type { ReactNode } from "react";
import Button from "./Button";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div role="alert" className="card flex flex-col items-center gap-3 px-4 py-10 text-center">
      <p className="text-lg font-semibold text-danger">Something went wrong</p>
      <p className="max-w-md text-sm text-muted">{message}</p>
      {onRetry !== undefined && (
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  children?: ReactNode; // optional action (link / button)
}

export function EmptyState({ title, children }: EmptyStateProps) {
  return (
    <div className="card flex flex-col items-center gap-4 px-4 py-12 text-center">
      <p className="text-lg font-semibold">{title}</p>
      {children}
    </div>
  );
}
