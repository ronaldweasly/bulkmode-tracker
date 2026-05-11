# Supabase Setup Guide

Follow these steps to set up Supabase for cross-device data persistence.

## 1. Create a Supabase Project

1. Go to https://app.supabase.com and sign up (or log in).
2. Click **"New project"**.
3. Enter a **Project name** (e.g., `bulkmode`).
4. Enter a strong **Database password** (save this, you may need it).
5. Select your **Region** (closest to you).
6. Click **"Create new project"** and wait ~2 minutes for it to initialize.

## 2. Create Database Tables

Once your project is ready:

1. Go to **SQL Editor** in the sidebar.
2. Click **"New query"**.
3. Copy and paste the entire contents of `supabase/schema.sql` into the editor.
4. Click **"Run"** (or Ctrl+Enter).
5. You should see success messages for each table created.

## 3. Get Your Credentials

1. Go to **Project Settings** (gear icon bottom-left).
2. Click **"API"** in the sidebar.
3. Copy:
   - **Project URL** → save as `VITE_SUPABASE_URL`
   - **anon public** key → save as `VITE_SUPABASE_ANON_KEY`

Example URLs:
- Project URL: `https://xyzabc123.supabase.co`
- Anon key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)

## 4. Add Credentials Locally

Create `.env.local` in your project root:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 5. Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` and add a meal or weight. It should sync to Supabase and appear on other devices.

## 6. (Optional) Secure Server API

If you want to use the serverless endpoint `/api/supabase` for secure writes:

1. In your Supabase project, go to **Project Settings** → **API**.
2. Scroll down and copy the **service_role** key (keep this secret!).
3. In Vercel (when deploying), add `SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`.
4. Also add `VITE_USE_SERVER_API=true` to enable server-side writes.

## Troubleshooting

- **"table does not exist"**: Make sure you ran `supabase/schema.sql` in SQL Editor.
- **"401 Unauthorized"**: Check your `VITE_SUPABASE_ANON_KEY` is correct.
- **Data not syncing**: Check browser console (F12 → Console) for errors; enable Row Level Security policies if needed.

