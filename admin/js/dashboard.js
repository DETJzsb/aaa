import { supabase } from "./supabase-admin.js";
import { checkAdmin } from "./admin-auth.js";

await checkAdmin();

/* =========================
   ELEMENTS
========================= */
const tableBody = document.getElementById("dashboard-users-table");

const elTotal = document.getElementById("stat-total-users");
const elConfirmed = document.getElementById("stat-confirmed");
const elUnconfirmed = document.getElementById("stat-unconfirmed");
const elAdmins = document.getElementById("stat-admins");
const elAgents = document.getElementById("stat-agents");
const elLastSignup = document.getElementById("stat-last-signup");

/* =========================
   STATE
========================= */
let allUsers = [];
let searchValue = "";
let filterConfirmed = "all";

/* =========================
   ROLE → DETAILS TABLE
========================= */
const ROLE_TABLE = {
  admin: "admin_details",
  directeur: "directeur_details",
  sous_directeur: "sous_directeur_details",
  supervisor: "supervisor_details",
  team_leader: "team_leader_details",
  agent: "agent_details"
};

/* =========================
   FETCH USERS
========================= */
async function fetchUsers() {
  // 1️⃣ fetch profiles (ONLY id + role)
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Profiles error:", error);
    return;
  }

  const users = [];

  // 2️⃣ fetch role details
  for (const p of profiles) {
    const table = ROLE_TABLE[p.role];
    let details = {};

    if (table) {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("user_id", p.id)
        .maybeSingle();

      if (!error && data) {
        details = data;
      }
    }

    users.push({
      id: p.id,
      role: p.role,
      created_at: p.created_at,

      // confirmation FROM ROLE TABLE
      confirmed: details.confirmed ?? false,
      confirmed_at: details.confirmed_at ?? null,
      confirmed_by: details.confirmed_by ?? null,

      ...details
    });
  }

  allUsers = users;
  updateStats();
  renderTable();
}

/* =========================
   STATS
========================= */
function updateStats() {
  elTotal.innerHTML = allUsers.length;

  const confirmed = allUsers.filter(u => u.confirmed);
  const unconfirmed = allUsers.filter(u => !u.confirmed);

  elConfirmed.innerHTML = confirmed.length;
  elUnconfirmed.innerHTML = unconfirmed.length;

  elAdmins.innerHTML = allUsers.filter(u => u.role === "admin").length;
  elAgents.innerHTML = allUsers.filter(u => u.role === "agent").length;

  if (allUsers.length) {
    elLastSignup.innerHTML = new Date(allUsers[0].created_at).toLocaleString();
  }
}

/* =========================
   RENDER TABLE
========================= */
function renderTable() {
  tableBody.innerHTML = "";

  let filtered = [...allUsers];

  if (searchValue) {
    filtered = filtered.filter(u =>
      u.full_name?.toLowerCase().includes(searchValue) ||
      u.email?.toLowerCase().includes(searchValue)
    );
  }

  if (filterConfirmed !== "all") {
    filtered = filtered.filter(u =>
      filterConfirmed === "confirmed" ? u.confirmed : !u.confirmed
    );
  }

  filtered.forEach(u => {
    tableBody.innerHTML += `
      <tr>
        <td>${u.full_name ?? "-"}</td>
        <td>${u.email ?? "-"}</td>
        <td>${u.role}</td>
        <td>${u.department ?? "-"}</td>
        <td>
          ${
            u.confirmed
              ? `<span class="badge ok">YES</span>`
              : `<span class="badge off">NO</span>`
          }
        </td>
        <td>${u.confirmed_at ? new Date(u.confirmed_at).toLocaleString() : "-"}</td>
        <td>${u.confirmed_by ?? "-"}</td>
        <td>
          ${
            !u.confirmed
              ? `<button class="btn primary" onclick="approveUser('${u.id}')">
                    Confirm
                 </button>`
              : ""
          }
        </td>
      </tr>
    `;
  });
}

/* =========================
   APPROVE USER (ROLE CONFIRM)
========================= */
window.approveUser = async function (userId) {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  // نجيب role متاع الuser
  const current = allUsers.find(u => u.id === userId);
  if (!current) return;

  const table = ROLE_TABLE[current.role];
  if (!table) return;

  const { error } = await supabase
    .from(table)
    .update({
      confirmed: true,
      confirmed_at: new Date().toISOString(),
      confirmed_by: user.id
    })
    .eq("user_id", userId);

  if (error) {
    alert(error.message);
    return;
  }

  fetchUsers();
};

/* =========================
   FILTERS
========================= */
window.searchUsers = function (val) {
  searchValue = val.toLowerCase();
  renderTable();
};

window.filterUsers = function (val) {
  filterConfirmed = val;
  renderTable();
};

/* =========================
   INIT
========================= */
fetchUsers();
