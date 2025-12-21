import { supabase } from "./supabase.js"

export async function loadCharts(){
  const { data } = await supabase.from("users").select("role,department")
  draw("roleChart", group(data,"role"))
  draw("deptChart", group(data,"department"))
}

function group(arr,k){
  return arr.reduce((a,c)=>{
    if(!c[k])return a
    a[c[k]]=(a[c[k]]||0)+1
    return a
  },{})
}

function draw(id,data){
  const el=document.getElementById(id)
  el.innerHTML=""
  Object.entries(data).forEach(([k,v])=>{
    const b=document.createElement("div")
    b.className="bar"
    b.style.height=v*20+"px"
    b.textContent=k
    el.append(b)
  })
}
