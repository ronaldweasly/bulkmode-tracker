/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { openDB, IDBPDatabase } from 'idb';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DB_NAME = 'bulkmode_db';
const DB_VERSION = 1;

export const initDB = async (): Promise<IDBPDatabase> => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('meals')) {
        db.createObjectStore('meals', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('weights')) {
        db.createObjectStore('weights', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('water')) {
        db.createObjectStore('water', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('workouts')) {
        db.createObjectStore('workouts', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('shake')) {
        db.createObjectStore('shake', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }
    },
  });
};

// Local IndexedDB service (offline-first)
export const dbService = {
  async save(storeName: string, item: any) {
    const db = await initDB();
    return db.put(storeName, item);
  },
  async getAll(storeName: string) {
    const db = await initDB();
    return db.getAll(storeName);
  },
  async get(storeName: string, id: string) {
    const db = await initDB();
    return db.get(storeName, id);
  },
  async delete(storeName: string, id: string) {
    const db = await initDB();
    return db.delete(storeName, id);
  },
  async clear(storeName: string) {
    const db = await initDB();
    return db.clear(storeName);
  }
};

// Optional Supabase remote service for cross-device persistence.
const SUPABASE_URL = (import.meta.env as any).VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = (import.meta.env as any).VITE_SUPABASE_ANON_KEY;
const USE_SERVER_API = (import.meta.env as any).VITE_USE_SERVER_API === 'true';

export const hasRemote = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let supabase: SupabaseClient | null = null;
if (hasRemote && !USE_SERVER_API) {
  // Only create client when using client-side anon key
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

async function serverApiFetch(method: string, table: string, body?: any, id?: string) {
  const url = new URL('/api/supabase', window.location.origin);
  url.searchParams.set('table', table);
  if (id) url.searchParams.set('id', id);

  const res = await fetch(url.toString(), {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Server API error: ${res.status} ${txt}`);
  }
  return res.json();
}

export const remoteService = {
  async getAll(storeName: string) {
    if (USE_SERVER_API) return serverApiFetch('GET', storeName);
    if (!supabase) return null;
    const { data, error } = await supabase.from(storeName).select('*');
    if (error) throw error;
    return data;
  },
  async save(storeName: string, item: any) {
    if (USE_SERVER_API) return serverApiFetch('POST', storeName, item);
    if (!supabase) return null;
    const { data, error } = await supabase.from(storeName).upsert(item).select();
    if (error) throw error;
    return data;
  },
  async get(storeName: string, id: string) {
    if (USE_SERVER_API) return serverApiFetch('GET', storeName, undefined, id);
    if (!supabase) return null;
    const { data, error } = await supabase.from(storeName).select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },
  async delete(storeName: string, id: string) {
    if (USE_SERVER_API) return serverApiFetch('DELETE', storeName, undefined, id);
    if (!supabase) return null;
    const { data, error } = await supabase.from(storeName).delete().eq('id', id);
    if (error) throw error;
    return data;
  }
};
