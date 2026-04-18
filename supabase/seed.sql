-- Agencias
insert into agencies (slug, name, short_name, website) values
  ('anid', 'Agencia Nacional de Investigación y Desarrollo', 'ANID', 'https://anid.cl'),
  ('corfo', 'Corporación de Fomento de la Producción', 'Corfo', 'https://www.corfo.cl'),
  ('fia', 'Fundación para la Innovación Agraria', 'FIA', 'https://www.fia.cl'),
  ('minciencia', 'Ministerio de Ciencia, Tecnología, Conocimiento e Innovación', 'Minciencia', 'https://www.minciencia.gob.cl');

-- Areas temáticas
insert into areas (slug, name) values
  ('ciencias-naturales', 'Ciencias Naturales'),
  ('ingenieria-tecnologia', 'Ingeniería y Tecnología'),
  ('ciencias-medicas', 'Ciencias Médicas y de la Salud'),
  ('ciencias-agricolas', 'Ciencias Agrícolas y Veterinarias'),
  ('ciencias-sociales', 'Ciencias Sociales'),
  ('humanidades-artes', 'Humanidades y Artes'),
  ('multidisciplinario', 'Multidisciplinario');

-- Fondos de ejemplo (ANID)
insert into funds (agency_id, slug, name, description, typical_amount_clp, target_audience) values
  ((select id from agencies where slug = 'anid'), 'fondecyt-regular', 'Fondecyt Regular', 'Proyectos de investigación de 2 a 4 años para investigadores con doctorado.', 150000000, 'Investigadores/as con grado de Doctor/a'),
  ((select id from agencies where slug = 'anid'), 'fondecyt-iniciacion', 'Fondecyt de Iniciación', 'Proyectos de investigación para investigadores jóvenes.', 90000000, 'Investigadores/as jóvenes con doctorado'),
  ((select id from agencies where slug = 'anid'), 'fondecyt-postdoctorado', 'Fondecyt de Postdoctorado', 'Estadías de investigación postdoctoral.', 50000000, 'Investigadores/as con doctorado reciente'),
  ((select id from agencies where slug = 'anid'), 'fondef-idea', 'FONDEF IDeA', 'Investigación aplicada y desarrollo tecnológico.', 200000000, 'Equipos de investigación con vínculo empresarial'),
  ((select id from agencies where slug = 'anid'), 'fondap', 'FONDAP', 'Centros de excelencia en investigación.', 1500000000, 'Grupos de investigación consolidados');

-- Convocatorias de ejemplo
insert into calls (fund_id, year, title, status, opens_at, closes_at, max_amount_clp, duration_months, official_url, requirements) values
  ((select id from funds where slug = 'fondecyt-regular'), 2026, 'Fondecyt Regular 2026', 'open', '2026-03-01T00:00:00Z', '2026-06-15T23:59:59Z', 200000000, 48, 'https://anid.cl/concursos/fondecyt-regular-2026', '- Poseer grado de Doctor/a\n- Estar asociado a una institución chilena\n- No tener proyectos Fondecyt vigentes como investigador/a responsable'),
  ((select id from funds where slug = 'fondecyt-iniciacion'), 2026, 'Fondecyt de Iniciación 2026', 'open', '2026-04-01T00:00:00Z', '2026-07-01T23:59:59Z', 100000000, 36, 'https://anid.cl/concursos/fondecyt-iniciacion-2026', '- Poseer grado de Doctor/a obtenido hace menos de 5 años\n- Primera postulación como investigador/a responsable'),
  ((select id from funds where slug = 'fondef-idea'), 2026, 'FONDEF IDeA I+D 2026', 'upcoming', '2026-05-15T00:00:00Z', '2026-08-30T23:59:59Z', 250000000, 24, 'https://anid.cl/concursos/fondef-idea-2026', '- Equipo con al menos un Doctor/a\n- Carta de compromiso de empresa asociada\n- Cofinanciamiento mínimo de 20%'),
  ((select id from funds where slug = 'fondecyt-regular'), 2025, 'Fondecyt Regular 2025', 'awarded', '2025-03-01T00:00:00Z', '2025-06-15T23:59:59Z', 180000000, 48, 'https://anid.cl/concursos/fondecyt-regular-2025', '- Poseer grado de Doctor/a\n- Estar asociado a una institución chilena'),
  ((select id from funds where slug = 'fondecyt-postdoctorado'), 2026, 'Fondecyt Postdoctorado 2026', 'closed', '2026-01-15T00:00:00Z', '2026-03-31T23:59:59Z', 60000000, 36, 'https://anid.cl/concursos/fondecyt-postdoc-2026', '- Doctorado obtenido hace menos de 3 años\n- Institución patrocinante confirmada');

-- Link calls to areas
insert into call_areas (call_id, area_id)
select c.id, a.id from calls c, areas a
where c.title = 'Fondecyt Regular 2026' and a.slug in ('ciencias-naturales', 'ingenieria-tecnologia', 'ciencias-sociales', 'humanidades-artes');

insert into call_areas (call_id, area_id)
select c.id, a.id from calls c, areas a
where c.title = 'FONDEF IDeA I+D 2026' and a.slug in ('ingenieria-tecnologia', 'ciencias-agricolas');
