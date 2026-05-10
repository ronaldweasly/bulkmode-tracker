/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { openDB, IDBPDatabase } from 'idb';

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
