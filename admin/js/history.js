import { supabase } from "./supabase-admin.js";
import { checkAdmin } from "./admin-auth.js";

await checkAdmin();

const tableBody = document.getElementById("history-table");

if (!tableBody) {
  console.error("❌ history-table not found");
  throw new Error("Missing history-table in HTML");
}

const { data, error } = await supabase
  .from("audit_logs")
  .select("*")
  .order("created_at", { ascending: false });

if (error) {
  console.error(error);
} else {
  tableBody.innerHTML = "";

  data.forEach(log => {
    tableBody.innerHTML += `
      <tr>
        <td>${log.role ?? "-"}</td>
        <td>${log.action}</td>
        <td>${log.page}</td>
        <td>${new Date(log.created_at).toLocaleString()}</td>
        <td>
          user: ${log.user_id}<br>
          target: ${log.target_user ?? "-"}
        </td>
      </tr>
    `;
  });
}
