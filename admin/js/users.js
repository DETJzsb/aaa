import { supabase } from "./supabase-admin.js";
import { checkAdmin } from "./admin-auth.js";

const adminId = await checkAdmin();

async function log(action) {
  await supabase.from("audit_logs").insert({
    user_id: adminId,
    action,
    page: "users.html",
  });
}

window.addUser = async () => {
  const { data } = await supabase.auth.admin.createUser({
    email: email.value,
    password: password.value,
    email_confirm: true,
  });

  const id = data.user.id;

  await supabase.from("profiles").insert({ id, role: role.value });
  await supabase.from("user_departments").insert({
    user_id: id,
    department: department.value,
  });
  await supabase.from("user_parts").insert({
    user_id: id,
    part: part.value,
    line: line.value,
    zone: zone.value,
  });

  await log("CREATE_USER");
  alert("User ajouté");
};

window.deleteUser = async () => {
  await supabase.auth.admin.deleteUser(deleteId.value);
  await log("DELETE_USER");
  alert("User supprimé");
};

window.changeRole = async () => {
  await supabase
    .from("profiles")
    .update({ role: newRole.value })
    .eq("id", roleId.value);

  await log("CHANGE_ROLE");
  alert("Role modifié");
};
