import { supabase } from "./supabase-admin.js";
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
    .order("id");

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
    const email = document.getElementById("email").value.trim();
    const fullName = document.getElementById("fullName").value.trim();
    const role = document.getElementById("role").value;
    const department = document.getElementById("department").value || null;

    if (!email || !fullName || !role) {
      alert("Fill required fields");
      return;
    }

    const res = await fetch(
      "https://wiovumauoaxrrrsjwkko.supabase.co/functions/v1/admin-create-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("sb-access-token")}`,
        },
        body: JSON.stringify({
          email,
          full_name: fullName,
          role,
          department,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    // ✅ IMPORTANT: عرّفنا data هنا
    const result = await res.json();
    const newUserId = result.user_id; // Edge Function ترجع هكّا

    await log("CREATE_USER", newUserId);

    alert("User ajouté avec succès ✅");
    closeModal();
    loadUsers();

  } catch (err) {
    console.error(err);
    alert("Erreur lors de l'ajout de l'utilisateur");
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
   DELETE USER
========================= */
window.deleteUser = async (userId) => {
  if (!confirm("Delete this user?")) return;

  const res = await fetch(
    "https://wiovumauoaxrrrsjwkko.supabase.co/functions/v1/admin-delete-user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("sb-access-token")}`,
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
