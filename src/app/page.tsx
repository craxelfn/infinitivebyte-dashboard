import Link from "next/link";
import {
  ArrowRight,
  LineChart,
  ShieldCheck,
  Sparkles,
  TableProperties,
} from "lucide-react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const featureCards = [
  {
    title: "CSV ingestion",
    description:
      "The bundled agencies and contacts CSVs are parsed at runtime, so your data is always in sync without ETL work.",
    icon: TableProperties,
  },
  {
    title: "Quota aware",
    description:
      "Every user gets 50 verified contacts per day with upgrade prompts when the ceiling is hit.",
    icon: ShieldCheck,
  },
  {
    title: "Analytical view",
    description:
      "Sort and scan agencies with population data, counties, and quick links to official websites.",
    icon: LineChart,
  },
];

const stats = [
  { label: "Agencies monitored", value: "900+" },
  { label: "Contacts curated", value: "1,000+" },
  { label: "Daily outreach limit", value: "50 contacts" },
];

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col gap-16 overflow-hidden bg-linear-to-b from-indigo-50 via-white to-slate-50 px-6 py-16 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-12 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-200 blur-[140px] opacity-30" />
      </div>

      <section className="mx-auto flex max-w-4xl flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600 shadow-sm backdrop-blur">
          <Sparkles className="h-3 w-3" />
          Agency Intelligence
        </div>
        <h1 className="text-5xl font-semibold leading-tight text-slate-900 sm:text-6xl">
          Command center for public-sector outreach
        </h1>
        <p className="text-lg text-slate-600 sm:text-xl">
          Authenticate with Clerk to explore every agency in the dataset,
          monitor populations, and reach out to 50 curated contacts daily—all
          from a single dashboard experience.
        </p>
      </section>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-white shadow-xl shadow-slate-400/40 transition hover:-translate-y-0.5 hover:bg-slate-800">
              Launch dashboard
              <ArrowRight className="h-4 w-4" />
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-7 py-3 text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-slate-300">
              Create account
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/agencies"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-7 py-3 text-white shadow-xl shadow-indigo-400/40 transition hover:-translate-y-0.5 hover:bg-indigo-500"
            >
              Go to dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm backdrop-blur">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </SignedIn>
      </div>

      <section className="mx-auto grid max-w-4xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/60 bg-white/90 px-6 py-5 shadow-lg shadow-slate-200/60 backdrop-blur"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 text-left lg:grid-cols-3">
        {featureCards.map((card) => (
          <article
            key={card.title}
            className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/60"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/90 text-white">
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {card.title}
              </h2>
              <p className="mt-2 text-slate-600">{card.description}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
