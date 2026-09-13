import { getCurrentUser, getProfile, requireUser } from "./main.js";
import { supabase } from "./supabase.js";

const content = document.querySelector("#dashboard-content");
async function init() {
  const user = await requireUser();
  if (!user) return;
  try {
    const profile = await getProfile(user.id);
    if (!profile) {
      content.innerHTML = `<div class="empty-state"><h2>Finish your profile</h2><a class="button" href="profile.html">Set up profile</a></div>`;
      return;
    }
    if (profile.role === "printer_owner") {
      const { data: printer } = await supabase.from("printer_profiles").select("*").eq("owner_id", user.id).maybeSingle();
      content.innerHTML = `<div class="dashboard-grid">
        <section class="card"><p class="eyebrow">Account</p><h2>${esc(profile.display_name || "Printer owner")}</h2><p>${esc(user.email)}</p><a class="button" href="profile.html">Edit profile</a></section>
        <section class="card"><p class="eyebrow">Printer profile</p><h2>${printer ? "Published" : "Not set up"}</h2><p>${printer ? "Your printer can appear in search." : "Create your printer profile to get started."}</p><a class="button secondary" href="profile.html">${printer ? "Edit printer" : "Create printer"}</a></section>
      </div>`;
    } else {
      const { count } = await supabase.from("models").select("*", {count:"exact", head:true}).eq("uploader_id", user.id);
      content.innerHTML = `<div class="dashboard-grid">
        <section class="card"><p class="eyebrow">Account</p><h2>${esc(profile.display_name || "Customer")}</h2><p>${esc(user.email)}</p><a class="button" href="profile.html">Edit profile</a></section>
        <section class="card"><p class="eyebrow">Your models</p><h2>${count ?? 0}</h2><p>Models you have uploaded.</p><a class="button secondary" href="upload.html">Upload a model</a></section>
      </div>`;
    }
  } catch (err) { content.innerHTML = `<div class="error">${esc(err.message)}</div>`; }
}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
init();
