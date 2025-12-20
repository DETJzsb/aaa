import { getJwt } from "./supabase.js"
import { loadUsers } from "./loadusers.js"

window.deleteUser = async (id) => {
  if (!confirm("Delete this user?")) return

  const token = await getJwt()
  if (!token) return alert("Not authenticated")

  const res = await fetch(
    "https://wiovumauoaxrrrsjwkko.supabase.co/functions/v1/delete-user",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    }
  )

  const data = await res.json()

  if (!res.ok) {
    alert(data.error || "Delete failed")
  } else {
    loadUsers()
  }
}
