import { loadUsers } from "./loadusers.js"

window.onload = () => {
  loadUsers()
}
import { supabase } from "./supabase.js"

window.goUsers = () => {
  window.location.href = "users.html"
}

window.logout = async () => {
  await supabase.auth.signOut()
  window.location.replace("login.html")
}

async function loadStats() {
  const { data: users } = await supabase.from("users").select("id, role, department")

  if (!users) return

  document.getElementById("totalUsers").textContent = users.length

  const departments = new Set(
    users.map(u => u.department).filter(Boolean)
  )

  const supervisors = users.filter(u => u.role === "supervisor")

  document.getElementById("totalDepartments").textContent = departments.size
  document.getElementById("totalSupervisors").textContent = supervisors.length
}

async function loadProfile() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return

  document.getElementById("rootEmail").textContent = session.user.email

  const name =
    session.user.user_metadata?.nom ||
    session.user.email.charAt(0).toUpperCase()

  document.getElementById("rootName").textContent = name
  document.getElementById("avatar").textContent = name[0]
}

loadProfile()
loadStats()
