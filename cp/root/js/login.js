import { supabase } from "./supabase.js"
import { toast } from "./toast.js"

window.login = async () => {
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  if (!email || !password) {
    toast("Fill all fields","error")
    return
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    toast("Invalid credentials","error")
    return
  }

  toast("Welcome back","success")
  setTimeout(()=>{
    window.location.href = "index.html"
  },700)
}
