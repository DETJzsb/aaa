import { supabase } from "./supabase.js"

const protect = async () => {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    window.location.replace("login.html")
    return
  }

  const { data } = await supabase
    .from("root")
    .select("id")
    .eq("id", session.user.id)
    .single()

  if (!data) {
    await supabase.auth.signOut()
    window.location.replace("login.html")
  }
}

protect()
