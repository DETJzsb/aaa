import { supabase } from "./supabase-admin.js";
import { checkAdmin } from "./admin-auth.js";

await checkAdmin();

const { count: totalUsers } = await supabase
  .from("profiles")
  .select("*", { count: "exact", head: true });

const { count: agents } = await supabase
  .from("profiles")
  .select("*", { count: "exact", head: true })
  .eq("role", "agent");

const el = document.getElementById('total-users');
if (el) el.innerHTML = count;

  <p>Total Users: ${totalUsers}</p>
  <p>Agents: ${agents}</p>
`;
