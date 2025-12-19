'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Sparkles,
    BookOpen,
    Heart,
    ArrowRight,
    ChevronDown,
    ChevronUp,
    GraduationCap,
    Clock,
    Calendar
} from 'lucide-react';
import { Evidence } from '@/types/evidence';
import SavedPlansList from '@/components/SavedPlansList';

interface DashboardSectionsProps {
    hasEvidenteAccess: boolean;
    savedPlans: any[];
    favoritedEvidences: Evidence[];
}

export default function DashboardSections({
    hasEvidenteAccess,
    savedPlans,
    favoritedEvidences
}: DashboardSectionsProps) {

    // State to track expanded sections. Default all open or specific ones.
    const [openSections, setOpenSections] = useState({
        tools: true,
        plans: true,
        favorites: true,
        courses: false // Default closed
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <div className="space-y-6">

            {/* 1. Minhas Ferramentas */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                    onClick={() => toggleSection('tools')}
                    className="w-full flex justify-between items-center p-6 hover:bg-gray-50 transition-colors text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-pink-100 p-2 rounded-xl text-brand-brown">
                            <Sparkles size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Minhas Ferramentas</h2>
                    </div>
                    {openSections.tools ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                </button>

                {openSections.tools && (
                    <div className="p-6 pt-0 border-t border-gray-100/50 animate-fade-in">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                            {/* E-Vidente Card */}
                            <Link href="/tools/e-vidente" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-100 to-transparent opacity-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-gradient-to-br from-pink-500 to-brand-brown rounded-xl text-white shadow-lg shadow-pink-500/20">
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">E-Vidente ✨</h3>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${hasEvidenteAccess ? 'text-green-600 bg-green-50' : 'text-gray-500 bg-gray-100'}`}>
                                            {hasEvidenteAccess ? 'Disponível' : 'Bloqueado'}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                    Sua consultora pedagógica com IA. Crie planos baseados em evidências em segundos.
                                </p>

                                <div className="flex items-center text-brand-brown font-bold text-sm gap-1 group-hover:gap-2 transition-all">
                                    Acessar Ferramenta <ArrowRight size={16} />
                                </div>
                            </Link>

                            {/* Lab Card */}
                            <Link href="/lab" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-pink-100 rounded-xl text-brand-brown">
                                        <BookOpen size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">EcE Lab 🧪</h3>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Gratuito</span>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm mb-4">
                                    Biblioteca completa de evidências científicas e dados territoriais.
                                </p>
                                <div className="flex items-center text-brand-brown font-bold text-sm gap-1 group-hover:gap-2 transition-all">
                                    Acessar Lab <ArrowRight size={16} />
                                </div>
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Meus Planos Salvos */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                    onClick={() => toggleSection('plans')}
                    className="w-full flex justify-between items-center p-6 hover:bg-gray-50 transition-colors text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-xl text-purple-800">
                            <BookOpen size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Meus Planos Salvos</h2>
                    </div>
                    {openSections.plans ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                </button>

                {openSections.plans && (
                    <div className="p-6 pt-0 border-t border-gray-100/50 animate-fade-in text-gray-600">
                        {/* We use the existing component but wrap it or use it directly */}
                        <SavedPlansList plans={savedPlans} />
                    </div>
                )}
            </div>

            {/* 3. Meus Favoritos */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                    onClick={() => toggleSection('favorites')}
                    className="w-full flex justify-between items-center p-6 hover:bg-gray-50 transition-colors text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-xl text-red-600">
                            <Heart size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Minhas Evidências Favoritas</h2>
                    </div>
                    {openSections.favorites ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                </button>

                {openSections.favorites && (
                    <div className="p-6 pt-0 border-t border-gray-100/50 animate-fade-in mt-4">
                        {favoritedEvidences.length > 0 ? (
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {favoritedEvidences.map(ev => (
                                    <Link key={ev.id} href={`/evidence/${ev.id}`} className="block bg-gray-50 hover:bg-pink-50 rounded-xl p-4 transition-colors border border-gray-100 group">
                                        <div className="font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-brand-brown">{ev.titulo}</div>
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><Calendar size={12} /> {ev.ano || '2024'}</span>
                                            <span className="text-brand-brown font-bold">Ver detalhe</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                <p>Você ainda não favoritou nenhuma evidência.</p>
                                <Link href="/lab" className="text-brand-brown underline mt-2 block">Ir para Biblioteca</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 4. Meus Cursos */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden opacity-75">
                <button
                    onClick={() => toggleSection('courses')}
                    className="w-full flex justify-between items-center p-6 hover:bg-gray-50 transition-colors text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-xl text-blue-800">
                            <GraduationCap size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Meus Cursos</h2>
                    </div>
                    {openSections.courses ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                </button>

                {openSections.courses && (
                    <div className="p-6 pt-0 border-t border-gray-100/50 animate-fade-in mt-4">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-dashed border-gray-300 text-center">
                            <GraduationCap size={32} className="mx-auto text-gray-300 mb-2" />
                            <p className="text-gray-400">Nenhum curso ativo no momento.</p>
                            <button className="text-brand-brown font-bold text-sm mt-2 hover:underline">Ver catálogo disponível</button>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
