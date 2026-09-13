import { supabase } from "./supabase.js";
const root=document.querySelector("#printer-profile"),id=new URLSearchParams(location.search).get("id");
async function init(){
  if(!id){root.innerHTML="<div class='error'>No printer selected.</div>";return;}
  const {data:p,error}=await supabase.from("printer_profiles").select("*").eq("id",id).eq("active",true).single();
  if(error){root.innerHTML="<div class='error'>Printer profile not found.</div>";return;}
  const {data:ms}=await supabase.from("printer_materials").select("material").eq("printer_id",id);
  const {data:ns}=await supabase.from("printer_nozzles").select("nozzle_size_mm").eq("printer_id",id);
  const {data:c}=await supabase.from("printer_capabilities").select("*").eq("printer_id",id).maybeSingle();
  const {data:rs}=await supabase.from("reviews").select("rating,review_text,created_at").eq("printer_id",id).order("created_at",{ascending:false});
  const avg=rs?.length?rs.reduce((a,r)=>a+r.rating,0)/rs.length:0;
  root.innerHTML=`<section class="hero-card"><span class="tag">${esc(p.printer_type)}</span><h1>${esc(p.display_name)}</h1><p class="lead">${esc(p.printer_brand_model)}</p><p class="rating">${avg?avg.toFixed(1)+"/5":"No ratings yet"} ${rs?.length?`(${rs.length} reviews)`:""}</p></section>
  <section class="detail-grid"><div class="card"><h2>Pricing</h2><p>£${Number(p.price_per_gram).toFixed(2)} per gram</p><p>Dispatch: ${esc(p.shipping_dispatch_time)}</p></div>
  <div class="card"><h2>Build volume</h2><p>${p.max_width_mm} × ${p.max_depth_mm} × ${p.max_height_mm} mm</p><p>Layer height: ${p.min_layer_height_mm}–${p.max_layer_height_mm} mm</p></div>
  <div class="card"><h2>Materials</h2><p>${(ms||[]).map(x=>esc(x.material)).join(", ")||"Not specified"}</p></div>
  <div class="card"><h2>Nozzles</h2><p>${(ns||[]).map(x=>x.nozzle_size_mm+" mm").join(", ")||"Not specified"}</p></div>
  <div class="card"><h2>Post-processing</h2><p>${c?[c.sanding&&"Sanding",c.painting&&"Painting",c.assembly&&"Assembly"].filter(Boolean).join(", ")||"None listed":"Not specified"}</p></div></section>
  <section class="card"><h2>Reviews</h2>${(rs||[]).length?(rs||[]).map(r=>`<article class="review"><div class="stars">${"★".repeat(r.rating)}${"☆".repeat(5-r.rating)}</div><p>${esc(r.review_text||"")}</p></article>`).join(""):"<p>No reviews yet.</p>"}</section>`;
}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
init();
