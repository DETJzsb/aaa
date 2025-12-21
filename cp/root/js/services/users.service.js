import { getJwt } from "./supabase.js"
import { loadUsers } from "./loadusers.js"

/* ======================
   ADD USER
====================== */
export async function addUser(payload) {
  const token = await getJwt()
  if (!token) throw new Error("Not authenticated")

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
    throw new Error(data.error || "Add user failed")
  }

  await loadUsers()
  return data
}

/* ======================
   DELETE USER
====================== */
export async function deleteUser(id) {
  const token = await getJwt()
  if (!token) throw new Error("Not authenticated")

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
    throw new Error(data.error || "Delete failed")
  }

  await loadUsers()
}

/* ======================
   RESET PASSWORD
====================== */
export async function resetPassword(id, email) {
  const token = await getJwt()
  if (!token) throw new Error("Not authenticated")

  const res = await fetch(
    "https://wiovumauoaxrrrsjwkko.supabase.co/functions/v1/reset-password",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id, email })
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || "Reset failed")
  }
}

/* ======================
   UPDATE USER ROLE
====================== */
export async function updateUser(id, role) {
  const token = await getJwt()
  if (!token) throw new Error("Not authenticated")

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
        role
      })
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || "Update failed")
  }

  await loadUsers()
}
