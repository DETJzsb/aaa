import { supabase } from "./supabase.js"

async function loadProfile() {
  const { data: { session } } = await supabase.auth.getSession()

  document.getElementById("p_name").textContent =
    session.user.user_metadata?.nom || "Root Admin"

  document.getElementById("p_email").textContent = session.user.email
  document.getElementById("p_id").textContent = session.user.id
}

window.logout = async () => {
  await supabase.auth.signOut()
  window.location.replace("login.html")
}

loadProfile()
