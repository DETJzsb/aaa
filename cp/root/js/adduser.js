import { supabase } from "./supabase.js"

window.addUser = async () => {
  const payload = {
    nom: nom.value,
    email: email.value,
    role: role.value,
    department: department.value || null,
    part: part.value || null,
    shift: shift.value || null,
    ligne: ligne.value || null
  }

  const { error } = await supabase.functions.invoke("add-user", {
    body: payload
  })

  if (error) alert(error.message)
  else {
    alert("User added")
    location.reload()
  }
}
