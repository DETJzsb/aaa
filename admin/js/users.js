import { supabase, SUPABASE_ANON_KEY } from "./supabase-admin.js";
import { checkAdmin } from "./admin-auth.js";

/* =========================
   AUTH
========================= */
const adminId = await checkAdmin();

/* =========================
   ELEMENTS
========================= */
const tableBody = document.getElementById("users-table");

/* =========================
   AUDIT LOG
========================= */
async function log(action, targetId = null) {
  await supabase.from("audit_logs").insert({
    user_id: adminId,
    action,
    target_user: targetId,
    page: "users.html",
  });
}

/* =========================
   LOAD USERS
========================= */
async function loadUsers() {
  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, role")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  renderUsers(users);
}

/* =========================
   RENDER TABLE
========================= */
function renderUsers(users) {
  tableBody.innerHTML = "";

  users.forEach(u => {
    tableBody.innerHTML += `
      <tr>
        <td>${u.id}</td>

        <td>
          <select onchange="changeRole('${u.id}', this.value)">
            <option value="admin" ${u.role === "admin" ? "selected" : ""}>Admin</option>
            <option value="directeur" ${u.role === "directeur" ? "selected" : ""}>Directeur</option>
            <option value="sous-directeur" ${u.role === "sous-directeur" ? "selected" : ""}>Sous Directeur</option>
            <option value="supervisor" ${u.role === "supervisor" ? "selected" : ""}>Supervisor</option>
            <option value="team-leader" ${u.role === "team-leader" ? "selected" : ""}>Team Leader</option>
            <option value="agent" ${u.role === "agent" ? "selected" : ""}>Agent</option>
          </select>
        </td>

        <td>
          <button class="btn danger" onclick="deleteUser('${u.id}')">🗑</button>
        </td>
      </tr>
    `;
  });
}

/* =========================
   ADD USER (EDGE FUNCTION)
========================= */
window.addUser = async () => {
  try {
    const payload = {
      email: email.value.trim(),
      role: role.value,
      full_name: fullName.value.trim(),

      matricule: matricule?.value || null,
      department: department?.value || null,
      parts: parts?.value || null,
      part: part?.value || null,
      shift: shift?.value || null,
      line: line?.value || null,
      tel: tel?.value || null,
      whatsapp: whatsapp?.value || null,
    };

    if (!payload.email || !payload.full_name || !payload.role) {
      alert("Fill required fields");
      return;
    }

    const res = await fetch(
      "https://wiovumauoaxrrrsjwkko.supabase.co/functions/v1/admin-create-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw err;
    }

    const result = await res.json(); // ✅ fixed
    await log("CREATE_USER", result.user_id);

    alert("✅ User ajouté avec succès");
    closeModal();
    loadUsers();

  } catch (err) {
    console.error(err);
    alert("❌ Error adding user");
  }
};

/* =========================
   CHANGE ROLE
========================= */
window.changeRole = async (userId, newRole) => {
  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) {
    alert(error.message);
    return;
  }

  await log("CHANGE_ROLE", userId);
};

/* =========================
   DELETE USER (EDGE FUNCTION)
========================= */
window.deleteUser = async (userId) => {
  if (!confirm("Delete this user?")) return;

  const res = await fetch(
    "https://wiovumauoaxrrrsjwkko.supabase.co/functions/v1/admin-delete-user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ user_id: userId }),
    }
  );

  if (!res.ok) {
    alert("Delete failed");
    return;
  }

  await log("DELETE_USER", userId);
  loadUsers();
};

/* =========================
   INIT
========================= */
loadUsers();
