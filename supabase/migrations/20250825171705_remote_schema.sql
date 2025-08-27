drop extension if exists "pg_net";

create extension if not exists "vector" with schema "public";


  create table "public"."leads" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "org_id" uuid not null default gen_random_uuid(),
    "full_name" text not null,
    "email" text not null,
    "phone" text,
    "notes" text,
    "score" bigint,
    "source" text,
    "ai_segment" text,
    "ai_score" integer,
    "ai_tags" text[],
    "ai_notes" text,
    "embedding" vector(1536)
      );


alter table "public"."leads" enable row level security;


  create table "public"."organizations" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null default ''::text,
    "owner_user_id" uuid not null default gen_random_uuid(),
    "plan" text default 'starter'::text
      );


alter table "public"."organizations" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "email" text not null,
    "full_name" text not null,
    "org_id" uuid
      );


alter table "public"."profiles" enable row level security;


  create table "public"."properties" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "org_id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "price" numeric not null,
    "status" text default 'draft'::text,
    "city" text,
    "updated_at" timestamp without time zone not null default now()
      );


alter table "public"."properties" enable row level security;

CREATE UNIQUE INDEX leads_email_key ON public.leads USING btree (email);

CREATE UNIQUE INDEX leads_pkey ON public.leads USING btree (id);

CREATE UNIQUE INDEX organizations_owner_user_id_key ON public.organizations USING btree (owner_user_id);

CREATE UNIQUE INDEX organizations_pkey ON public.organizations USING btree (id);

CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email);

CREATE UNIQUE INDEX profiles_id_key ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_org_id_key ON public.profiles USING btree (org_id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX properties_org_id_key ON public.properties USING btree (org_id);

CREATE UNIQUE INDEX properties_pkey ON public.properties USING btree (id);

alter table "public"."leads" add constraint "leads_pkey" PRIMARY KEY using index "leads_pkey";

alter table "public"."organizations" add constraint "organizations_pkey" PRIMARY KEY using index "organizations_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."properties" add constraint "properties_pkey" PRIMARY KEY using index "properties_pkey";

alter table "public"."leads" add constraint "leads_email_key" UNIQUE using index "leads_email_key";

alter table "public"."leads" add constraint "leads_org_id_fkey" FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."leads" validate constraint "leads_org_id_fkey";

alter table "public"."organizations" add constraint "organizations_owner_user_id_fkey" FOREIGN KEY (owner_user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."organizations" validate constraint "organizations_owner_user_id_fkey";

alter table "public"."organizations" add constraint "organizations_owner_user_id_key" UNIQUE using index "organizations_owner_user_id_key";

alter table "public"."profiles" add constraint "profiles_email_key" UNIQUE using index "profiles_email_key";

alter table "public"."profiles" add constraint "profiles_id_key" UNIQUE using index "profiles_id_key";

alter table "public"."profiles" add constraint "profiles_org_id_fkey" FOREIGN KEY (org_id) REFERENCES organizations(id) not valid;

alter table "public"."profiles" validate constraint "profiles_org_id_fkey";

alter table "public"."profiles" add constraint "profiles_org_id_key" UNIQUE using index "profiles_org_id_key";

alter table "public"."properties" add constraint "properties_org_id_fkey" FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."properties" validate constraint "properties_org_id_fkey";

alter table "public"."properties" add constraint "properties_org_id_key" UNIQUE using index "properties_org_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.leads_set_org_id()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_org uuid;
begin
  select p.org_id into v_org
  from public.profiles p
  where p.id = auth.uid();

  if v_org is null then
    raise exception 'No org_id for current user';
  end if;

  new.org_id := v_org;
  return new;
end;
$function$
;

grant delete on table "public"."leads" to "anon";

grant insert on table "public"."leads" to "anon";

grant references on table "public"."leads" to "anon";

grant select on table "public"."leads" to "anon";

grant trigger on table "public"."leads" to "anon";

grant truncate on table "public"."leads" to "anon";

grant update on table "public"."leads" to "anon";

grant delete on table "public"."leads" to "authenticated";

grant insert on table "public"."leads" to "authenticated";

grant references on table "public"."leads" to "authenticated";

grant select on table "public"."leads" to "authenticated";

grant trigger on table "public"."leads" to "authenticated";

grant truncate on table "public"."leads" to "authenticated";

grant update on table "public"."leads" to "authenticated";

grant delete on table "public"."leads" to "service_role";

grant insert on table "public"."leads" to "service_role";

grant references on table "public"."leads" to "service_role";

grant select on table "public"."leads" to "service_role";

grant trigger on table "public"."leads" to "service_role";

grant truncate on table "public"."leads" to "service_role";

grant update on table "public"."leads" to "service_role";

grant delete on table "public"."organizations" to "anon";

grant insert on table "public"."organizations" to "anon";

grant references on table "public"."organizations" to "anon";

grant select on table "public"."organizations" to "anon";

grant trigger on table "public"."organizations" to "anon";

grant truncate on table "public"."organizations" to "anon";

grant update on table "public"."organizations" to "anon";

grant delete on table "public"."organizations" to "authenticated";

grant insert on table "public"."organizations" to "authenticated";

grant references on table "public"."organizations" to "authenticated";

grant select on table "public"."organizations" to "authenticated";

grant trigger on table "public"."organizations" to "authenticated";

grant truncate on table "public"."organizations" to "authenticated";

grant update on table "public"."organizations" to "authenticated";

grant delete on table "public"."organizations" to "service_role";

grant insert on table "public"."organizations" to "service_role";

grant references on table "public"."organizations" to "service_role";

grant select on table "public"."organizations" to "service_role";

grant trigger on table "public"."organizations" to "service_role";

grant truncate on table "public"."organizations" to "service_role";

grant update on table "public"."organizations" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."properties" to "anon";

grant insert on table "public"."properties" to "anon";

grant references on table "public"."properties" to "anon";

grant select on table "public"."properties" to "anon";

grant trigger on table "public"."properties" to "anon";

grant truncate on table "public"."properties" to "anon";

grant update on table "public"."properties" to "anon";

grant delete on table "public"."properties" to "authenticated";

grant insert on table "public"."properties" to "authenticated";

grant references on table "public"."properties" to "authenticated";

grant select on table "public"."properties" to "authenticated";

grant trigger on table "public"."properties" to "authenticated";

grant truncate on table "public"."properties" to "authenticated";

grant update on table "public"."properties" to "authenticated";

grant delete on table "public"."properties" to "service_role";

grant insert on table "public"."properties" to "service_role";

grant references on table "public"."properties" to "service_role";

grant select on table "public"."properties" to "service_role";

grant trigger on table "public"."properties" to "service_role";

grant truncate on table "public"."properties" to "service_role";

grant update on table "public"."properties" to "service_role";


  create policy "leads_delete_own_org"
  on "public"."leads"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.org_id = leads.org_id)))));



  create policy "leads_insert_has_profile"
  on "public"."leads"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE (p.id = auth.uid()))));



  create policy "leads_insert_own_org"
  on "public"."leads"
  as permissive
  for insert
  to authenticated
