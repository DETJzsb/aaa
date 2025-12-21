import { supabase } from "./supabase.js"

export let currentRole = null

export async function loadSessionRole(){
  const { data:{ session } } = await supabase.auth.getSession()
  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single()
  currentRole = data.role
}
