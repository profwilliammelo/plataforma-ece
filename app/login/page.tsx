import { login, signup, signInWithGoogle } from './actions'
import { GraduationCap, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <Link href="/" className="absolute top-8 left-8 text-gray-500 hover:text-brand-brown flex items-center gap-2 transition-colors">
                <ArrowLeft size={20} />
                Voltar para Home
            </Link>

            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-brown">
                        <GraduationCap size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Acesse o EcE Lab</h1>
                    <p className="text-gray-500 text-sm mt-2">Entre para acessar a biblioteca completa e a assistente E-Vidente</p>
                </div>

                <div className="mb-6">
                    <form action={signInWithGoogle}>
                        <button className="w-full bg-white text-gray-700 border border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Entrar com Google
                        </button>
                    </form>
                    <div className="flex items-center gap-4 my-6">
                        <div className="h-px bg-gray-200 flex-1" />
                        <span className="text-xs text-gray-400 font-medium">OU ENTRE COM EMAIL</span>
                        <div className="h-px bg-gray-200 flex-1" />
                    </div>
                </div>

                <form className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none transition-all"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                        <div className="flex justify-end">
                            <a href="/forgot-password" className="text-sm text-brand-brown hover:underline">
                                Esqueci minha senha
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                        <button formAction={login} className="w-full bg-brand-brown text-white py-3 rounded-xl font-bold hover:bg-brown-900 transition-colors shadow-lg shadow-pink-900/20">
                            Entrar
                        </button>
                        <button formAction={signup} className="w-full bg-white text-gray-700 border border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                            Criar Conta
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-xs text-gray-400">
                    Plataforma Educação com Evidências © 2025
                </div>
            </div>
        </div>
    )
}
