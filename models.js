import { supabase } from "./supabase.js";
const grid=document.querySelector("#model-grid"),search=document.querySelector("#model-search"),cat=document.querySelector("#model-category");
async function load(){
  grid.innerHTML='<div class="loading">Loading models…</div>';
  let q=supabase.from("models").select("*").eq("is_public",true).order("created_at",{ascending:false});
  if(cat.value)q=q.eq("category",cat.value);
  const {data,error}=await q;if(error){grid.innerHTML=`<div class="error">${esc(error.message)}</div>`;return;}
  const t=search.value.trim().toLowerCase(),rows=(data||[]).filter(m=>!t||m.name.toLowerCase().includes(t)||m.category.toLowerCase().includes(t));
  grid.innerHTML=rows.length?rows.map(m=>`<article class="card"><div class="model-placeholder">3D</div><span class="tag">${esc(m.category)}</span><h2>${esc(m.name)}</h2><p>${esc(m.material_type||"Material chosen at print request")}</p><p>${m.estimated_weight_grams?Number(m.estimated_weight_grams).toFixed(1)+" g estimated":"Weight pending analysis"}</p><a class="button secondary" href="model.html?id=${m.id}">View model</a></article>`).join(""):'<div class="empty-state"><h2>No public models yet</h2><p>Shared models will appear here.</p></div>';
}
search.oninput=load;cat.onchange=load;load();
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
