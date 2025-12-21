// services/users.service.js
import { supabase } from "../core/supabase.js"
import { logAction } from "./audit.service.js"

export async function addUser(user){
  const { data, error } = await supabase
    .from("users")
    .insert(user)

  if(error) throw error
  await logAction("ADD_USER", data[0].id)
}

export async function deleteUser(id){
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", id)

  if(error) throw error
  await logAction("DELETE_USER", id)
}

export async function resetPassword(id,email){
  // حسب السيستام متاعك
  await logAction("RESET_PASSWORD", id)
}

export async function updateUser(id, role){
  const { error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", id)

  if(error) throw error
  await logAction("UPDATE_ROLE", id)
}

