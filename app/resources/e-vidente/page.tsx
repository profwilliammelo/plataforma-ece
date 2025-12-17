import Link from 'next/link';
import { ArrowLeft, Sparkles, Zap, Brain, Check, Lock, FileText, ArrowRight } from 'lucide-react';

export default function EVidenteProductPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-brand-brown font-bold text-sm transition-colors">
                        <ArrowLeft size={18} />
                        Voltar para Dashboard
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">E-Vidente</span>
                        <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs font-bold rounded-full">BETA</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-b from-pink-50/50 to-white pt-20 pb-32">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-pink-200/20 to-blue-200/20 rounded-full blur-3xl -z-10"></div>

                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm mb-8 animate-fade-in">
                        <Sparkles size={14} className="text-yellow-500" />
                        <span className="text-xs font-bold text-gray-600">Nova Geração de Planejamento IA</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                        Sua Consultora Pedagógica <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-amber-500">Baseada em Evidências</span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        A E-Vidente não apenas escreve planos. Ela pensa como uma especialista, utilizando as melhores práticas científicas para criar experiências de aprendizado inesquecíveis.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/tools/e-vidente" className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                            <Sparkles size={20} />
                            Experimentar Agora
                        </Link>
                        <Link href="#planos" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                            Ver Planos
                        </Link>
                    </div>

                    {/* Technical Note Link */}
                    <div className="mt-12 flex justify-center">
                        <Link href="/nota-tecnica" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-brown transition-colors border-b border-gray-200 hover:border-brand-brown pb-0.5">
                            <FileText size={16} />
                            Ler Nota Técnica sobre metodologia de classificação de evidências
                        </Link>
                    </div>
                </div>
            </div>

            {/* AI Models Comparison */}
            <div className="py-24 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">E-Vidente Gênio: Duas Mentes Brilhantes</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            O mesmo padrão de excelência E-Vidente (Gênio), impulsionado por dois dos modelos mais avançados do mundo.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Gemini Card */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm relative overflow-hidden flex flex-col h-full">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">E-Vidente Gênio</h3>
                            <p className="text-sm font-bold text-blue-600 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                Powered by Gemini 3.0 Pro
                            </p>
                            <p className="text-gray-600 mb-8 leading-relaxed flex-grow">
                                O motor padrão de alta performance. Raciocínio veloz e extremamente capaz de articular evidências científicas com a prática de sala de aula. Ideal para o dia a dia.
                            </p>
                            <div className="pt-6 border-t border-gray-100 mt-auto">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Disponibilidade</p>
                                <p className="font-bold text-gray-900">Planos Casual e Intensivo</p>
                            </div>
                        </div>

                        {/* GPT Class Card */}
                        <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-xl relative overflow-hidden flex flex-col h-full">
                            <div className="w-12 h-12 bg-purple-500/20 text-purple-300 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-purple-500/30">
                                <Brain size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">E-Vidente Gênio</h3>
                            <p className="text-sm font-bold text-purple-400 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                                Powered by GPT-5.2
                            </p>
                            <p className="text-gray-400 mb-8 leading-relaxed flex-grow">
                                Um motor de raciocínio alternativo com nuances criativas diferenciadas. Uma &quot;segunda opinião&quot; de peso para seus planejamentos mais complexos.
                            </p>
                            <div className="pt-6 border-t border-gray-800 mt-auto">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Disponibilidade</p>
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-white">Combo Plano Intensivo</p>
                                    <span className="bg-yellow-500 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">EXCLUSIVO</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div id="planos" className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Escolha seu Plano</h2>
                        <p className="text-gray-500">Comece hoje a transformar suas aulas com evidências.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Casual Plan */}
                        <div className="bg-[#FFF8F6] rounded-3xl p-8 border-2 border-brand-brown/20 hover:border-brand-brown/50 transition-colors shadow-sm flex flex-col relative">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Plano Casual</h3>
                            <p className="text-gray-600 text-sm mb-6">Para professores que planejam pontualmente.</p>

                            <div className="mb-8">
                                <span className="text-4xl font-bold text-brand-brown">R$ 9,99</span>
                                <span className="text-gray-500">/mês</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-grow">
                                <li className="flex items-center gap-3 text-sm text-gray-700">
                                    <Check size={18} className="text-brand-brown" />
                                    <strong>10 Gerações</strong> de Planos / mês
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-700">
                                    <Check size={18} className="text-brand-brown" />
                                    Acesso ao E-Vidente Gênio <strong>(Gemini 3.0 Pro)</strong>
                                </li>
                            </ul>

                            <Link
                                href="/checkout?plan=casual"
                                className="w-full py-4 rounded-xl border-2 border-brand-brown text-brand-brown font-bold hover:bg-brand-brown hover:text-white transition-all text-center block"
                            >
                                Assinar Casual
                            </Link>
                        </div>

                        {/* Intensive Plan */}
                        <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-xl flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-xl z-20">
                                MAIS POPULAR
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                            <h3 className="text-xl font-bold text-white mb-2">Plano Intensivo</h3>
                            <p className="text-gray-400 text-sm mb-6">Para quem busca a excelência máxima.</p>

                            <div className="mb-8 relative z-10">
                                <span className="text-4xl font-bold text-white">R$ 19,99</span>
                                <span className="text-gray-500">/mês</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-grow relative z-10">
                                <li className="flex items-center gap-3 text-sm text-gray-300">
                                    <Check size={18} className="text-purple-400" />
                                    <strong>Gerações ILIMITADAS</strong>
                                </li>
                                <li className="bg-purple-500/10 p-2 rounded-lg -ml-2 flex items-center gap-3 text-sm text-white font-bold border border-purple-500/30">
                                    <div className="flex gap-1">
                                        <Brain size={18} className="text-purple-400" />
                                        <Sparkles size={18} className="text-blue-400" />
                                    </div>
                                    Acesso DUPLO: GPT-5.2 + Gemini
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-300">
                                    <Check size={18} className="text-purple-400" />
                                    Suporte Prioritário
                                </li>
                            </ul>

                            <Link
                                href="/checkout?plan=intensive"
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-brand-brown text-white font-bold hover:shadow-lg hover:scale-[1.02] transition-all text-center block relative z-10 border border-transparent"
                            >
                                Assinar Intensivo
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
