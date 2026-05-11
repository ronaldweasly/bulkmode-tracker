<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Supabase (optional) - Cross-device persistence

1. Create a Supabase project at https://app.supabase.com and open the SQL editor.
2. Run the SQL in `supabase/schema.sql` to create the tables used by the app.
3. In your Supabase project settings, copy the `URL` and `anon key`.
4. Add these to Vercel (or locally in `.env.local` for development):

   - `VITE_SUPABASE_URL` — your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` — your Supabase anon key

5. Deploy to Vercel; the app will sync remote data when those env vars are present.

Security note: For sensitive writes you may want to create server-side API endpoints and keep the service role key secret; if using anon key, enable Row Level Security and strict policies in Supabase.

## Vercel serverless endpoint (optional)

This repo includes `api/supabase.js`, a Vercel serverless function that uses the Supabase service role key to perform secure writes and deletes. To enable it:

- In Vercel Project Settings -> Environment Variables add:
   - `VITE_SUPABASE_URL` = your supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = your service role key (keep this secret)

   If you set `VITE_USE_SERVER_API=true`, the frontend will call the serverless endpoint
   `/api/supabase` for remote operations and the server will use `SUPABASE_SERVICE_ROLE_KEY`.

- The endpoint accepts:
   - `GET /api/supabase?table=meals` — list all
   - `GET /api/supabase?table=meals&id=<id>` — fetch one
   - `POST /api/supabase?table=meals` with JSON body — upsert item
   - `DELETE /api/supabase?table=meals&id=<id>` — delete item

Use the endpoint from your client to keep the service role key off the browser. If you prefer client-only approach, the app already supports using the anon client when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are present.
