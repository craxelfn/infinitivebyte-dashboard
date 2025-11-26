import PaginationControls from "@/components/pagination-controls";
import { getAgencies } from "@/lib/data";
import { AGENCY_ROWS_PER_PAGE } from "@/lib/constants";

type SearchParams =
  | Record<string, string | string[] | undefined>
  | Promise<Record<string, string | string[] | undefined>>;

type AgenciesPageProps = {
  searchParams?: SearchParams;
};

function isPromise<T>(value: unknown): value is Promise<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof (value as { then?: unknown }).then === "function"
  );
}

export default async function AgenciesPage({ searchParams }: AgenciesPageProps) {
  const agencies = await getAgencies();

  const resolvedSearchParams = searchParams
    ? isPromise<Record<string, string | string[] | undefined>>(searchParams)
      ? await searchParams
      : searchParams
    : {};

  const totalPages = Math.max(
    1,
    Math.ceil(agencies.length / AGENCY_ROWS_PER_PAGE),
  );

  const rawPage = Array.isArray(resolvedSearchParams.page)
    ? resolvedSearchParams.page[0]
    : resolvedSearchParams.page;
  const parsedPage = Number(rawPage ?? 1);
  const currentPage = Number.isFinite(parsedPage)
    ? Math.min(Math.max(parsedPage, 1), totalPages)
    : 1;

  const startIndex = (currentPage - 1) * AGENCY_ROWS_PER_PAGE;
  const pageItems = agencies.slice(
    startIndex,
    startIndex + AGENCY_ROWS_PER_PAGE,
  );

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">
            Agencies
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Coverage across the United States
          </h1>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
          {agencies.length.toLocaleString()} total agencies
        </div>
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
            <thead className="bg-slate-50 uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 text-slate-500">Name</th>
                <th className="px-4 py-3 text-slate-500">State</th>
                <th className="px-4 py-3 text-slate-500">Type</th>
                <th className="px-4 py-3 text-slate-500">Population</th>
                <th className="px-4 py-3 text-slate-500">Website</th>
                <th className="px-4 py-3 text-slate-500">Created</th>
                <th className="px-4 py-3 text-slate-500">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageItems.map((agency) => (
                <tr key={agency.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {agency.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                      {agency.state_code ?? agency.state}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{agency.type}</td>
                  <td className="px-4 py-3 text-slate-600 tabular-nums">
                    {agency.population?.toLocaleString() ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-indigo-600">
                    {agency.website ? (
                      <a
                        href={agency.website}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-dotted hover:decoration-solid"
                      >
                        Website
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {agency.created_at
                      ? new Date(agency.created_at).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {agency.updated_at
                      ? new Date(agency.updated_at).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PaginationControls
        page={currentPage}
        totalPages={totalPages}
        basePath="/agencies"
      />
    </section>
  );
}

