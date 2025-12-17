-- Refined Trigger: Stricter Rules
CREATE OR REPLACE FUNCTION public.sync_plan_to_products()
RETURNS TRIGGER AS $$
DECLARE
    evidente_id UUID;
BEGIN
    -- Get the ID for 'e-vidente' product
    SELECT id INTO evidente_id FROM public.produtos WHERE slug = 'e-vidente' LIMIT 1;
    
    IF evidente_id IS NULL THEN
        RETURN NEW;
    END IF;

    -- CASE 1: Active Paid Plans -> Grant Access
    IF NEW.plano IN ('casual', 'intensive') THEN
        INSERT INTO public.produtos_usuario (usuario_id, produto_id, ativo)
        VALUES (NEW.id, evidente_id, true)
        ON CONFLICT (usuario_id, produto_id) 
        DO UPDATE SET ativo = true;
    
    -- CASE 2: Any other status (Free, Null, Expired) -> Revoke Access
    ELSE
        UPDATE public.produtos_usuario
        SET ativo = false
        WHERE usuario_id = NEW.id AND produto_id = evidente_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure Trigger is applied
DROP TRIGGER IF EXISTS on_profile_plan_change ON public.perfis;
CREATE TRIGGER on_profile_plan_change
AFTER UPDATE OF plano ON public.perfis
FOR EACH ROW
EXECUTE FUNCTION public.sync_plan_to_products();
