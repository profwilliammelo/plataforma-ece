'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, User, Bell, CreditCard } from 'lucide-react';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import { createClient } from '@/utils/supabase/client';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // Fetch profile on mount
    useEffect(() => {
        async function loadProfile() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('perfis').select('*').eq('id', user.id).single();
                setProfile(data);
            }
            setLoading(false);
        }
        loadProfile();
    }, []);

    const isPaidPlan = profile?.plano && ['casual', 'intensive'].includes(profile.plano);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 pt-8 pb-8 px-4 mb-8">
                <div className="max-w-3xl mx-auto">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-brown mb-4 transition-colors">
                        <ArrowLeft size={18} /> Voltar para Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">Minhas Configurações</h1>
                    <p className="text-gray-500">Gerencie sua conta e preferências.</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 space-y-6">

                {/* Subscription Section */}
                <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <CreditCard size={20} className="text-brand-brown" /> Assinatura
                    </h2>

                    {loading ? (
                        <div className="p-8 text-center text-gray-400">Carregando informações...</div>
                    ) : (
                        <div className={`flex items-center justify-between p-6 rounded-xl border ${isPaidPlan ? 'bg-purple-50 border-purple-100' : 'bg-gray-50 border-gray-100'}`}>
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg capitalize">
                                    {isPaidPlan ? `Plano ${profile.plano}` : 'Plano Gratuito (Degustação)'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {isPaidPlan
                                        ? 'Sua assinatura está ativa. Gerencie no portal.'
                                        : 'Faça um upgrade para liberar mais recursos.'}
                                </p>
                            </div>

                            {isPaidPlan ? (
                                <button
                                    onClick={async () => {
                                        const res = await fetch('/api/create_portal_session', { method: 'POST' });
                                        const data = await res.json();
                                        if (data.url) window.location.href = data.url;
                                        else alert('Erro: ' + (data.error || 'Verifique se você completou o cadastro no checkout.'));
                                    }}
                                    className="bg-brand-brown text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brown-900 transition-colors shadow-lg shadow-brand-brown/10"
                                >
                                    Gerenciar Assinatura
                                </button>
                            ) : (
                                <Link href="/plans" className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-900/10">
                                    Ver Planos
                                </Link>
                            )}
                        </div>
                    )}
                </section>

                {/* Security Section */}
                <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Lock size={20} className="text-brand-brown" /> Segurança
                    </h2>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                            <h3 className="font-bold text-gray-700">Senha de Acesso</h3>
                            <p className="text-sm text-gray-500">Altere sua senha periodicamente para segurança.</p>
                        </div>
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                        >
                            Alterar Senha
                        </button>
                    </div>
                </section>

                {/* Profile Placeholder */}
                <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 opacity-60 pointer-events-none grayscale">
                    <div className="absolute top-4 right-4 bg-gray-200 px-2 py-1 rounded text-xs font-bold text-gray-500">Em Breve</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <User size={20} className="text-brand-brown" /> Dados Pessoais
                    </h2>
                    <p className="text-sm text-gray-500">Editar nome, email e foto.</p>
                </section>
            </div>

            {showPasswordModal && (
                <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
            )}
        </div>
    );
}
