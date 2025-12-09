-- Habilita o RLS na tabela (caso você tenha desativado sem querer, mas você disse que já ativou)
alter table "public"."evidences" enable row level security;

-- Cria uma política que permite que QUALQUER pessoa (anon ou logada) LEIA (Select) os dados
create policy "Permitir leitura pública"
on "public"."evidences"
as PERMISSIVE
for SELECT
to public
using (true);

-- Se tiver a tabela 'evidence_details' ou outras, repita o processo:
-- alter table "public"."evidence_details" enable row level security;
-- create policy "Permitir leitura pública detalhes" on "public"."evidence_details"
-- as PERMISSIVE for SELECT to public using (true);
