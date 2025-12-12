import { createClient } from '@/utils/supabase/server';
import { Evidence } from '@/types/evidence';
import { redirect } from 'next/navigation';
import EvidenteStudio from '@/components/EvidenteStudio';
import { BookOpen, LogOut, ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';
import { signOut } from '../login/actions';


export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch user profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

    // Fetch favorites
    // We need to join evidences. Since Supabase basic client doesn't do deep joins easily without config,
    // we fetch favorites then fetch evidences.
    const { data: favorites } = await supabase.from('favorites').select('evidence_id').eq('user_id', user.id);

    let favoritedEvidences: Evidence[] = [];
    if (favorites && favorites.length > 0) {
        const ids = favorites.map(f => f.evidence_id);
        const { data: evs } = await supabase.from('evidences').select('*').in('id', ids);
        favoritedEvidences = evs || [];
    }

    // Fetch all evidences for the Studio context (simplified for now, ideally passed lighter)
    const { data: allEvidences } = await supabase.from('evidences').select('*');

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-brand-brown pt-8 pb-20 px-4 mb-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">
                            Olá, {profile?.full_name?.split(' ')[0] || 'Educador'}
                        </h1>
                        <p className="text-pink-100 opacity-80">Bem-vindo(a) ao seu espaço pessoal.</p>
                    </div>
                    <form action={signOut}>
                        <button className="flex items-center gap-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-sm">
                            <LogOut size={16} /> Sair
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-12">

                {/* Dashboard Tabs / Grid */}
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left Column: E-Vidente (Main Focus) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Access Control Check for AI */}
                        {profile?.acesso_bia ? (
                            <EvidenteStudio evidences={allEvidences || []} />
                        ) : (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center py-16">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Acesso E-Vidente Bloqueado</h3>
                                <p className="text-gray-500 mb-6">Você precisa ser um membro premium para usar a IA.</p>
                                <button className="bg-brand-brown text-white px-6 py-3 rounded-xl font-bold">Fazer Upgrade</button>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Quick Links & Favorites */}
                    <div className="space-y-6">
                        {/* Quick Access to Lab */}
                        <Link href="/lab" className="block bg-white hover:bg-pink-50 transition-colors p-6 rounded-3xl shadow-sm border border-gray-100 group">
                            <div className="flex justify-between items-center mb-2">
                                <div className="bg-pink-100 text-brand-brown p-3 rounded-xl group-hover:bg-brand-brown group-hover:text-white transition-colors">
                                    <BookOpen size={24} />
                                </div>
                                <ArrowRight className="text-gray-300 group-hover:text-brand-brown" />
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg">Biblioteca de Evidências</h3>
                            <p className="text-gray-500 text-sm">Explore o acervo completo do EcE Lab.</p>
                        </Link>

                        {/* Favorites Mini-List */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <Heart className="text-red-500" size={20} fill="currentColor" />
                                <h3 className="font-bold text-gray-800">Meus Favoritos</h3>
                            </div>

                            {favoritedEvidences.length > 0 ? (
                                <ul className="space-y-3">
                                    {favoritedEvidences.map(ev => (
                                        <li key={ev.id} className="border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                            <Link href={`/evidence/${ev.id}`} className="block hover:bg-gray-50 rounded-lg p-2 transition-colors">
                                                <div className="font-bold text-gray-800 text-sm line-clamp-1">{ev.title}</div>
                                                <div className="text-xs text-gray-400 mt-1 flex justify-between">
                                                    <span>{ev.year || '2024'}</span>
                                                    <span className="text-brand-brown">Ver detalhe</span>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-8 text-gray-400 text-sm">
                                    <p>Você ainda não favoritou nenhuma evidência.</p>
                                    <Link href="/lab" className="text-brand-brown underline mt-2 block">Ir para Biblioteca</Link>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
