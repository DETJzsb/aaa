window.deleteUser = async (id) => {
  if (!confirm("Delete user?")) return

  await fetch(
    "https://wiovumauoaxrrrsjwkko.supabase.co/functions/v1/delete-user",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    }
  )

  location.reload()
}
