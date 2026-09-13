import { supabase } from "./supabase.js";
const root=document.querySelector("#model-detail"),id=new URLSearchParams(location.search).get("id");
async function init(){if(!id){root.innerHTML="<div class='error'>No model selected.</div>";return;}
 const {data:m,error}=await supabase.from("models").select("*").eq("id",id).eq("is_public",true).single();
 if(error){root.innerHTML="<div class='error'>Model not found.</div>";return;}
 root.innerHTML=`<section class="hero-card"><span class="tag">${esc(m.category)}</span><h1>${esc(m.name)}</h1><p class="lead">${esc(m.material_type||"Choose material when requesting a print")}</p></section>
 <section class="detail-grid"><div class="card"><h2>Estimated dimensions</h2><p>${m.width_mm??"—"} × ${m.depth_mm??"—"} × ${m.height_mm??"—"} mm</p></div>
 <div class="card"><h2>Estimated weight</h2><p>${m.estimated_weight_grams?Number(m.estimated_weight_grams).toFixed(1)+" g":"Pending 3D file analysis"}</p></div></section>
 <a class="button" href="printers.html">Find a printer</a>`;}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));} init();
