import { createClient } from '@/utils/supabase/server';
import { Evidence } from '@/types/evidence';
import { redirect } from 'next/navigation';

import { BookOpen, LogOut, ArrowRight, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { signOut } from '../login/actions';
import { getSavedPlans } from '../lab/actions';
import SavedPlansList from '@/components/SavedPlansList';
import DashboardSections from '@/components/DashboardSections';


export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }


    // Fetch user profile and products
    const { data: profile } = await supabase.from('perfis').select('*').eq('id', user.id).single();

    // Check products access
    const { data: userProducts } = await supabase
        .from('produtos_usuario')
        .select('*, produtos(*)')
        .eq('usuario_id', user.id)
        .eq('ativo', true);

    const hasEvidenteAccess = userProducts?.some(up => up.produtos?.slug === 'e-vidente') ?? false;

    // Fetch favorites
    const { data: favorites } = await supabase.from('favoritos').select('evidencia_id').eq('usuario_id', user.id);
    let favoritedEvidences: Evidence[] = [];
    if (favorites && favorites.length > 0) {
        const ids = favorites.map(f => f.evidencia_id);
        const { data: evs } = await supabase.from('evidencias').select('*').in('id', ids);
        favoritedEvidences = evs || [];
    }

    // Fetch all evidences for the Studio context
    const { data: allEvidences } = await supabase.from('evidencias').select('*');

    // Fetch saved plans
    const savedPlans = await getSavedPlans();

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-brand-brown pt-8 pb-12 px-4 mb-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">
                            Olá, {profile?.nome_completo?.split(' ')[0] || 'Educador'}
                        </h1>
                        <p className="text-pink-100 opacity-80">Bem-vindo(a) ao seu espaço pessoal.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/dashboard/settings" className="flex items-center gap-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-sm">
                            Configurações
                        </Link>
                        <form action={signOut}>
                            <button className="flex items-center gap-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-sm">
                                <LogOut size={16} /> Sair
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <DashboardSections
                    hasEvidenteAccess={hasEvidenteAccess}
                    savedPlans={savedPlans}
                    favoritedEvidences={favoritedEvidences}
                />
            </div>
        </div>
    );
}
