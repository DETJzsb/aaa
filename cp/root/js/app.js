import {
  addUser,
  deleteUser,
  resetPassword,
  updateUser
} from "./services/users.service.js"

import { loadUsers } from "./loadusers.js"
import { showToast } from "./toast.js"

document.addEventListener("DOMContentLoaded", () => {
  loadUsers()
})

document.addEventListener("click", async (e) => {

  // DELETE
  if (e.target.classList.contains("delete")) {
    const id = e.target.dataset.id
    if (confirm("Delete this user?")) {
      await deleteUser(id)
      showToast("User deleted")
    }
  }

  // RESET
  if (e.target.classList.contains("reset")) {
    const id = e.target.dataset.id
    const email = e.target.dataset.email
    if (confirm("Reset password to drax123 ?")) {
      await resetPassword(id, email)
      showToast("Password reset")
    }
  }

  // EDIT ROLE
  if (e.target.classList.contains("edit")) {
    const id = e.target.dataset.id
    const oldRole = e.target.dataset.role
    const newRole = prompt("New role", oldRole)
    if (newRole) {
      await updateUser(id, newRole)
      showToast("Role updated")
    }
  }

})

// ADD USER (sidebar button)
document.getElementById("addUserBtn")?.addEventListener("click", async () => {
  const nom = prompt("Name?")
  const email = prompt("Email?")
  const role = prompt("Role?")

  if (!nom || !email || !role) return

  await addUser({ nom, email, role })
  showToast("User added")
})
