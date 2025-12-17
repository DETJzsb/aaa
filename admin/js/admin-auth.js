import { supabase } from "./supabase-admin.js";

export async function checkAdmin() {
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) {
    location.href = "login.html";
    return;
  }

  const userId = sessionData.session.user.id;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (!profile || profile.role !== "admin") {
    location.href = "login.html";
  }

  return userId;
}
