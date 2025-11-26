import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import DashboardNav from "@/components/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="cursor-pointer">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Agency Intelligence
            </p>
            <p className="text-lg font-semibold text-slate-900">
              Municipal Outreach Dashboard
            </p>
          </div>
        </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
        <DashboardNav />
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}

