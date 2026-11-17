import { Link } from "react-router-dom";
import type { LinkProps } from "react-router-dom";
import { buttonClasses } from "./buttonStyles";
import type { ButtonSize, ButtonVariant } from "./buttonStyles";

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export default function ButtonLink({ variant = "primary", size = "md", className = "", ...rest }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, size, className)} {...rest} />;
}
