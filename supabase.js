import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "./config.js";

const config = window.MINI_MECHANISM_CONFIG || {};
export const supabase = createClient(
  config.supabaseUrl || "https://placeholder.supabase.co",
  config.supabasePublishableKey || "placeholder"
);
