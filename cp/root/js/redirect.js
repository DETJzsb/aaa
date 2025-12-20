import { supabase } from "./supabase.js"

async function protectPage() {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    window.location.href = "login.html"
    return
  }

  const { data, error } = await supabase
    .from("root")
    .select("id")
    .eq("id", session.user.id)
    .single()

  if (error || !data) {
    await supabase.auth.signOut()
    alert("Access denied")
    window.location.href = "login.html"
  }
}

protectPage()
