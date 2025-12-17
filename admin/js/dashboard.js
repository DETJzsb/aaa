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

document.getElementById("stats").innerHTML = `
  <p>Total Users: ${totalUsers}</p>
  <p>Agents: ${agents}</p>
`;
