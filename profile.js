import { supabase } from "./supabase.js";
import { getProfile, requireUser } from "./main.js";

const form = document.querySelector("#profile-form");
const role = document.querySelector("#role");
const ownerFields = document.querySelector("#owner-fields");
const message = document.querySelector("#profile-message");
const materials = [...document.querySelectorAll("[data-material]")];
const nozzles = [...document.querySelectorAll("[data-nozzle]")];

function toggle(){ ownerFields.hidden = role.value !== "printer_owner"; }
role.addEventListener("change", toggle);

async function init(){
  const user = await requireUser(); if(!user)return;
  const profile = await getProfile(user.id);
  if(profile){ document.querySelector("#display-name").value=profile.display_name||""; role.value=profile.role; }
  toggle();

  const {data: p}=await supabase.from("printer_profiles").select("*").eq("owner_id",user.id).maybeSingle();
  if(!p)return;
  const set=(id,v)=>{document.querySelector(id).value=v??""};
  set("#printer-name",p.display_name); set("#printer-type",p.printer_type); set("#brand-model",p.printer_brand_model);
  set("#price-per-gram",p.price_per_gram); set("#max-width",p.max_width_mm); set("#max-depth",p.max_depth_mm); set("#max-height",p.max_height_mm);
  set("#min-layer",p.min_layer_height_mm); set("#max-layer",p.max_layer_height_mm); set("#dispatch-time",p.shipping_dispatch_time);
  document.querySelector("#multi-colour").checked=!!p.multi_colour;
  const {data: ms}=await supabase.from("printer_materials").select("material").eq("printer_id",p.id);
  (ms||[]).forEach(x=>{const el=document.querySelector(`[data-material="${x.material}"]`);if(el)el.checked=true;});
  const {data: ns}=await supabase.from("printer_nozzles").select("nozzle_size_mm").eq("printer_id",p.id);
  (ns||[]).forEach(x=>{const el=document.querySelector(`[data-nozzle="${x.nozzle_size_mm}"]`);if(el)el.checked=true;});
  const {data:c}=await supabase.from("printer_capabilities").select("*").eq("printer_id",p.id).maybeSingle();
  if(c){["sanding","painting","assembly","flexible"].forEach(k=>{const el=document.querySelector("#"+k);if(el)el.checked=!!c[k==="flexible"?"flexible_materials":k];});}
}

form.onsubmit=async e=>{
  e.preventDefault(); const user=await requireUser();if(!user)return;
  message.textContent="Saving…";
  try{
    const r=role.value;
    let {error}=await supabase.from("profiles").upsert({id:user.id,display_name:document.querySelector("#display-name").value.trim(),role:r,updated_at:new Date().toISOString()});
    if(error)throw error;
    if(r==="printer_owner"){
      const payload={
        owner_id:user.id,display_name:document.querySelector("#printer-name").value.trim(),printer_type:document.querySelector("#printer-type").value,
        printer_brand_model:document.querySelector("#brand-model").value.trim(),price_per_gram:Number(document.querySelector("#price-per-gram").value),
        max_width_mm:Number(document.querySelector("#max-width").value),max_depth_mm:Number(document.querySelector("#max-depth").value),max_height_mm:Number(document.querySelector("#max-height").value),
        min_layer_height_mm:Number(document.querySelector("#min-layer").value),max_layer_height_mm:Number(document.querySelector("#max-layer").value),
        shipping_dispatch_time:document.querySelector("#dispatch-time").value.trim(),multi_colour:document.querySelector("#multi-colour").checked,
        active:true,last_confirmed_at:new Date().toISOString(),updated_at:new Date().toISOString()
      };
      const {data:p,error:pe}=await supabase.from("printer_profiles").upsert(payload,{onConflict:"owner_id"}).select().single();if(pe)throw pe;
      await supabase.from("printer_materials").delete().eq("printer_id",p.id);
      const ms=materials.filter(x=>x.checked).map(x=>({printer_id:p.id,material:x.dataset.material}));if(ms.length){const q=await supabase.from("printer_materials").insert(ms);if(q.error)throw q.error;}
      await supabase.from("printer_nozzles").delete().eq("printer_id",p.id);
      const ns=nozzles.filter(x=>x.checked).map(x=>({printer_id:p.id,nozzle_size_mm:Number(x.dataset.nozzle)}));if(ns.length){const q=await supabase.from("printer_nozzles").insert(ns);if(q.error)throw q.error;}
      const q=await supabase.from("printer_capabilities").upsert({
        printer_id:p.id,single_colour:!document.querySelector("#multi-colour").checked,multi_colour:document.querySelector("#multi-colour").checked,
        sanding:document.querySelector("#sanding").checked,painting:document.querySelector("#painting").checked,assembly:document.querySelector("#assembly").checked,
        flexible_materials:document.querySelector("#flexible").checked
      },{onConflict:"printer_id"});if(q.error)throw q.error;
    }
    message.textContent="Saved successfully.";
  }catch(err){message.textContent=err.message||"Could not save.";}
};
init();
