import Link from "next/link";
import { ArrowUpRight, ShieldAlert } from "lucide-react";

export default function UpgradeCard({
  message,
  limit,
  remaining,
}: {
  message?: string;
  limit: number;
  remaining: number;
}) {
  return (
    <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 shadow-sm">
      <div className="flex flex-wrap items-center gap-6">
        <div className="rounded-2xl bg-white/80 p-4 text-indigo-600">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Upgrade required
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">
            Daily contact limit reached
          </h2>
          <p className="text-slate-600">
            {message ??
              `You already viewed ${limit - remaining} contacts today. Upgrade to continue reaching out without interruption.`}
          </p>
        </div>
        <Link
          href="#"
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          View plans
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

