"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const links = [
  { href: "/agencies", label: "Agencies" },
  { href: "/contacts", label: "Contacts" },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="border-t border-slate-100 bg-white">
      <div className="mx-auto flex max-w-6xl gap-2 px-6 py-2">
        {links.map((link) => {
          const isActive = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

