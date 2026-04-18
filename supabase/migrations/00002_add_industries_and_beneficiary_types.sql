-- Industrias (clasificación AcciónInnova)
create table industries (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  sort_order int default 0
);

alter table industries enable row level security;
create policy "Public read industries" on industries for select using (true);

-- Tipo de beneficiario
create table beneficiary_types (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null
);

alter table beneficiary_types enable row level security;
create policy "Public read beneficiary_types" on beneficiary_types for select using (true);

-- Categoría de fondo (emprendedores, becas, instituciones)
create table fund_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null
);

alter table fund_categories enable row level security;
create policy "Public read fund_categories" on fund_categories for select using (true);

-- Relación calls <-> industries (muchos a muchos)
create table call_industries (
  call_id uuid references calls(id) on delete cascade,
  industry_id uuid references industries(id) on delete cascade,
  primary key (call_id, industry_id)
);

alter table call_industries enable row level security;
create policy "Public read call_industries" on call_industries for select using (true);

-- Agregar columnas a calls
alter table calls add column beneficiary_type_id uuid references beneficiary_types(id);
alter table calls add column country text;

-- Agregar categoría a funds
alter table funds add column category_id uuid references fund_categories(id);

-- Seed: Industrias
insert into industries (slug, name, sort_order) values
  ('adultos-mayores', 'Adultos Mayores', 1),
  ('agricultura', 'Agricultura', 2),
  ('agua-sanitizacion', 'Agua y sanitización', 3),
  ('alimentacion-nutricion', 'Alimentación y Nutrición', 4),
  ('arquitectura-vivienda-patrimonio', 'Arquitectura, Vivienda y Patrimonio', 5),
  ('ayuda-humanitaria', 'Ayuda Humanitaria y Solución de Conflictos', 6),
  ('ciencia-tecnologia', 'Ciencia y Tecnología', 7),
  ('cultura-arte-deporte', 'Cultura, Arte y Deporte', 8),
  ('democracia-ddhh', 'Democracia y derechos humanos', 9),
  ('desarrollo-economico', 'Desarrollo económico y comercial', 10),
  ('desarrollo-social', 'Desarrollo social', 11),
  ('desarrollo-urbano', 'Desarrollo Urbano', 12),
  ('educacion', 'Educación', 13),
  ('emprendimiento', 'Emprendimiento', 14),
  ('energia', 'Energía', 15),
  ('justicia-inclusion', 'Justicia e Inclusión de Minorías', 16),
  ('medio-ambiente', 'Medio Ambiente', 17),
  ('mujeres-genero', 'Mujeres y Género', 18),
  ('ninos-jovenes', 'Niños y Jóvenes', 19),
  ('pobreza', 'Pobreza', 20),
  ('salud', 'Salud', 21),
  ('seguridad-emergencias', 'Seguridad y Respuesta a Emergencias', 22),
  ('otro-multiples', 'Otro/Múltiples Industrias', 23);

-- Seed: Tipos de beneficiario
insert into beneficiary_types (slug, name) values
  ('personas-naturales', 'Personas Naturales'),
  ('empresas', 'Empresas'),
  ('asociaciones', 'Asociaciones'),
  ('todos', 'Todos');

-- Seed: Categorías de fondo
insert into fund_categories (slug, name) values
  ('emprendedores', 'Fondos para Emprendedores'),
  ('becas', 'Becas de Estudio'),
  ('instituciones', 'Fondos para Instituciones');
