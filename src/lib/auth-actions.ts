"use server";

import { getSession as libGetSession, logout as libLogout } from "@/lib/auth";

export async function getSession() {
  return libGetSession();
}

export async function logout() {
  return libLogout();
}
