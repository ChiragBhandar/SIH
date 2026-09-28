import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BrandLogoProps {
  /**
   * "full" displays the complete BeeTech logo (Bee mark + BeeTech typography).
   * "mark" displays only the tech bee icon.
   */
  variant?: "full" | "mark";
  /**
   * Standard sizing presets:
   * - "xs": height 24px (h-6)
   * - "sm": height 28px (h-7)
   * - "md": height 36px (h-9)
   * - "lg": height 44px (h-11)
   * - "xl": height 56px (h-14)
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /**
   * If provided, wraps the logo in a Next.js Link.
   */
  href?: string;
  /**
   * Additional subtitle text displayed next to the logo with a clean separator.
   */
  subtitle?: string;
  /**
   * Next.js image loading priority. Default true for above-the-fold logos.
   */
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}

const SIZE_MAP = {
  full: {
    xs: { height: 24, width: 85, class: "h-6 w-auto" },
    sm: { height: 28, width: 99, class: "h-7 w-auto" },
    md: { height: 36, width: 127, class: "h-9 w-auto" },
    lg: { height: 44, width: 155, class: "h-11 w-auto" },
    xl: { height: 56, width: 198, class: "h-14 w-auto" },
  },
  mark: {
    xs: { height: 24, width: 32, class: "h-6 w-auto" },
    sm: { height: 28, width: 37, class: "h-7 w-auto" },
    md: { height: 36, width: 48, class: "h-9 w-auto" },
    lg: { height: 44, width: 59, class: "h-11 w-auto" },
    xl: { height: 56, width: 75, class: "h-14 w-auto" },
  },
};

export function BrandLogo({
  variant = "full",
  size = "md",
  href,
  subtitle,
  priority = true,
  className,
  imageClassName,
}: BrandLogoProps) {
  const config = SIZE_MAP[variant][size];
  const src = variant === "mark" ? "/logo-mark.png" : "/logo.png";
  const alt = variant === "mark" ? "BeeTech Mark" : "BeeTech";

  const content = (
    <div className={cn("inline-flex items-center gap-3 select-none", className)}>
      <Image
        src={src}
        alt={alt}
        width={config.width}
        height={config.height}
        priority={priority}
        className={cn(
          config.class,
          "object-contain transition-transform duration-200 group-hover:scale-[1.02]",
          imageClassName
        )}
      />
      {subtitle && (
        <span className="hidden sm:inline-block border-l border-border/80 pl-2.5 text-[9.5px] uppercase font-mono tracking-widest text-muted-foreground font-semibold">
          {subtitle}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex items-center transition-opacity hover:opacity-95">
        {content}
      </Link>
    );
  }

  return content;
}
