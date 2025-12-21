import { supabase } from "./supabase.js"
import { canEdit } from "./permissions.js"
import { loadSessionRole, currentRole } from "./session.js"

// main loader
export async function loadUsers(search = "") {
  await loadSessionRole()

  let query = supabase
    .from("users")
    .select(`
      id,
      nom,
      email,
      role,
      department,
      is_active,
      last_seen
    `)
    .order("created_at", { ascending: false })

  if (search) {
    query = query.ilike("nom", `%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error(error)
    return
  }

  const tbody = document.getElementById("users")
  tbody.innerHTML = ""

  data.forEach(u => {
    const tr = document.createElement("tr")

    // status dot
    const statusTd = document.createElement("td")
    statusTd.innerHTML = `
      <span class="dot ${u.is_active ? "online" : "offline"}"></span>
    `

    // name
    const nameTd = document.createElement("td")
    nameTd.textContent = u.nom || "-"

    // email
    const emailTd = document.createElement("td")
    emailTd.textContent = u.email

    // role
    const roleTd = document.createElement("td")
    roleTd.textContent = u.role

    // department
    const deptTd = document.createElement("td")
    deptTd.textContent = u.department || "-"

    // actions
    const actionsTd = document.createElement("td")

    if (canEdit(currentRole, u.role)) {
   actionsTd.innerHTML = `
  <div class="actions">
    <button class="action-btn reset"
      data-id="${u.id}"
      data-email="${u.email}">
      Reset
    </button>

    <button class="action-btn edit"
      data-id="${u.id}"
      data-role="${u.role}">
      Edit
    </button>

    <button class="action-btn delete"
      data-id="${u.id}">
      Delete
    </button>
  </div>
`

    } else {
      actionsTd.innerHTML = `<span style="color:#94a3b8">—</span>`
    }

    tr.append(
      statusTd,
      nameTd,
      emailTd,
      roleTd,
      deptTd,
      actionsTd
    )

    tbody.appendChild(tr)
  })
}

// realtime refresh
supabase
  .channel("users-realtime")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "users" },
    () => loadUsers(document.getElementById("search")?.value || "")
  )
  .subscribe()
