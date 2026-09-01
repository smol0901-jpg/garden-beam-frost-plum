-- Смена: employees, departments, shifts, attendance

create table if not exists departments (
  id serial primary key,
  name text not null unique,
  created_at timestamptz not null default now()
);

insert into departments (name)
values ('Офис'), ('Склад'), ('Производство')
on conflict (name) do nothing;

create table if not exists profiles (
  user_id text primary key,
  full_name text not null default '',
  email text,
  role text not null default 'pending',
  department_id integer references departments(id) on delete set null,
  position text not null default '',
  created_at timestamptz not null default now(),
  constraint profiles_role_chk check (role in ('admin', 'manager', 'employee', 'pending'))
);

create index if not exists profiles_role_idx on profiles (role);
create index if not exists profiles_department_idx on profiles (department_id);

create table if not exists shifts (
  id serial primary key,
  user_id text not null,
  work_date date not null,
  start_time time not null,
  end_time time not null,
  break_minutes integer not null default 60,
  notes text not null default '',
  created_by text not null,
  created_at timestamptz not null default now(),
  unique (user_id, work_date)
);

create index if not exists shifts_date_idx on shifts (work_date);
create index if not exists shifts_user_date_idx on shifts (user_id, work_date);

create table if not exists attendance (
  id serial primary key,
  user_id text not null,
  work_date date not null,
  clock_in timestamptz not null,
  clock_out timestamptz,
  note text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists attendance_user_date_idx on attendance (user_id, work_date);
create index if not exists attendance_open_idx on attendance (user_id) where clock_out is null;