with check ((org_id = ( SELECT profiles.org_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));



  create policy "leads_select_own_org"
  on "public"."leads"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.org_id = leads.org_id)))));



  create policy "leads_update_own_org"
  on "public"."leads"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.org_id = leads.org_id)))))
with check ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.org_id = leads.org_id)))));



  create policy "org by owner"
  on "public"."organizations"
  as permissive
  for select
  to authenticated
using ((owner_user_id = auth.uid()));



  create policy "props select own org"
  on "public"."organizations"
  as permissive
  for update
  to authenticated
using ((owner_user_id = auth.uid()))
with check ((owner_user_id = auth.uid()));



  create policy "user as name org"
  on "public"."organizations"
  as permissive
  for insert
  to authenticated
with check ((owner_user_id = auth.uid()));



  create policy "profile self select"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using ((id = auth.uid()));



  create policy "profiles self insert"
  on "public"."profiles"
  as permissive
  for insert
  to authenticated
with check ((id = auth.uid()));



  create policy "profiles self update"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((id = auth.uid()))
with check ((id = auth.uid()));



  create policy "profiles_insert_self"
  on "public"."profiles"
  as permissive
  for insert
  to authenticated
with check ((id = auth.uid()));



  create policy "profiles_select_self"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using ((id = auth.uid()));



  create policy "profiles_update_self"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((id = auth.uid()))
with check ((id = auth.uid()));



  create policy "props delete own org"
  on "public"."properties"
  as permissive
  for delete
  to authenticated
using ((org_id = ( SELECT profiles.org_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));



  create policy "props insert own org"
  on "public"."properties"
  as permissive
  for insert
  to authenticated
with check ((org_id = ( SELECT profiles.org_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));



  create policy "props select own org"
  on "public"."properties"
  as permissive
  for select
  to authenticated
using ((org_id = ( SELECT profiles.org_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));



  create policy "props update own org"
  on "public"."properties"
  as permissive
  for update
  to authenticated
using ((org_id = ( SELECT profiles.org_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))))
with check ((org_id = ( SELECT profiles.org_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


CREATE TRIGGER trg_leads_set_org_id BEFORE INSERT ON public.leads FOR EACH ROW EXECUTE FUNCTION leads_set_org_id();


