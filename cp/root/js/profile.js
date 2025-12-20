import { supabase } from "./supabase.js"

const { data: { session } } = await supabase.auth.getSession()

document.getElementById("name").textContent =
  session.user.user_metadata?.nom || "Root"

document.getElementById("email").textContent = session.user.email
document.getElementById("id").textContent = session.user.id

window.logout = async () => {
  await supabase.auth.signOut()
  window.location.replace("login.html")
}
