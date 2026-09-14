import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "sm" | "default" | "lg";
}

export function Section({
  className,
  spacing = "default",
  children,
  ...props
}: SectionProps) {
  const spacingClasses = {
    sm: "py-6",
    default: "py-10",
    lg: "py-16",
  };

  return (
    <section className={cn(spacingClasses[spacing], className)} {...props}>
      {children}
    </section>
  );
}
