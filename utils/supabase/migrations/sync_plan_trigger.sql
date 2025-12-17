-- Function to sync plan changes to produtos_usuario
CREATE OR REPLACE FUNCTION public.sync_plan_to_products()
RETURNS TRIGGER AS $$
DECLARE
    evidente_id UUID;
BEGIN
    -- Get the ID for 'e-vidente' product
    SELECT id INTO evidente_id FROM public.produtos WHERE slug = 'e-vidente' LIMIT 1;
    
    IF evidente_id IS NULL THEN
        RAISE WARNING 'Product e-vidente not found. Skipping sync.';
        RETURN NEW;
    END IF;

    -- CASE 1: Upgrade (Free -> Paid) or Switch between Paid plans
    IF NEW.plano IN ('casual', 'intensive') THEN
        -- Insert or Update to Active
        INSERT INTO public.produtos_usuario (usuario_id, produto_id, ativo)
        VALUES (NEW.id, evidente_id, true)
        ON CONFLICT (usuario_id, produto_id) 
        DO UPDATE SET ativo = true;
    
    -- CASE 2: Downgrade (Paid -> Free)
    ELSIF NEW.plano = 'free' THEN
        -- Deactivate access
        UPDATE public.produtos_usuario
        SET ativo = false
        WHERE usuario_id = NEW.id AND produto_id = evidente_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the Trigger
DROP TRIGGER IF EXISTS on_profile_plan_change ON public.perfis;
CREATE TRIGGER on_profile_plan_change
AFTER UPDATE OF plano ON public.perfis
FOR EACH ROW
EXECUTE FUNCTION public.sync_plan_to_products();
