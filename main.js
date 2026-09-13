import { supabase } from "./supabase.js";

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    location.href = "auth.html?mode=login";
    return null;
  }
  return user;
}

export async function getProfile(userId) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

const nav = document.querySelector("[data-nav-auth]");
if (nav) {
  const update = async () => {
    const user = await getCurrentUser();
    nav.textContent = user ? "Dashboard" : "Sign in";
    nav.href = user ? "dashboard.html" : "auth.html?mode=login";
  };
  update();
  supabase.auth.onAuthStateChange(update);
}

document.querySelectorAll("[data-signout]").forEach(btn => {
  btn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    location.href = "index.html";
  });
});
