-- DANGER: drops all site tables (and their data). Only use on a fresh/dev project
-- or when upgrading from the v1 schema. Then re-run migrations/…_init.sql and seed.sql.
drop table if exists public.contact_messages cascade;
drop table if exists public.social_posts     cascade;
drop table if exists public.gallery          cascade;
drop table if exists public.speeches         cascade;
drop table if exists public.milestones       cascade;
drop table if exists public.updates          cascade;
