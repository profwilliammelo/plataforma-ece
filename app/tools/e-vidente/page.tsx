import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import EvidenteStudio from '@/components/EvidenteStudio';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EVidenteToolPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch user profile
    const { data: profile } = await supabase.from('perfis').select('*').eq('id', user.id).single();

    // Fetch all evidences for the Studio context
    const { data: allEvidences } = await supabase.from('evidencias').select('*');

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Navbar Replacement for Tool Context */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40 mb-8">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-brand-brown font-bold text-sm transition-colors">
                        <ArrowLeft size={18} />
                        Voltar para Dashboard
                    </Link>
                    <h1 className="text-lg font-bold text-gray-800">E-Vidente ✨</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8 text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">E-Vidente: Sua Consultora Pedagógica</h2>
                    <p className="text-gray-500">
                        Utilize inteligência artificial baseada em evidências para criar planejamentos de aula eficazes e personalizados.
                    </p>
                </div>

                <EvidenteStudio
                    evidences={allEvidences || []}
                    userPlan={profile?.plano || 'free'}
                    usageLimit={profile?.limite_mensal || 2}
                />
            </div>
        </div>
    );
}
