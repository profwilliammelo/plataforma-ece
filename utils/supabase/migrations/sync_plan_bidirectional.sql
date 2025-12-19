-- BIDIRECTIONAL SYNC: PERFIS <-> PRODUTOS_USUARIO
-- Designed to handle manual edits and prevent infinite recursion loops.

-- 1. Helper Function: Sync Profile -> Product (When Plan Changes)
CREATE OR REPLACE FUNCTION public.sync_profile_to_product()
RETURNS TRIGGER AS $$
DECLARE
    evidente_id UUID;
BEGIN
    -- Prevent Recursion: If this trigger was fired by the other trigger, stop.
    -- We can check if the old values are the same as new (redundant update)
    -- But better simply:
    IF (pg_trigger_depth() > 1) THEN
        RETURN NEW;
    END IF;

    -- Get Product ID
    SELECT id INTO evidente_id FROM public.produtos WHERE slug = 'e-vidente' LIMIT 1;
    IF evidente_id IS NULL THEN RETURN NEW; END IF;

    -- Logic: If Plan is Paid -> Grant Access. If Free/Null -> Revoke Access.
    IF NEW.plano IN ('casual', 'intensive') THEN
        INSERT INTO public.produtos_usuario (usuario_id, produto_id, ativo)
        VALUES (NEW.id, evidente_id, true)
        ON CONFLICT (usuario_id, produto_id) 
        DO UPDATE SET ativo = true;
    ELSE
        -- If user is downgraded to free, ensure access is revoked
        UPDATE public.produtos_usuario
        SET ativo = false
        WHERE usuario_id = NEW.id AND produto_id = evidente_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Helper Function: Sync Product -> Profile (When Access is Manually Changed)
CREATE OR REPLACE FUNCTION public.sync_product_to_profile()
RETURNS TRIGGER AS $$
DECLARE
    evidente_id UUID;
BEGIN
    -- Prevent Recursion
    IF (pg_trigger_depth() > 1) THEN
        RETURN NEW;
    END IF;

    -- Get Product ID
    SELECT id INTO evidente_id FROM public.produtos WHERE slug = 'e-vidente' LIMIT 1;
    
    -- Only care if the changed row is for our main product 'e-vidente'
    IF NEW.produto_id != evidente_id THEN
        RETURN NEW;
    END IF;

    -- Logic: If Access is Revoked (False) -> Downgrade Profile to Free
    -- We generally DON'T upgrade automatically to paid if they just get access manually, 
    -- as we don't know WHICH paid plan (casual/intensive) to give.
    -- BUT we MUST downgrade if they lose access.
    
    IF NEW.ativo = false THEN
        UPDATE public.perfis
        SET 
            plano = 'free',
            limite_mensal = 2
        WHERE id = NEW.usuario_id 
        AND plano IN ('casual', 'intensive'); -- Only downgrade if currently paid
    END IF;

    -- Optional: If set to True manually, maybe default to Casual? 
    -- This is risky. Let's stick to the user request: "se ele sai... volta pro free".

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Create/Replace Triggers

-- Trigger A: Profile -> Product
DROP TRIGGER IF EXISTS on_profile_plan_change ON public.perfis;
CREATE TRIGGER on_profile_plan_change
AFTER UPDATE OF plano ON public.perfis
FOR EACH ROW
WHEN (OLD.plano IS DISTINCT FROM NEW.plano)
EXECUTE FUNCTION public.sync_profile_to_product();

-- Trigger B: Product -> Profile
DROP TRIGGER IF EXISTS on_product_access_change ON public.produtos_usuario;
CREATE TRIGGER on_product_access_change
AFTER UPDATE OF ativo ON public.produtos_usuario
FOR EACH ROW
WHEN (OLD.ativo IS DISTINCT FROM NEW.ativo)
EXECUTE FUNCTION public.sync_product_to_profile();

-- Trigger B (Insert case? If someone manually inserts a false row? Unlikely but safe to add)
DROP TRIGGER IF EXISTS on_product_access_insert ON public.produtos_usuario;
CREATE TRIGGER on_product_access_insert
AFTER INSERT ON public.produtos_usuario
FOR EACH ROW
EXECUTE FUNCTION public.sync_product_to_profile();
