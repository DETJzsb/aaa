import { supabase, SUPABASE_ANON_KEY } from "./supabase-admin.js";
import { checkAdmin } from "./admin-auth.js";

await checkAdmin();
const table = document.getElementById("users-table");
const fixed = document.getElementById("fixedFields");

/* =========================
   ROLE FORM LOGIC
========================= */
window.handleRole = () => {
  const role = document.getElementById("role").value;
  fixed.innerHTML = "";

  if (["sous_directeur","supervisor","team_leader","agent"].includes(role)) {
    fixed.innerHTML += `<input id="matricule" placeholder="Matricule *">`;
  }

  if (["sous_directeur","supervisor","team_leader","agent"].includes(role)) {
    fixed.innerHTML += `
      <select id="department">
        <option>ZSB</option>
        <option>JIS</option>
        <option>N-JIS</option>
        <option>R-S</option>
      </select>`;
  }

  if (["supervisor","team_leader"].includes(role)) {
    fixed.innerHTML += `
      <label><input type="checkbox" value="BASIS"> BASIS</label>
      <label><input type="checkbox" value="COCPIT"> COCPIT</label>
      <label><input type="checkbox" value="INR"> INR</label>
      <label><input type="checkbox" value="THS"> THS</label>
      <label><input type="checkbox" value="MM"> MM</label>`;
  }

  if (role === "team_leader") {
    fixed.innerHTML += `<input id="shift" placeholder="Shift">`;
  }
};

/* =========================
   LOAD USERS
========================= */
async function loadUsers() {
  const { data } = await supabase.from("profiles").select("id, role");
  table.innerHTML = "";
  data.forEach(u => {
    table.innerHTML += `<tr><td>${u.id}</td><td>${u.role}</td></tr>`;
  });
}

/* =========================
   ADD USER
========================= */
window.addUser = async () => {
  const role = document.getElementById("role").value;
  const email = document.getElementById("email").value;

  const parts = [...document.querySelectorAll("input[type=checkbox]:checked")]
    .map(c => c.value);

  const payload = {
    email,
    role,
    matricule: matricule?.value || null,
    department: department?.value || null,
    parts: parts.length ? parts : null,
    shift: shift?.value || null
  };

  // ✅ جيب session متاع الadmin
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    alert("Session expired, please login again");
    return;
  }

  const res = await fetch(
    "https://wiovumauoaxrrrsjwkko.supabase.co/functions/v1/dynamic-handler",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    console.error(err);
    alert("Error creating user");
    return;
  }

  alert("✅ User added");
  loadUsers();
};


loadUsers();
