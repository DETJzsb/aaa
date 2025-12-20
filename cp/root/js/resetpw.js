import { getJwt } from "./supabase.js"

window.resetPassword = async (id) => {
  if (!confirm("Reset password to drax123?")) return

  const token = await getJwt()

  const res = await fetch(
    "https://wiovumauoaxrrrsjwkko.supabase.co/functions/v1/reset-password",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId: id })
    }
  )

  const data = await res.json()

  if (!res.ok) {
    alert(data.error)
  } else {
    alert("Password reset")
  }
}
