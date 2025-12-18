import { supabase, SUPABASE_ANON_KEY } from "./supabase-admin.js";
import { checkAdmin } from "./admin-auth.js";

await checkAdmin();
const table = document.getElementById("users-table");

/* LOAD USERS */
async function loadUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role")
    .order("id");

  if (error) return console.error(error);

  table.innerHTML = "";
  data.forEach(u => {
    table.innerHTML += `
      <tr>
        <td>${u.id}</td>
        <td>
          <select onchange="changeRole('${u.id}', this.value)">
            <option value="admin" ${u.role==="admin"?"selected":""}>admin</option>
            <option value="directeur" ${u.role==="directeur"?"selected":""}>directeur</option>
            <option value="sous_directeur" ${u.role==="sous_directeur"?"selected":""}>sous_directeur</option>
            <option value="supervisor" ${u.role==="supervisor"?"selected":""}>supervisor</option>
            <option value="team_leader" ${u.role==="team_leader"?"selected":""}>team_leader</option>
            <option value="agent" ${u.role==="agent"?"selected":""}>agent</option>
          </select>
        </td>
        <td>
          <button onclick="deleteUser('${u.id}')">🗑</button>
        </td>
      </tr>
    `;
  });
}

/* ADD USER */
window.addUser = async () => {
  const email = document.getElementById("email").value;
  const role = document.getElementById("role").value;

  const res = await fetch(
    "https://wiovumauoaxrrrsjwkko.supabase.co/functions/v1/dynamic-handler",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email,
        role,
        full_name: "PENDING"
      })
    }
  );

  if (!res.ok) {
    alert("Error creating user");
    return;
  }

  alert("User created");
  loadUsers();
};

/* CHANGE ROLE */
window.changeRole = async (id, role) => {
  await supabase.from("profiles").update({ role }).eq("id", id);
};

/* DELETE USER */
window.deleteUser = async (id) => {
  alert("Delete via edge function later");
};

loadUsers();
