import { supabase } from "./supabase.js"

window.deleteUser = async (id) => {
  if (!confirm("Delete user?")) return

  const { error } = await supabase.functions.invoke("delete-user", {
    body: { userId: id }
  })

  if (error) alert(error.message)
  else location.reload()
}
