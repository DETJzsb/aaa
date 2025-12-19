import { supabase } from "./supabase.js"

window.updateUser = async (id, role) => {
  const newRole = prompt("New role", role)
  if (!newRole) return

  const { error } = await supabase.functions.invoke("update-user", {
    body: { userId: id, role: newRole }
  })

  if (error) alert(error.message)
  else location.reload()
}
