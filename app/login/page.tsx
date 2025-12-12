import { login, signup } from './actions'
import { GraduationCap, ArrowLeft } from 'lucide-react'
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
                    <p className="text-gray-500 text-sm mt-2">Entre para acessar a biblioteca completa e a assistente B.ia</p>
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
