'use client';
import { resetPassword } from '../login/actions';
import { Sparkles, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';

const initialState: { error?: string; success?: string } = {
    error: '',
    success: '',
};

export default function ForgotPasswordPage() {
    const [state, formAction, isPending] = useActionState(resetPassword, initialState);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-brown/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl -ml-10 -mb-10"></div>

            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl w-full max-w-md relative z-10 border border-white/50">
                <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-br from-pink-500 to-brand-brown p-4 rounded-2xl shadow-lg shadow-pink-500/20 rotate-3 hover:rotate-6 transition-transform">
                        <Sparkles className="text-white h-10 w-10" />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Recuperar Senha</h1>
                    <p className="text-gray-500">
                        Digite seu email para receber o link de redefinição.
                    </p>
                </div>

                {/* Feedback Messages */}
                {state?.success && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-2 mb-4 text-sm animate-fade-in">
                        <CheckCircle size={18} /> {state.success}
                    </div>
                )}
                {state?.error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-2 mb-4 text-sm animate-fade-in">
                        <AlertCircle size={18} /> {state.error}
                    </div>
                )}

                <form action={formAction} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-bold text-gray-700 ml-1">Email Cadastrado</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none transition-all"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <button
                        disabled={isPending}
                        className="bg-brand-brown text-white py-4 rounded-xl font-bold text-lg hover:bg-brown-900 transition-all shadow-xl shadow-pink-900/10 mt-4 active:scale-95 transform disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Enviando...' : 'Enviar Link'}
                    </button>

                    <Link href="/login" className="text-center text-sm text-gray-400 hover:text-brand-brown mt-4 inline-flex items-center justify-center gap-2">
                        <ArrowLeft size={14} /> Voltar para o Login
                    </Link>
                </form>
            </div>
        </div>
    );
}
