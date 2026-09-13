import { supabase } from "./supabase.js";
const grid=document.querySelector("#printer-grid"), search=document.querySelector("#printer-search"), type=document.querySelector("#printer-type-filter");
async function load(){
  grid.innerHTML='<div class="loading">Loading printer owners…</div>';
  let q=supabase.from("printer_profiles").select("*").eq("active",true).order("last_confirmed_at",{ascending:false});
  if(type.value)q=q.eq("printer_type",type.value);
  const {data,error}=await q;if(error){grid.innerHTML=`<div class="error">${esc(error.message)}</div>`;return;}
  const t=search.value.trim().toLowerCase(), rows=(data||[]).filter(p=>!t||p.display_name.toLowerCase().includes(t)||p.printer_brand_model.toLowerCase().includes(t));
  grid.innerHTML=rows.length?rows.map(p=>`<article class="card"><span class="tag">${esc(p.printer_type)}</span><h2>${esc(p.display_name)}</h2><p>${esc(p.printer_brand_model)}</p><p><strong>£${Number(p.price_per_gram).toFixed(2)}/g</strong></p><p>Max: ${p.max_width_mm} × ${p.max_depth_mm} × ${p.max_height_mm} mm</p><p>Dispatch: ${esc(p.shipping_dispatch_time)}</p><a class="button secondary" href="printer.html?id=${p.id}">View profile</a></article>`).join(""):'<div class="empty-state"><h2>No printer owners found</h2><p>Try another search.</p></div>';
}
search.oninput=load;type.onchange=load;load();
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
