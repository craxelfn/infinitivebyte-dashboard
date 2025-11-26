import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";

import {
  CONTACT_COOKIE_MAX_AGE,
  CONTACT_COOKIE_PREFIX,
  CONTACT_VIEWS_PER_DAY,
  CONTACTS_PAGE_SIZE,
} from "@/lib/constants";
import { getContacts } from "@/lib/data";
import type { ContactsApiResponse } from "@/lib/types";

type CookieState = {
  date: string;
  count: number;
};

const todayKey = () => new Date().toISOString().slice(0, 10);

const parseCookie = (value?: string): CookieState => {
  if (!value) {
    return { date: todayKey(), count: 0 };
  }

  try {
    const parsed = JSON.parse(value) as CookieState;
    if (parsed.date !== todayKey()) {
      return { date: todayKey(), count: 0 };
    }
    return parsed;
  } catch {
    return { date: todayKey(), count: 0 };
  }
};

export async function GET(request: NextRequest) {
  const authResult = await auth();

  if (!authResult.userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const cookieName = `${CONTACT_COOKIE_PREFIX}${authResult.userId}`;
  const cookieStore = await cookies();
  const cookieState = parseCookie(cookieStore.get(cookieName)?.value);

  const contacts = await getContacts();
  const totalPages = Math.max(
    1,
    Math.ceil(contacts.length / CONTACTS_PAGE_SIZE),
  );

  const url = new URL(request.url);
  const rawPage = url.searchParams.get("page");
  const parsedPage = Number(rawPage ?? 1);
  const currentPage = Number.isFinite(parsedPage)
    ? Math.min(Math.max(parsedPage, 1), totalPages)
    : 1;

  const startIndex = (currentPage - 1) * CONTACTS_PAGE_SIZE;
  const slice = contacts.slice(startIndex, startIndex + CONTACTS_PAGE_SIZE);

  const remainingBeforeRequest = Math.max(
    CONTACT_VIEWS_PER_DAY - cookieState.count,
    0,
  );

  const allowedCount =
    remainingBeforeRequest > 0
      ? Math.min(slice.length, remainingBeforeRequest)
      : 0;
  const visibleContacts = slice.slice(0, allowedCount);

  const updatedCookie: CookieState = {
    date: todayKey(),
    count: cookieState.count + visibleContacts.length,
  };

  const remainingAfterRequest = Math.max(
    CONTACT_VIEWS_PER_DAY - updatedCookie.count,
    0,
  );

  const response: ContactsApiResponse = {
    contacts: visibleContacts,
    remaining: remainingAfterRequest,
    limit: CONTACT_VIEWS_PER_DAY,
    page: currentPage,
    totalPages,
    pageSize: CONTACTS_PAGE_SIZE,
    totalContacts: contacts.length,
    locked: remainingBeforeRequest === 0,
    message:
      allowedCount === 0
        ? "Daily contact view limit reached. Upgrade to keep exploring."
        : undefined,
  };

  const jsonResponse = NextResponse.json(response);
  jsonResponse.cookies.set({
    name: cookieName,
    value: JSON.stringify(updatedCookie),
    maxAge: CONTACT_COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return jsonResponse;
}

