/**
 * Vercel Serverless Function to perform secure Supabase operations
 * Protects the service role key on the server and exposes simple endpoints
 * Allowed tables: meals, weights, water, workouts, shake, settings
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const ALLOWED_TABLES = new Set(['meals','weights','water','workouts','shake','settings']);

export default async function handler(req, res) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    res.status(500).json({ error: 'Supabase server config missing' });
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false }});

  const table = req.query.table;
  if (!table || Array.isArray(table) || !ALLOWED_TABLES.has(table)) {
    res.status(400).json({ error: 'Invalid or missing table parameter' });
    return;
  }

  try {
    if (req.method === 'GET') {
      const id = req.query.id;
      if (id) {
        const { data, error } = await supabase.from(table).select('*').eq('id', id).maybeSingle();
        if (error) throw error;
        res.status(200).json(data);
      } else {
        const { data, error } = await supabase.from(table).select('*');
        if (error) throw error;
        res.status(200).json(data);
      }
      return;
    }

    if (req.method === 'POST') {
      const item = req.body;
      if (!item) {
        res.status(400).json({ error: 'Missing JSON body' });
        return;
      }
      const { data, error } = await supabase.from(table).upsert(item).select();
      if (error) throw error;
      res.status(200).json(data);
      return;
    }

    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (!id) {
        res.status(400).json({ error: 'Missing id for delete' });
        return;
      }
      const { data, error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      res.status(200).json(data);
      return;
    }

    res.setHeader('Allow', 'GET,POST,DELETE');
    res.status(405).end('Method Not Allowed');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || String(err) });
  }
}
