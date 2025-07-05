"use server";

import { cookies } from "next/headers";

interface CookieOptions {
  path?: string;
  httpOnly?: boolean;
  sameSite?: boolean | "lax" | "strict" | "none";
  secure?: boolean;
  maxAge?: number;
}

type CookieType =
  | "theme"
  | "session"
  | "language"
  | "age"
  | "darkMode"
  | "favorites"
  | "soundEnabled";

type ValuesMap = {
  theme: string;
  session: { token: string };
  language: string;
  soundEnabled: boolean;
  age: number;
  darkMode: boolean;
  favorites: string[];
};

interface Expiry {
  expires?: Date;
}

const cookieNameMap: Record<CookieType, string> = {
  theme: "re-up-themes",
  session: "user-session",
  language: "preferred-language",
  age: "user-age",
  darkMode: "dark-mode-enabled",
  favorites: "user-favorites",
  soundEnabled: "sound-enabled",
};

const defaults: CookieOptions = {
  path: "/",
  httpOnly: false,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

const cookieExpiryMap: Partial<Record<CookieType, number>> = {
  session: 60 * 60 * 24 * 7, // 7 days
  theme: 60 * 60 * 24 * 365, // 1 year
  age: 60 * 60 * 24 * 180, // 6 months
  darkMode: 60 * 60 * 24 * 30, // 30 days
};

/**
 * @name setCookie
 * @param CookieType
 * @param valuesMap
 * @param CookieOptions
 */
export const setCookie = async <T extends CookieType>(
  type: T,
  values: ValuesMap[T],
  options?: Partial<CookieOptions & Expiry>,
) => {
  const name = cookieNameMap[type];
  const store = await cookies();
  const value = JSON.stringify(values);
  const maxAge = options?.maxAge ?? cookieExpiryMap[type] ?? defaults.maxAge;
  store.set(name, value, { ...defaults, maxAge, ...options });
};

export const getCookie = async <T extends CookieType>(
  type: T,
): Promise<ValuesMap[T] | undefined> => {
  const name = cookieNameMap[type];
  const store = await cookies();
  const cookie = store.get(name);

  if (!cookie?.value) return undefined;

  try {
    return JSON.parse(cookie.value) as ValuesMap[T];
  } catch {
    // fallback if the value was stored without JSON
    return cookie.value as unknown as ValuesMap[T];
  }
};

export const deleteCookie = async (type: CookieType) => {
  const name = cookieNameMap[type];
  const store = await cookies();
  store.delete(name);
};
