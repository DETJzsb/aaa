import { supabase } from "./supabase-admin.js";
import { checkAdmin } from "./admin-auth.js";

await checkAdmin();

const { data } = await supabase
  .from("audit_logs")
  .select("*")
  .order("created_at", { ascending: false });

document.getElementById("logs").innerHTML = data
  .map(
    l => `<p>${l.created_at} | ${l.action} | ${l.page}</p>`
  )
  .join("");
