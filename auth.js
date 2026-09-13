import { supabase } from "./supabase.js";

const form = document.querySelector("#auth-form");
const title = document.querySelector("#auth-title");
const submit = document.querySelector("#auth-submit");
const switchLink = document.querySelector("#auth-switch");
const message = document.querySelector("#auth-message");
const roleField = document.querySelector("#role-field");
let mode = new URLSearchParams(location.search).get("mode") === "signup" ? "signup" : "login";

function render() {
  const signup = mode === "signup";
  title.textContent = signup ? "Create your Mini Mechanism account" : "Welcome back";
  submit.textContent = signup ? "Create account" : "Sign in";
  switchLink.textContent = signup ? "Already have an account? Sign in" : "Need an account? Create one";
  roleField.hidden = !signup;
  message.textContent = "";
}
switchLink.onclick = e => {
  e.preventDefault();
  mode = mode === "signup" ? "login" : "signup";
  history.replaceState({}, "", `auth.html?mode=${mode}`);
  render();
};
form.onsubmit = async e => {
  e.preventDefault();
  submit.disabled = true;
  message.textContent = "Working…";
  try {
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;
    const role = document.querySelector("#role").value;
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { role } } });
      if (error) throw error;
      if (data.user) {
        const { error: pe } = await supabase.from("profiles").upsert({
          id: data.user.id, display_name: email.split("@")[0], role, updated_at: new Date().toISOString()
        });
        if (pe) throw pe;
      }
      message.textContent = data.session
        ? "Account created."
        : "Account created. Check your email if confirmation is enabled.";
      if (data.session) setTimeout(() => location.href = "dashboard.html", 500);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      location.href = "dashboard.html";
    }
  } catch (err) {
    message.textContent = err.message || "Something went wrong.";
  } finally {
    submit.disabled = false;
  }
};
render();
