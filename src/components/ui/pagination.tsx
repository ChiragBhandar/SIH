import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
  className,
  ...props
}: PaginationProps) {
  const pages: (number | "ellipsis")[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (
      pages[pages.length - 1] !== "ellipsis" &&
      (i < currentPage - 1 || i > currentPage + 1)
    ) {
      pages.push("ellipsis");
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-4 py-2 sm:flex-row",
        className
      )}
      {...props}
    >
      <div className="text-xs text-muted-foreground">
        {totalItems !== undefined ? (
          <>
            Showing{" "}
            <span className="font-medium text-foreground">
              {Math.min((currentPage - 1) * (pageSize || 10) + 1, totalItems)}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {Math.min(currentPage * (pageSize || 10), totalItems)}
            </span>{" "}
            of <span className="font-medium text-foreground">{totalItems}</span> results
          </>
        ) : (
          `Page ${currentPage} of ${totalPages}`
        )}
      </div>

      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((page, idx) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="flex h-8 w-8 items-center justify-center text-muted-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <Button
              key={page}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={cn("h-8 w-8 p-0 text-xs", isActive && "font-semibold")}
              onClick={() => onPageChange(page)}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
