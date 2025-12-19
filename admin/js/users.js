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
  try {
    // 1️⃣ جيب session
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      alert("Session expired, please login again");
      return;
    }

    // 2️⃣ حضّر payload
    const payload = {
      email: email.value.trim(),
      role: role.value,
      full_name: full_name.value.trim(),

      matricule: matricule?.value || null,
      department: department?.value || null,
      parts: parts?.value || null,
      shift: shift?.value || null,
    };

    if (!payload.email || !payload.role || !payload.full_name) {
      alert("Missing required fields");
      return;
    }

    console.log("PAYLOAD", payload);
    console.log("JWT", session.access_token);

    // 3️⃣ Call Edge Function
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

    const data = await res.json();

    if (!res.ok) {
      console.error(data);
      alert(data.error || "Error creating user");
      return;
    }

    alert("✅ User created");
    loadUsers();

  } catch (err) {
    console.error(err);
    alert("Unexpected error");
  }
};

loadUsers();
