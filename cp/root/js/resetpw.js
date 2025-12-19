import { supabase } from "./supabase.js"

window.resetPassword = async (id) => {
  if (!confirm("Reset password to drax123?")) return

  const { error } = await supabase.functions.invoke("reset-password", {
    body: { userId: id }
  })

  if (error) alert(error.message)
  else alert("Password reset")
}
