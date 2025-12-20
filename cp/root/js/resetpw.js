window.resetPw = async (id, email) => {
  if (!confirm("Reset password to drax123 ?")) return

  await fetch(
    "https://wiovumauoaxrrrsjwkko.supabase.co/functions/v1/reset-password",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email })
    }
  )

  alert("Password reset")
}
