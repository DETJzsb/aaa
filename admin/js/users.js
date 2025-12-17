import { supabase } from "./supabase-admin.js";
import { checkAdmin } from "./admin-auth.js";

const adminId = await checkAdmin();

/* =========================
   STATE
========================= */
let allUsers = [];
let searchValue = "";

/* =========================
   ROLE TABLE MAP
========================= */
const ROLE_TABLE = {
  admin: "admin_details",
  directeur: "directeur_details",
  "sous-directeur": "sous_directeur_details",
  supervisor: "supervisor_details",
  agent: "agent_details",
};

/* =========================
   FETCH USERS
========================= */
async function fetchUsers() {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, role");

  if (error) {
    console.error(error);
    return;
  }

  const users = [];

  for (const p of profiles) {
    const table = ROLE_TABLE[p.role];
    let details = {};

    if (table) {
      const { data } = await supabase
        .from(table)
        .select("*")
        .eq("user_id", p.id)
        .maybeSingle();

      if (data) details = data;
    }

    users.push({
      id: p.id,
      role: p.role,
      confirmed: details.confirmed ?? false,
      full_name: details.full_name ?? "-",
      email: details.email ?? "-",
      department: details.department ?? "-",
    });
  }

  allUsers = users;
  renderUsers();
}

/* =========================
   RENDER
========================= */
function renderUsers() {
  const tbody = document.getElementById("users-table");
  tbody.innerHTML = "";

  let filtered = [...allUsers];

  if (searchValue) {
    filtered = filtered.filter(u =>
      u.full_name.toLowerCase().includes(searchValue) ||
      u.email.toLowerCase().includes(searchValue)
    );
  }

  filtered.forEach(u => {
    tbody.innerHTML += `
      <tr>
        <td>${u.full_name}</td>
        <td>${u.email}</td>
        <td>
          <select onchange="changeRole('${u.id}', this.value)">
            ${Object.keys(ROLE_TABLE)
              .map(r =>
                `<option value="${r}" ${r === u.role ? "selected" : ""}>${r}</option>`
              )
              .join("")}
          </select>
        </td>
        <td>${u.department}</td>
        <td>
          ${
            u.confirmed
              ? `<span class="badge ok">YES</span>`
              : `<button class="btn primary" onclick="confirmUser('${u.id}','${u.role}')">Confirm</button>`
          }
        </td>
        <td>
          <button class="danger" onclick="deleteUser('${u.id}')">🗑</button>
        </td>
      </tr>
    `;
  });
}

/* =========================
   ACTIONS
========================= */
window.searchUsers = val => {
  searchValue = val.toLowerCase();
  renderUsers();
};

window.confirmUser = async (userId, role) => {
  const table = ROLE_TABLE[role];

  await supabase.from(table).update({
    confirmed: true,
    confirmed_at: new Date().toISOString(),
    confirmed_by: adminId,
  }).eq("user_id", userId);

  fetchUsers();
};

window.changeRole = async (userId, newRole) => {
  await supabase.from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  await log("CHANGE_ROLE");
  fetchUsers();
};

window.deleteUser = async (userId) => {
  if (!confirm("Delete this user?")) return;

  await supabase.auth.admin.deleteUser(userId);
  await log("DELETE_USER");

  fetchUsers();
};

/* =========================
   AUDIT
========================= */
async function log(action) {
  await supabase.from("audit_logs").insert({
    user_id: adminId,
    action,
    page: "users.html",
  });
}

/* =========================
   INIT
========================= */
fetchUsers();
