import { supabase } from "./supabase.js"

export async function logAction(action, targetId){
  const { data:{ session } } = await supabase.auth.getSession()
  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single()

  await supabase.from("audit_log").insert({
    actor_id: session.user.id,
    actor_role: data.role,
    action,
    target_id: targetId
  })
}
