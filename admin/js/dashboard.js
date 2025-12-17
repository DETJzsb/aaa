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
   FILTER STATE
========================= */
let allUsers = [];
let searchValue = "";
let filterConfirmed = "all";

/* =========================
   FETCH USERS
========================= */
async function fetchUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      role,
      department,
      confirmed,
      confirmed_at,
      confirmed_by,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  allUsers = data;
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
    elLastSignup.innerHTML = new Date(allUsers[0].created_at)
      .toLocaleString();
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
        <td>${u.email}</td>
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
   APPROVE USER (②)
========================= */
window.approveUser = async function (userId) {
  const { data: me } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("profiles")
    .update({
      confirmed: true,
      confirmed_at: new Date().toISOString(),
      confirmed_by: me.user.email
    })
    .eq("id", userId);

  if (error) {
    alert(error.message);
    return;
  }

  fetchUsers();
};

/* =========================
   FILTERS + SEARCH (③)
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
