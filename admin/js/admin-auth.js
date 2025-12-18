import { supabase } from "./supabase-admin.js";

export async function checkAdmin() {
  /* =========================
     GET AUTH USER
  ========================= */
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    location.href = "login.html";
    throw new Error("Not authenticated");
  }

  /* =========================
     GET PROFILE ROLE
  ========================= */
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    location.href = "login.html";
    throw new Error("Profile not found");
  }

  /* =========================
     CHECK ADMIN
  ========================= */
  if (profile.role !== "admin") {
    alert("Access denied");
    location.href = "login.html";
    throw new Error("Not admin");
  }

  /* =========================
     RETURN ADMIN ID
  ========================= */
  return user.id;
}
