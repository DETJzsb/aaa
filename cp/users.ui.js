// ui/users.ui.js
import { loadSessionRole, currentRole } from "../core/session.js"
import { canEdit } from "../core/permissions.js"
import { supabase } from "../core/supabase.js"

export async function loadUsers(filters={}){
  await loadSessionRole()

  let q = supabase.from("users").select("*")

  if(filters.search){
    q = q.or(
      `nom.ilike.%${filters.search}%,
       email.ilike.%${filters.search}%,
       matricule.ilike.%${filters.search}%`
    )
  }
  if(filters.department) q = q.eq("department", filters.department)
  if(filters.role) q = q.eq("role", filters.role)

  const { data } = await q
  renderUsers(data)
}

function renderUsers(data){
  users.innerHTML=""
  data.forEach(u=>{
    users.innerHTML+=`
      <tr>
        <td>${u.nom||"-"}</td>
        <td>${u.matricule||"-"}</td>
        <td>${u.email}</td>
        <td>${u.department||"-"}</td>
        <td>${u.role}</td>
        <td>
          ${
            canEdit(currentRole,u.role)
            ? `
              <button class="edit" data-id="${u.id}" data-role="${u.role}">Edit</button>
              <button class="reset" data-id="${u.id}" data-email="${u.email}">Reset</button>
              <button class="delete" data-id="${u.id}">Delete</button>
            `
            : "—"
          }
        </td>
      </tr>
    `
  })
}
