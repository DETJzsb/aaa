import { supabase } from "./supabase.js"

export async function loadUsers() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    alert(error.message)
    return
  }

  const tbody = document.getElementById("users")
  tbody.innerHTML = ""

  data.forEach(u => {
    tbody.innerHTML += `
      <tr>
        <td>${u.nom}</td>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td>
          <button onclick="resetPassword('${u.id}')">Reset</button>
          <button onclick="updateUser('${u.id}','${u.role}')">Edit</button>
          <button onclick="deleteUser('${u.id}')">Delete</button>
        </td>
      </tr>
    `
  })
}

loadUsers()
