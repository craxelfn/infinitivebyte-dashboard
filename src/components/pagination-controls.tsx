"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import clsx from "clsx";

type PaginationProps = {
  page: number;
  totalPages: number;
  disabled?: boolean;
  basePath?: string;
};

export default function PaginationControls({
  page,
  totalPages,
  disabled = false,
  basePath,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPath = basePath ?? pathname;

  const canPrev = page > 1;
  const canNext = page < totalPages && !disabled;

  const buildHref = useMemo(() => {
    return (targetPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(targetPage));
      const queryString = params.toString();
      return queryString ? `${currentPath}?${queryString}` : currentPath;
    };
  }, [searchParams, currentPath]);

  const handleNav = (targetPage: number) => {
    if (targetPage < 1 || targetPage > totalPages) return;
    if (targetPage > page && disabled) return;
    router.push(buildHref(targetPage));
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
      <p className="text-slate-600">
        Page <span className="font-semibold text-slate-900">{page}</span> of{" "}
        <span className="font-semibold text-slate-900">{totalPages}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleNav(page - 1)}
          disabled={!canPrev}
          className={clsx(
            "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition",
            canPrev
              ? "border-slate-200 text-slate-700 hover:bg-slate-50"
              : "cursor-not-allowed border-slate-100 text-slate-400",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>
        <button
          type="button"
          onClick={() => handleNav(page + 1)}
          disabled={!canNext}
          className={clsx(
            "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition",
            canNext
              ? "border-slate-200 text-slate-700 hover:bg-slate-50"
              : "cursor-not-allowed border-slate-100 text-slate-400",
          )}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

