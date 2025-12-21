import { supabase } from "./supabase.js"
import { startPresence } from "./presence.js"
import { loadCharts } from "./charts.js"

startPresence()

window.goUsers = ()=>location.href="users.html"
window.logout = async ()=>{
  await supabase.auth.signOut()
  location.href="login.html"
}

const { data } = await supabase.from("users").select("department")
totalUsers.textContent = data.length

const count = d => data.filter(u=>u.department===d).length
zsbCount.textContent=count("ZSB")
rsCount.textContent=count("R-S")
jisCount.textContent=count("JIS")
njisCount.textContent=count("N-JIS")

loadCharts()
