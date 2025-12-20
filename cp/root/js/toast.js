export function toast(msg,type="info"){
  const t=document.createElement("div")
  t.className=`toast ${type}`
  t.textContent=msg
  document.body.append(t)
  setTimeout(()=>t.remove(),3000)
}
