import { supabase } from "./supabase.js"

async function protect() {
  const { data: { session } } = await supabase.auth.getSession()

  // مش logged
  if (!session) {
    window.location.replace("login.html")
    return
  }

  // مش root
  const { data, error } = await supabase
    .from("root")
    .select("id")
    .eq("id", session.user.id)
    .single()

  if (error || !data) {
    await supabase.auth.signOut()
    window.location.replace("login.html")
  }
}

protect()
