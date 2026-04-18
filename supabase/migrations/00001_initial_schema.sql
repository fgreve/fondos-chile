-- Agencias financiadoras
create table agencies (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_name text,
  website text,
  logo_url text,
  created_at timestamptz default now()
);

-- Programas o líneas de fondo
create table funds (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references agencies(id) on delete cascade,
  slug text unique not null,
  name text not null,
  description text,
  typical_amount_clp bigint,
  target_audience text,
  created_at timestamptz default now()
);

-- Convocatorias concretas
create table calls (
  id uuid primary key default gen_random_uuid(),
  fund_id uuid references funds(id) on delete cascade,
  year int not null,
  title text not null,
  status text not null check (status in ('upcoming','open','closed','awarded','cancelled')),
  opens_at timestamptz,
  closes_at timestamptz,
  results_at timestamptz,
  start_date date,
  max_amount_clp bigint,
  duration_months int,
  requirements text,
  official_url text not null,
  bases_pdf_url text,
  raw_source jsonb,
  last_scraped_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Areas temáticas
create table areas (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null
);

create table call_areas (
  call_id uuid references calls(id) on delete cascade,
  area_id uuid references areas(id) on delete cascade,
  primary key (call_id, area_id)
);

-- Proyectos adjudicados
create table awarded_projects (
  id uuid primary key default gen_random_uuid(),
  call_id uuid references calls(id) on delete cascade,
  project_code text,
  title text not null,
  principal_investigator text,
  institution text,
  amount_clp bigint,
  year int not null,
  abstract text,
  source_url text,
  created_at timestamptz default now()
);

-- Suscripciones de alerta
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  agency_ids uuid[],
  area_ids uuid[],
  min_amount_clp bigint,
  email_enabled boolean default true,
  created_at timestamptz default now()
);

-- Indices
create index idx_calls_status_closes on calls(status, closes_at);
create index idx_calls_fund on calls(fund_id);
create index idx_awarded_year on awarded_projects(year desc);
create index idx_awarded_institution on awarded_projects(institution);

-- RLS
alter table agencies enable row level security;
alter table funds enable row level security;
alter table calls enable row level security;
alter table areas enable row level security;
alter table call_areas enable row level security;
alter table awarded_projects enable row level security;
alter table subscriptions enable row level security;

-- Public read for all content tables
create policy "Public read agencies" on agencies for select using (true);
create policy "Public read funds" on funds for select using (true);
create policy "Public read calls" on calls for select using (true);
create policy "Public read areas" on areas for select using (true);
create policy "Public read call_areas" on call_areas for select using (true);
create policy "Public read awarded_projects" on awarded_projects for select using (true);

-- Subscriptions: users can only see/modify their own
create policy "Users read own subscriptions" on subscriptions for select using (auth.uid() = user_id);
create policy "Users insert own subscriptions" on subscriptions for insert with check (auth.uid() = user_id);
create policy "Users update own subscriptions" on subscriptions for update using (auth.uid() = user_id);
create policy "Users delete own subscriptions" on subscriptions for delete using (auth.uid() = user_id);
