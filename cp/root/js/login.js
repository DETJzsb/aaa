import { supabase } from "./supabase.js"

window.login = async () => {
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    document.getElementById("error").textContent = error.message
    return
  }

  window.location.replace("index.html")
}
