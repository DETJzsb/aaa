import { supabase } from "./supabase.js"

async function checkRootAccess() {
  // 1️⃣ Check session
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    window.location.href = "login.html"
    return
  }

  // 2️⃣ Check if user is root
  const { data, error } = await supabase
    .from("root")
    .select("id")
    .eq("id", session.user.id)
    .single()

  if (error || !data) {
    alert("Access denied")
    await supabase.auth.signOut()
    window.location.href = "login.html"
  }
}

checkRootAccess()
