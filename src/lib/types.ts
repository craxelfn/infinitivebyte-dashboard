export type Agency = {
  id: string;
  name: string;
  state: string;
  state_code: string;
  type: string;
  population?: number;
  website?: string;
  total_schools?: number;
  total_students?: number;
  mailing_address?: string;
  grade_span?: string;
  locale?: string;
  csa_cbsa?: string;
  domain_name?: string;
  physical_address?: string;
  phone?: string;
  status?: string;
  student_teacher_ratio?: number;
  supervisory_union?: string;
  county?: string;
  created_at?: string;
  updated_at?: string;
};

export type Contact = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  title?: string;
  department?: string;
  email_type?: string;
  contact_form_url?: string;
  created_at?: string;
  updated_at?: string;
  agency_id?: string;
  firm_id?: string;
};

export type ContactsApiResponse = {
  contacts: Contact[];
  remaining: number;
  limit: number;
  page: number;
  totalPages: number;
  pageSize: number;
  totalContacts: number;
  locked: boolean;
  message?: string;
};

