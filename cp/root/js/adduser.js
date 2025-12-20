window.addUser = async () => {
  const body = {
    nom: nom.value,
    email: email.value,
    role: role.value
  }

  const res = await fetch(
    "https://wiovumauoaxrrrsjwkko.supabase.co/functions/v1/add-user",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" ,
        "Authorization": `Bearer ${session.access_token}` },
      body: JSON.stringify(body)
    }
  )

  if (!res.ok) {
    alert("Error adding user")
    return
  }

  location.reload()
}
