import { createClient } from '@/utils/supabase/server';
import { Evidence } from '@/types/evidence';
import { redirect } from 'next/navigation';

import { BookOpen, LogOut, ArrowRight, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { signOut } from '../login/actions';
import { getSavedPlans } from '../lab/actions';
import SavedPlansList from '@/components/SavedPlansList';


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

    const hasEvidenteAccess = userProducts?.some(up => up.produtos?.slug === 'e-vidente');

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
            <div className="bg-brand-brown pt-8 pb-20 px-4 mb-8">
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

            <div className="max-w-7xl mx-auto px-4 -mt-12">

                {/* Dashboard Grid */}
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left Column: Tools & Courses */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Section: My Tools */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="bg-pink-100 p-1.5 rounded-lg text-brand-brown"><Sparkles size={18} /></span> Minhas Ferramentas
                            </h2>
                            {/* Tools Grid */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Link href="/tools/e-vidente" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-100 to-transparent opacity-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-gradient-to-br from-pink-500 to-brand-brown rounded-xl text-white shadow-lg shadow-pink-500/20">
                                            <Sparkles size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">E-Vidente ✨</h3>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Disponível</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                        Sua consultora pedagógica com IA. Crie planos baseados em evidências em segundos.
                                    </p>

                                    <div className="flex items-center text-brand-brown font-bold text-sm gap-1 group-hover:gap-2 transition-all">
                                        Acessar Ferramenta <ArrowRight size={16} />
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Section: Saved Plans */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="bg-purple-100 p-1.5 rounded-lg text-purple-800"><BookOpen size={18} /></span> Meus Planos Salvos
                            </h2>
                            <SavedPlansList plans={savedPlans} />
                        </div>

                        {/* Section: My Courses (Placeholder) */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="bg-blue-100 p-1.5 rounded-lg text-blue-800"><BookOpen size={18} /></span> Meus Cursos
                            </h2>
                            <div className="bg-white rounded-3xl p-8 border border-dashed border-gray-300 text-center">
                                <p className="text-gray-400">Nenhum curso ativo no momento.</p>
                                <button className="text-brand-brown font-bold text-sm mt-2 hover:underline">Ver catálogo de cursos</button>
                            </div>
                        </div>

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
                                                <div className="font-bold text-gray-800 text-sm line-clamp-1">{ev.titulo}</div>
                                                <div className="text-xs text-gray-400 mt-1 flex justify-between">
                                                    <span>{ev.ano || '2024'}</span>
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
