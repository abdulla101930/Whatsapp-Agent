-- Run this in Supabase SQL Editor to set up the database

create table conversations (
  id uuid default gen_random_uuid() primary key,
  phone text unique not null,
  name text,
  mode text not null default 'agent' check (mode in ('agent', 'human')),
  updated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

create table messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  whatsapp_msg_id text unique,
  created_at timestamp with time zone default now()
);

create index idx_messages_conversation on messages(conversation_id);
create index idx_conversations_updated on conversations(updated_at desc);

-- Enable Realtime for the dashboard
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table conversations;
