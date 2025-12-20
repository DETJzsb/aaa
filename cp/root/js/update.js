import { getJwt } from "./supabase.js"
import { loadUsers } from "./loadusers.js"

window.updateUser = async (id, oldRole) => {
  const newRole = prompt("New role", oldRole)
  if (!newRole) return

  const token = await getJwt()

  const res = await fetch(
    "https://wiovumauoaxrrrsjwkko.supabase.co/functions/v1/update-user",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: id,
        role: newRole
      })
    }
  )

  const data = await res.json()

  if (!res.ok) {
    alert(data.error)
  } else {
    loadUsers()
  }
}
