# Mini Mechanism — Stage 2

Real Supabase-connected website foundation.

## Setup
1. Open `js/config.js`.
2. Replace `YOUR_SUPABASE_PROJECT_URL` with your Supabase Project URL.
3. Replace `YOUR_SUPABASE_PUBLISHABLE_KEY` with the Supabase Publishable key.
4. Never put a Supabase Secret/service-role key or database password in this repository.
5. Upload the contents of this folder to the root of your `mini-mechanism` GitHub repository.

The database schema and RLS policies are already created in Supabase from the SQL script used earlier.

## Included
- Supabase email/password authentication
- Customer/printer-owner profiles
- Printer profiles and capabilities
- Materials and nozzle sizes
- Public printer search
- Public model catalogue
- Model metadata and rights confirmation
- Owner dashboard
- Reviews/ratings display

## Not yet enabled
Binary STL/3MF Storage upload is intentionally waiting for a private Storage bucket and Storage RLS policies. Order/payment/email automation and 3D geometry analysis are later stages.
