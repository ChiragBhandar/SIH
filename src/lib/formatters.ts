/**
 * Formatting utilities for Honey Chain platform
 */

export function formatDate(date: string | number | Date, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return "—";
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(d);
}

export function formatDateTime(date: string | number | Date): string {
  return formatDate(date, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatWeight(kilograms: number, unit: "kg" | "g" | "lbs" = "kg"): string {
  if (kilograms === undefined || kilograms === null || isNaN(kilograms)) return "0 kg";
  switch (unit) {
    case "g":
      return `${(kilograms * 1000).toLocaleString("en-US")} g`;
    case "lbs":
      return `${(kilograms * 2.20462).toFixed(2)} lbs`;
    case "kg":
    default:
      return `${kilograms.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 2 })} kg`;
  }
}

export function formatBatchId(id: string): string {
  if (!id) return "—";
  return id.toUpperCase();
}

export function truncateHash(hash: string, lead: number = 6, tail: number = 4): string {
  if (!hash) return "";
  if (hash.length <= lead + tail) return hash;
  return `${hash.slice(0, lead)}...${hash.slice(-tail)}`;
}
