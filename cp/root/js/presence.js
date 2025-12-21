import { supabase } from "./supabase.js"

export async function startPresence(){
  const { data:{ session } } = await supabase.auth.getSession()
  if(!session) return

  const id = session.user.id

  await supabase.from("users")
    .update({ is_active:true, last_seen:new Date() })
    .eq("id", id)

  setInterval(()=>{
    supabase.from("users")
      .update({ last_seen:new Date() })
      .eq("id", id)
  },30000)

  window.addEventListener("beforeunload",()=>{
    supabase.from("users")
      .update({ is_active:false, last_seen:new Date() })
      .eq("id", id)
  })
}
