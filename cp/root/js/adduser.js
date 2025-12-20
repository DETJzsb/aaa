import { getJwt } from "./supabase.js"
import { loadUsers } from "./loadusers.js"

window.addUser = async () => {
  const token = await getJwt()
  if (!token) return alert("Not authenticated")

  const payload = {
    nom: nom.value,
    email: email.value,
    role: role.value,
    department: department.value || null,
    part: part.value || null,
    shift: shift.value || null,
    ligne: ligne.value || null
  }

  const res = await fetch(
    "https://wiovumauoaxrrrsjwkko.supabase.co/functions/v1/add-user",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  )

  const data = await res.json()

  if (!res.ok) {
    alert(data.error || "Add user failed")
  } else {
    alert("User added")
    loadUsers()
  }
}
