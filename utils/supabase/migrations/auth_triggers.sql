-- Trigger para criar perfil automaticamente quando um usuário é criado no Auth
-- Dropar trigger antigo se existir (para evitar duplicidade ou erros com tabela profiles)
drop trigger if exists on_auth_user_created on auth.users;

-- Função para manipulação do novo usuário
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.perfis (id, nome_completo, email, avatar_url)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email, 
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Recriar o Trigger apontando para a nova tabela PERFIS
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
