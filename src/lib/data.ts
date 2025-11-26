import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { parse } from "csv-parse/sync";

import type { Agency, Contact } from "./types";

const dataRoot =
  process.env.DATA_DIR ?? path.join(process.cwd(), "..");

const AGENCY_CSV = path.join(dataRoot, "agencies_agency_rows.csv");
const CONTACT_CSV = path.join(dataRoot, "contacts_contact_rows.csv");

async function readCsvRows<T>(filePath: string) {
  const fileContent = await fs.readFile(filePath, "utf-8");
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as T[];
}

const parseNumber = (value?: string | number | null) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};

const cleanString = (value?: string | null) => {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const getAgencies = cache(async (): Promise<Agency[]> => {
  const rows = await readCsvRows<Record<string, string>>(AGENCY_CSV);
  return rows
    .map((row) => ({
      id: row.id,
      name: row.name,
      state: row.state,
      state_code: row.state_code,
      type: row.type,
      population: parseNumber(row.population),
      website: cleanString(row.website),
      total_schools: parseNumber(row.total_schools),
      total_students: parseNumber(row.total_students),
      mailing_address: cleanString(row.mailing_address),
      grade_span: cleanString(row.grade_span),
      locale: cleanString(row.locale),
      csa_cbsa: cleanString(row.csa_cbsa),
      domain_name: cleanString(row.domain_name),
      physical_address: cleanString(row.physical_address),
      phone: cleanString(row.phone),
      status: cleanString(row.status),
      student_teacher_ratio: parseNumber(row.student_teacher_ratio),
      supervisory_union: cleanString(row.supervisory_union),
      county: cleanString(row.county),
      created_at: cleanString(row.created_at),
      updated_at: cleanString(row.updated_at),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
});

export const getContacts = cache(async (): Promise<Contact[]> => {
  const rows = await readCsvRows<Record<string, string>>(CONTACT_CSV);
  return rows
    .map((row) => ({
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      phone: cleanString(row.phone),
      title: cleanString(row.title),
      department: cleanString(row.department),
      email_type: cleanString(row.email_type),
      contact_form_url: cleanString(row.contact_form_url),
      created_at: cleanString(row.created_at),
      updated_at: cleanString(row.updated_at),
      agency_id: cleanString(row.agency_id),
      firm_id: cleanString(row.firm_id),
    }))
    .sort((a, b) =>
      `${a.first_name}${a.last_name}`.localeCompare(
        `${b.first_name}${b.last_name}`,
      ),
    );
});

