import Link from 'next/link';
import { Check, Sparkles, Brain } from 'lucide-react';

export default function PricingSection() {
    return (
        <section className="py-20 px-4 bg-gray-50" id="planos">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Planos Flexíveis</h2>
                    <p className="text-gray-500">Comece grátis e evolua conforme sua necessidade.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">

                    {/* Free Tier */}
                    <div className="p-8 rounded-3xl border border-gray-200 bg-white relative hover:scale-105 transition-transform duration-300 flex flex-col">
                        <h3 className="font-bold text-gray-800 text-xl mb-2">Degustação</h3>
                        <div className="text-4xl font-bold text-gray-900 mb-6">Grátis</div>
                        <p className="text-xs text-gray-500 mb-6 font-medium uppercase tracking-wider">Para conhecer</p>

                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-center gap-3 text-sm text-gray-600">
                                <Check size={16} className="text-green-500" /> <strong>2 Planos</strong> com IA /mês
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-600">
                                <Check size={16} className="text-green-500" /> Acesso ao E-Vidente Rápido
                            </li>
                        </ul>
                        <Link href="/login" className="block w-full py-3 rounded-xl border border-gray-300 text-center font-bold text-gray-600 hover:bg-gray-50 transition-colors mt-auto">
                            Criar Conta
                        </Link>
                    </div>

                    {/* Casual Tier */}
                    <div className="p-8 rounded-3xl border border-gray-200 bg-[#FFF8F6] relative hover:scale-105 transition-transform duration-300 flex flex-col">
                        <h3 className="font-bold text-brand-brown text-xl mb-2">Uso Casual</h3>
                        <div className="text-4xl font-bold text-gray-900 mb-2">R$ 9,99</div>
                        <div className="text-sm text-gray-400 mb-6">/mês</div>

                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                <Check size={16} className="text-brand-brown" /> <strong>10 Planos</strong> com IA /mês
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-700">
                                <Check size={16} className="text-brand-brown" /> Acesso ao E-Vidente Gênio <strong>(Gemini 3.0 Pro)</strong>
                            </li>
                        </ul>
                        <Link href="/checkout?plan=casual" className="block w-full py-3 rounded-xl bg-brand-brown/10 text-brand-brown text-center font-bold hover:bg-brand-brown/20 transition-colors mt-auto">
                            Assinar Casual
                        </Link>
                    </div>

                    {/* Intensive Tier (Highlight) */}
                    <div className="p-8 rounded-3xl border-2 border-purple-500 bg-gray-900 text-white shadow-xl relative transform md:-translate-y-4 hover:scale-105 transition-transform duration-300 flex flex-col">
                        <div className="absolute top-0 right-0 bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                            SEM LIMITES
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-white text-xl">Uso Intensivo</h3>
                            <Sparkles size={16} className="text-purple-300" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-2">R$ 19,99</div>
                        <div className="text-sm text-gray-400 mb-6">/mês</div>

                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-center gap-3 text-sm text-gray-200 font-medium">
                                <Check size={16} className="text-purple-400" /> <strong>Gerações ILIMITADAS</strong>
                            </li>
                            <li className="bg-purple-500/10 p-2 rounded-lg -ml-2 flex items-center gap-3 text-sm text-white font-bold border border-purple-500/30">
                                <div className="flex gap-1">
                                    <Brain size={16} className="text-purple-400" />
                                    <Sparkles size={16} className="text-blue-400" />
                                </div>
                                Acesso DUPLO: GPT-5.2 + Gemini
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-200">
                                <Check size={16} className="text-purple-400" /> Suporte Prioritário
                            </li>
                        </ul>
                        <Link href="/checkout?plan=intensive" className="block w-full py-4 rounded-xl bg-purple-600 text-center font-bold text-white hover:bg-purple-700 transition-colors shadow-lg shadow-purple-900/30 mt-auto">
                            Assinar Intensivo
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
