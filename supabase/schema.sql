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

create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  rfq_id       uuid references public.rfqs(id),
  client       text not null,
  rfq_code     text,
  service      text,
  budget       text,
  timeline     text,
  email        text,
  phone        text,
  stage        text not null default 'new-lead',
  assigned_to  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint leads_stage_check check (stage in ('new-lead', 'in-review', 'proposal-sent', 'won', 'lost'))
);

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

create table if not exists public.lead_notes (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references public.leads(id) on delete cascade,
  note        text not null,
  created_by  text,
  created_at  timestamptz not null default now()
);

grant select, insert, update, delete on public.leads to authenticated;
grant select, insert, delete on public.lead_notes to authenticated;

alter table public.leads enable row level security;
drop policy if exists "admins manage leads" on public.leads;
create policy "admins manage leads"
  on public.leads for all
  to authenticated
  using (true)
  with check (true);

alter table public.lead_notes enable row level security;
drop policy if exists "admins manage lead notes" on public.lead_notes;
create policy "admins manage lead notes"
  on public.lead_notes for all
  to authenticated
  using (true)
  with check (true);

create table if not exists public.blog_posts (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  status            text not null default 'Draft',
  category          text,
  excerpt           text,
  content           text,
  seo_title         text,
  seo_description   text,
  cover_image_path  text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint blog_posts_status_check check (status in ('Published', 'Draft', 'Archived'))
);

alter table public.blog_posts add column if not exists cover_image_path text;

drop trigger if exists trg_blog_posts_updated_at on public.blog_posts;
create trigger trg_blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

grant select, insert, update, delete on public.blog_posts to authenticated;

alter table public.blog_posts enable row level security;
drop policy if exists "admins manage blog posts" on public.blog_posts;
create policy "admins manage blog posts"
  on public.blog_posts for all
  to authenticated
  using (true)
  with check (true);

create table if not exists public.portfolio_projects (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  status            text not null default 'Planning',
  client            text,
  budget            text,
  progress          int not null default 0,
  description       text,
  start_date        date,
  end_date          date,
  cover_image_path  text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint portfolio_projects_status_check check (status in ('Planning', 'Completed', 'In progress', 'On hold'))
);

alter table public.portfolio_projects add column if not exists cover_image_path text;

drop trigger if exists trg_portfolio_projects_updated_at on public.portfolio_projects;
create trigger trg_portfolio_projects_updated_at
  before update on public.portfolio_projects
  for each row execute function public.set_updated_at();

grant select, insert, update, delete on public.portfolio_projects to authenticated;

alter table public.portfolio_projects enable row level security;
drop policy if exists "admins manage portfolio projects" on public.portfolio_projects;
create policy "admins manage portfolio projects"
  on public.portfolio_projects for all
  to authenticated
  using (true)
  with check (true);

create table if not exists public.conversations (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  phone         text,
  company_name  text,
  subject       text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.messages (
  id                uuid primary key default gen_random_uuid(),
  conversation_id   uuid not null references public.conversations(id) on delete cascade,
  sender            text not null,
  body              text not null,
  created_at        timestamptz not null default now(),
  constraint messages_sender_check check (sender in ('admin', 'user'))
);

drop trigger if exists trg_conversations_updated_at on public.conversations;
create trigger trg_conversations_updated_at
  before update on public.conversations
  for each row execute function public.set_updated_at();

grant insert on public.conversations to anon;
grant insert on public.messages to anon;
grant select, insert, update on public.conversations to authenticated;
grant select, insert on public.messages to authenticated;

alter table public.conversations enable row level security;
drop policy if exists "public can start conversation" on public.conversations;
create policy "public can start conversation"
  on public.conversations for insert
  to anon
  with check (true);
drop policy if exists "admins manage conversations" on public.conversations;
create policy "admins manage conversations"
  on public.conversations for all
  to authenticated
  using (true)
  with check (true);

alter table public.messages enable row level security;
drop policy if exists "public can send first message" on public.messages;
create policy "public can send first message"
  on public.messages for insert
  to anon
  with check (true);
drop policy if exists "admins manage messages" on public.messages;
create policy "admins manage messages"
  on public.messages for all
  to authenticated
  using (true)
  with check (true);

create table if not exists public.admin_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'Admin',
  created_at  timestamptz not null default now(),
  constraint admin_profiles_role_check check (role in ('Super Admin', 'Admin', 'Content Admin'))
);

create or replace function public.handle_new_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.admin_profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'Admin'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_admin();

insert into public.admin_profiles (id, email, full_name, role)
select id, email, coalesce(raw_user_meta_data->>'full_name', split_part(email, '@', 1)), 'Super Admin'
from auth.users
on conflict (id) do nothing;

grant select, update on public.admin_profiles to authenticated;

alter table public.admin_profiles enable row level security;
drop policy if exists "admins view profiles" on public.admin_profiles;
create policy "admins view profiles"
  on public.admin_profiles for select
  to authenticated
  using (true);
drop policy if exists "admins update roles" on public.admin_profiles;
create policy "admins update roles"
  on public.admin_profiles for update
  to authenticated
  using (true)
  with check (true);

create table if not exists public.activity_log (
  id             uuid primary key default gen_random_uuid(),
  actor_email    text,
  actor_name     text,
  actor_role     text,
  action         text not null,
  module         text not null,
  affected_item  text,
  description    text,
  device         text,
  created_at     timestamptz not null default now()
);

alter table public.activity_log add column if not exists actor_role text;

grant select, insert on public.activity_log to authenticated;

alter table public.activity_log enable row level security;
drop policy if exists "admins manage activity log" on public.activity_log;
create policy "admins manage activity log"
  on public.activity_log for all
  to authenticated
  using (true)
  with check (true);

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

drop policy if exists "admins can upload blog images" on storage.objects;
create policy "admins can upload blog images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog-images');

drop policy if exists "admins can update blog images" on storage.objects;
create policy "admins can update blog images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog-images');

drop policy if exists "admins can delete blog images" on storage.objects;
create policy "admins can delete blog images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog-images');

drop policy if exists "admins can upload portfolio images" on storage.objects;
create policy "admins can upload portfolio images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-images');

drop policy if exists "admins can update portfolio images" on storage.objects;
create policy "admins can update portfolio images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-images');

drop policy if exists "admins can delete portfolio images" on storage.objects;
create policy "admins can delete portfolio images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-images');
