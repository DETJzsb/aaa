import { getJwt } from "./supabase.js"

window.resetPw = async (id, email) => {
  if (!confirm("Reset password to drax123 ?")) return

  const token = await getJwt()
  if (!token) return alert("Not authenticated")

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
    alert(data.error || "Reset failed")
  } else {
    alert("Password reset to drax123")
  }
}
