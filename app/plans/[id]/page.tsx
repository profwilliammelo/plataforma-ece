import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import PlanEditor from '@/components/PlanEditor';

export default async function PlanPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const { id } = await params;

    const { data: plan } = await supabase
        .from('planos_salvos')
        .select('*')
        .eq('id', id)
        .eq('usuario_id', user.id)
        .single();

    if (!plan) {
        return <div className="p-8 text-center text-gray-500">Plano não encontrado.</div>;
    }

    return <PlanEditor plan={plan} />;
}
