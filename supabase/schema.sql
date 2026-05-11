-- Supabase schema for bulkmode app
-- Run these in the Supabase SQL editor or via psql

create table if not exists settings (
  id text primary key,
  name text,
  targetWeight numeric,
  dailyCalorieGoal integer,
  dailyProteinGoal integer,
  dailyWaterGoal integer,
  reminderTimes text[],
  weight numeric,
  updated_at timestamptz default now()
);

create table if not exists meals (
  id text primary key,
  timestamp bigint,
  name text,
  calories numeric,
  protein numeric,
  quantity integer,
  notes text
);

create table if not exists weights (
  id text primary key,
  timestamp bigint,
  weight numeric,
  photoUrl text
);

create table if not exists water (
  id text primary key,
  timestamp bigint,
  amount integer
);

create table if not exists workouts (
  id text primary key,
  timestamp bigint,
  type text,
  duration integer,
  notes text
);

create table if not exists shake (
  id text primary key,
  timestamp bigint,
  completed boolean,
  ingredients jsonb
);

-- Optional: grant anon role limited access for client SDK
-- Be careful and enable Row Level Security if exposing anon key
