import { supabaseAdmin } from "./supabase-admin.js";
import { checkAdmin } from "./admin-auth.js";

const adminId = await checkAdmin();

async function log(action) {
  await supabaseAdmin.from("audit_logs").insert({
    user_id: adminId,
    action,
    page: "users.html",
  });
}

window.addUser = async () => {
  const { data } = await supabaseAdmin.auth.admin.createUser({
    email: email.value,
    password: password.value,
    email_confirm: true,
  });

  const id = data.user.id;

  await supabaseAdmin.from("profiles").insert({ id, role: role.value });
  await supabaseAdmin.from("user_departments").insert({
    user_id: id,
    department: department.value,
  });
  await supabaseAdmin.from("user_parts").insert({
    user_id: id,
    part: part.value,
    line: line.value,
    zone: zone.value,
  });

  await log("CREATE_USER");
  alert("User ajouté");
};

window.deleteUser = async () => {
  await supabaseAdmin.auth.admin.deleteUser(deleteId.value);
  await log("DELETE_USER");
  alert("User supprimé");
};

window.changeRole = async () => {
  await supabaseAdmin
    .from("profiles")
    .update({ role: newRole.value })
    .eq("id", roleId.value);

  await log("CHANGE_ROLE");
  alert("Role modifié");
};
