import ContactsClient from "./contacts-client";

export default function ContactsPage() {
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">
            Contacts
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Daily outreach limit enforced
          </h1>
          <p className="text-slate-600">
            You can view up to 50 contacts every day. When you reach the quota,
            you&apos;ll be prompted to upgrade.
          </p>
        </div>
      </header>

      <ContactsClient />
    </section>
  );
}

