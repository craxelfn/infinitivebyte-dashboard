"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

import type { ContactsApiResponse, Contact } from "@/lib/types";
import UpgradeCard from "@/components/upgrade-card";

export default function ContactsClient() {
  const [data, setData] = useState<ContactsApiResponse | null>(null);
  const [pageRequest, setPageRequest] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchContacts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/contacts?page=${pageRequest}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load contacts");
        }

        const payload = (await response.json()) as ContactsApiResponse;

        if (!isMounted) {
          return;
        }

        setData(payload);
        setLoading(false);
      } catch (err) {
        if (!isMounted || controller.signal.aborted) {
          return;
        }
        setError(err instanceof Error ? err.message : "Unexpected error");
        setLoading(false);
      }
    };

    fetchContacts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [pageRequest]);

  const isInitialLoad = loading && !data;

  const currentPage = data?.page ?? 1;
  const totalPages = data?.totalPages ?? 1;

  const canPaginateForward =
    !!data && !data.locked && currentPage < totalPages && data.remaining > 0;
  const canPaginateBackward = !!data && currentPage > 1 && !data?.locked;

  const handleNext = () => {
    if (!canPaginateForward) return;
    setPageRequest(currentPage + 1);
  };

  const handlePrev = () => {
    if (!canPaginateBackward) return;
    setPageRequest(currentPage - 1);
  };

  if (isInitialLoad) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-100" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-4 w-full animate-pulse rounded bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
        <p className="font-semibold">Something went wrong</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  if (data.contacts.length === 0) {
    return (
      <UpgradeCard
        message={data.message}
        remaining={data.remaining}
        limit={data.limit}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-slate-600">Daily limit</p>
          <p className="text-2xl font-semibold text-slate-900">
            {data.limit - data.remaining}/{data.limit} contacts used today
          </p>
          <p className="text-xs text-slate-500">
            Served in batches of {data.pageSize} contacts
          </p>
        </div>
        <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          {data.remaining} remaining today
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
            <thead className="bg-slate-50 uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 text-slate-500">Name</th>
                <th className="px-4 py-3 text-slate-500">Title</th>
                <th className="px-4 py-3 text-slate-500">Email</th>
                <th className="px-4 py-3 text-slate-500">Email Type</th>
                <th className="px-4 py-3 text-slate-500">Phone</th>
                <th className="px-4 py-3 text-slate-500">Department</th>
                <th className="px-4 py-3 text-slate-500">Created</th>
                <th className="px-4 py-3 text-slate-500">Updated</th>
                <th className="px-4 py-3 text-slate-500">Agency ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.contacts.map((contact) => (
                <ContactRow key={contact.id} contact={contact} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
        <p className="text-slate-600">
          Page{" "}
          <span className="font-semibold text-slate-900">{currentPage}</span> of{" "}
          <span className="font-semibold text-slate-900">{totalPages}</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!canPaginateBackward || loading}
            className={clsx(
              "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 font-medium transition",
              canPaginateBackward && !loading
                ? "border-slate-200 text-slate-700 hover:bg-slate-50"
                : "cursor-not-allowed border-slate-100 text-slate-400",
            )}
          >
            Prev
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canPaginateForward || loading}
            className={clsx(
              "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 font-medium transition",
              canPaginateForward && !loading
                ? "border-slate-200 text-slate-700 hover:bg-slate-50"
                : "cursor-not-allowed border-slate-100 text-slate-400",
            )}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function ContactRow({ contact }: { contact: Contact }) {
  const fullName = `${contact.first_name} ${contact.last_name}`;
  const formatDate = (value?: string) =>
    value ? new Date(value).toLocaleDateString() : "—";

  return (
    <tr className="hover:bg-slate-50">
      <td className="px-4 py-3 font-medium text-slate-900">{fullName}</td>
      <td className="px-4 py-3 text-slate-600">{contact.title ?? "—"}</td>
      <td className="px-4 py-3">
        {contact.email ? (
          <a
            href={`mailto:${contact.email}`}
            className="text-indigo-600 underline decoration-dotted hover:decoration-solid"
          >
            {contact.email}
          </a>
        ) : (
          "—"
        )}
      </td>
      <td className="px-4 py-3 text-indigo-600">{contact.email_type ?? "—"}</td>
      <td className="px-4 py-3 text-slate-600">{contact.phone ?? "—"}</td>
      <td className="px-4 py-3 text-slate-600">{contact.department ?? "—"}</td>
      <td className="px-4 py-3 text-slate-500">{formatDate(contact.created_at)}</td>
      <td className="px-4 py-3 text-slate-500">{formatDate(contact.updated_at)}</td>
      <td className="px-4 py-3 text-[11px] text-slate-500">
        {contact.agency_id ?? "—"}
      </td>
    </tr>
  );
}
