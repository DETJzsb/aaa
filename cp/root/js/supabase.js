import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

export const supabase = createClient(
  "https://wiovumauoaxrrrsjwkko.supabase.co",
  "sb_publishable_RR7nRUaRjq0qnAm1r0H1sg_HOauofxw"
)

// ترجع JWT أو ترجع للـ login
export async function getJwt() {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    window.location.href = "login.html"
    throw new Error("Not authenticated")
  }

  return session.access_token
}
