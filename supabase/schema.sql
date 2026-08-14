create table if not exists public.rfqs (
  id                   uuid primary key default gen_random_uuid(),
  code                 text unique not null default '',
  full_name            text not null,
  company_name         text,
  email                text not null,
  phone                text,
  location             text,
  service              text not null,
  description          text,
  budget               text,
  timeline             text,
  ongoing_support      text,
  existing_systems     text,
  compliance_support   text,
  file_path            text,
  status               text not null default 'New Submission',
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  constraint rfqs_status_check check (status in (
    'New Submission', 'Under Review', 'Strategy Call Scheduled',
    'Proposal Sent', 'Negotiation', 'Accepted', 'Rejected', 'Closed'
  ))
);

create or replace function public.generate_rfq_code()
returns text
language sql
as $$
  select 'RFQ-' || upper(substr(md5(gen_random_uuid()::text), 1, 6));
$$;

create or replace function public.set_rfq_code()
returns trigger
language plpgsql
as $$
begin
  if new.code is null or new.code = '' then
    new.code := public.generate_rfq_code();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_set_rfq_code on public.rfqs;
create trigger trg_set_rfq_code
  before insert on public.rfqs
  for each row execute function public.set_rfq_code();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_rfqs_updated_at on public.rfqs;
create trigger trg_rfqs_updated_at
  before update on public.rfqs
  for each row execute function public.set_updated_at();

grant insert on public.rfqs to anon;
grant select, update on public.rfqs to authenticated;

alter table public.rfqs enable row level security;

drop policy if exists "public can submit rfqs" on public.rfqs;
create policy "public can submit rfqs"
  on public.rfqs for insert
  to anon
  with check (true);

drop policy if exists "admins can read rfqs" on public.rfqs;
create policy "admins can read rfqs"
  on public.rfqs for select
  to authenticated
  using (true);

drop policy if exists "admins can update rfqs" on public.rfqs;
create policy "admins can update rfqs"
  on public.rfqs for update
  to authenticated
  using (true)
  with check (true);

insert into storage.buckets (id, name, public)
values ('rfq-attachments', 'rfq-attachments', false)
on conflict (id) do nothing;

drop policy if exists "public can upload rfq attachments" on storage.objects;
create policy "public can upload rfq attachments"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'rfq-attachments');

drop policy if exists "admins can read rfq attachments" on storage.objects;
create policy "admins can read rfq attachments"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'rfq-attachments');
