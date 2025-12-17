import { supabase } from "./supabase-admin.js";
import { checkAdmin } from "./admin-auth.js";

const adminId = await checkAdmin();

let allUsers = [];
let searchValue = "";

const ROLE_TABLE = {
  admin: "admin_details",
  directeur: "directeur_details",
  "sous-directeur": "sous_directeur_details",
  supervisor: "supervisor_details",
  agent: "agent_details",
};

/* ================= FETCH USERS ================= */
async function fetchUsers() {
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, role");

  const users = [];

  for (const p of profiles) {
    const table = ROLE_TABLE[p.role];
    let d = {};

    if (table) {
      const { data } = await supabase
        .from(table)
        .select("*")
        .eq("user_id", p.id)
        .maybeSingle();
      if (data) d = data;
    }

    users.push({
      id: p.id,
      role: p.role,
      full_name: d.full_name ?? "-",
      email: d.email ?? "-",
      department: d.department ?? "-",
      confirmed: d.confirmed ?? false,
    });
  }

  allUsers = users;
  render();
}

/* ================= RENDER ================= */
function render() {
  const tbody = document.getElementById("users-table");
  tbody.innerHTML = "";

  let list = allUsers;
  if (searchValue) {
    list = list.filter(u =>
      u.full_name.toLowerCase().includes(searchValue) ||
      u.email.toLowerCase().includes(searchValue)
    );
  }

  list.forEach(u => {
    tbody.innerHTML += `
      <tr>
        <td>${u.full_name}</td>
        <td>${u.email}</td>
        <td><span class="badge">${u.role}</span></td>
        <td>${u.department}</td>
        <td>${u.confirmed ? "YES" : "NO"}</td>
        <td class="actions">
          <select onchange="changeRole('${u.id}',this.value)">
            <option value="">Change role</option>
            ${Object.keys(ROLE_TABLE)
              .filter(r => r !== u.role)
              .map(r => `<option value="${r}">${r}</option>`)
              .join("")}
          </select>

          ${!u.confirmed
            ? `<button class="btn primary" onclick="confirmUser('${u.id}','${u.role}')">Confirm</button>`
            : ""}

          <button onclick="viewDetails('${u.id}')">Details</button>
          <button class="btn danger" onclick="askDelete('${u.id}')">🗑</button>
        </td>
      </tr>
    `;
  });
}

/* ================= ACTIONS ================= */
window.applySearch = () => {
  searchValue = searchInput.value.toLowerCase();
  render();
};

window.addUser = async () => {
  const name = fullName.value.trim();
  const mail = email.value.trim();
  const role = document.getElementById("role").value;
  const dep = department.value;

  const { data } = await supabase.auth.admin.createUser({
    email: mail,
    password: "Temp@1234",
    email_confirm: true,
  });

  const id = data.user.id;

  await supabase.from("profiles").insert({ id, role });
  await supabase.from(ROLE_TABLE[role]).insert({
    user_id: id,
    full_name: name,
    email: mail,
    department: dep || null,
    confirmed: true,
    confirmed_by: adminId,
  });

  closeModal();
  fetchUsers();
};

window.confirmUser = async (id, role) => {
  await supabase.from(ROLE_TABLE[role]).update({
    confirmed: true,
    confirmed_by: adminId,
    confirmed_at: new Date().toISOString(),
  }).eq("user_id", id);

  fetchUsers();
};

window.changeRole = async (id, newRole) => {
  const old = allUsers.find(u => u.id === id);

  await supabase.from(ROLE_TABLE[old.role]).delete().eq("user_id", id);
  await supabase.from("profiles").update({ role: newRole }).eq("id", id);
  await supabase.from(ROLE_TABLE[newRole]).insert({
    user_id: id,
    full_name: old.full_name,
    email: old.email,
    department: old.department !== "-" ? old.department : null,
    confirmed: false,
  });

  fetchUsers();
};

window.deleteUser = async (id) => {
  await supabase.auth.admin.deleteUser(id);
  fetchUsers();
};

window.viewDetails = (id) => {
  const u = allUsers.find(x => x.id === id);
  detailsContent.textContent = JSON.stringify(u, null, 2);
  detailsModal.classList.add("show");
};

/* ================= INIT ================= */
fetchUsers();
