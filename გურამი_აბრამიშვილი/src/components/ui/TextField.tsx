import { useId } from "react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const controlClasses =
  "block w-full min-h-11 rounded-lg border bg-surface px-3 py-2 text-base text-ink placeholder:text-muted " +
  "transition-colors hover:border-muted focus:border-brand focus:ring-2 focus:ring-brand/30 focus:outline-none " +
  "disabled:cursor-not-allowed disabled:opacity-60";

function borderFor(error: string | undefined): string {
  return error === undefined ? "border-line" : "border-danger";
}

interface FieldShellProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

function FieldShell({ id, label, error, hint, children }: FieldShellProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      {children}
      {/* The message line always reserves its height. If the error text were inserted only when it
          appears, the layout would jump on blur and a click on the submit button would be lost. */}
      <div className="mt-1 min-h-5">
        {hint !== undefined && error === undefined && <p className="text-xs text-muted">{hint}</p>}
        {error !== undefined && (
          <p id={`${id}-error`} role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function TextField({ label, error, hint, className = "", ...rest }: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <input
        id={id}
        aria-invalid={error !== undefined}
        aria-describedby={error !== undefined ? `${id}-error` : undefined}
        className={`${controlClasses} ${borderFor(error)} ${className}`}
        {...rest}
      />
    </FieldShell>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextAreaField({ label, error, className = "", ...rest }: TextAreaFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error}>
      <textarea
        id={id}
        aria-invalid={error !== undefined}
        aria-describedby={error !== undefined ? `${id}-error` : undefined}
        className={`${controlClasses} ${borderFor(error)} ${className}`}
        {...rest}
      />
    </FieldShell>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hideLabel?: boolean;
}

export function SelectField({ label, error, hideLabel = false, className = "", children, ...rest }: SelectFieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={hideLabel ? "sr-only" : "mb-1 block text-sm font-medium"}>
        {label}
      </label>
      <select
        id={id}
        aria-invalid={error !== undefined}
        className={`${controlClasses} ${borderFor(error)} ${className}`}
        {...rest}
      >
        {children}
      </select>
      <div className="mt-1 min-h-5">
        {error !== undefined && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
