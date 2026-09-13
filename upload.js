import { supabase } from "./supabase.js";
import { requireUser } from "./main.js";
const form=document.querySelector("#upload-form"),fileInput=document.querySelector("#model-file"),info=document.querySelector("#file-info"),msg=document.querySelector("#upload-message");
fileInput.onchange=()=>{const f=fileInput.files[0];if(!f){info.textContent="";return;}const ext=f.name.toLowerCase().split(".").pop();if(!["stl","3mf"].includes(ext)){fileInput.value="";info.textContent="Only STL and 3MF files are supported.";return;}info.textContent=`${f.name} • ${Math.round(f.size/1024)} KB • ${ext.toUpperCase()}`;};
form.onsubmit=async e=>{
  e.preventDefault();const u=await requireUser();if(!u)return;const f=fileInput.files[0];if(!f){msg.textContent="Choose an STL or 3MF file.";return;}
  const ext=f.name.toLowerCase().split(".").pop();if(!["stl","3mf"].includes(ext)){msg.textContent="Only STL and 3MF files are supported.";return;}
  if(!document.querySelector("#rights-confirmed").checked){msg.textContent="Please confirm you have the rights/permission required.";return;}
  msg.textContent="Saving model information…";
  try{
    const {data,error}=await supabase.from("models").insert({
      uploader_id:u.id,name:document.querySelector("#model-name").value.trim(),category:document.querySelector("#category").value,
      material_type:document.querySelector("#material").value,is_public:document.querySelector("#public-use").checked,rights_confirmed:true
    }).select().single();if(error)throw error;
    msg.textContent=`Model record created. Secure file storage will be enabled in the next backend step.`;
    form.reset();info.textContent="";
  }catch(err){msg.textContent=err.message||"Could not save the model.";}
};
