import { loadUsers } from "./loadusers.js"

window.goBack = () => {
  window.location.href = "index.html"
}

window.onload = () => {
  loadUsers()
}
