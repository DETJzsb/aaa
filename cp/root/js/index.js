import { supabase } from "./supabase.js"

async function loadUsers() {
  const { data } = await supabase.from("users").select("*")

  const table = document.getElementById("users")
  table.innerHTML = `
    <tr>
      <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
    </tr>
  `

  data.forEach(u => {
    table.innerHTML += `
      <tr>
        <td>${u.nom}</td>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td>
          <button onclick="deleteUser('${u.id}')">❌</button>
          <button onclick="resetPw('${u.id}','${u.email}')">🔑</button>
        </td>
      </tr>
    `
  })
}

window.onload = loadUsers
