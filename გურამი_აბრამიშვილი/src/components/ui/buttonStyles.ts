export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-ring " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover active:bg-brand-hover disabled:hover:bg-brand",
  secondary: "border border-line bg-surface text-ink hover:bg-surface-2 disabled:hover:bg-surface",
  danger: "border border-danger/40 bg-surface text-danger hover:bg-danger/10 disabled:hover:bg-surface",
  ghost: "text-ink hover:bg-surface-2",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-11 px-3 text-sm", // 44px touch target on every screen
  md: "min-h-11 px-4 text-sm sm:text-base", // >= 44px touch target
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra = ""): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}
