import { loadUsers } from "./loadusers.js"
import { startPresence } from "./presence.js"

startPresence()
window.goBack=()=>location.href="index.html"
search.oninput=()=>loadUsers(search.value)

loadUsers()
