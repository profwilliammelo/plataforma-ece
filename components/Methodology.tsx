import { Atom, Palette, Rocket, Users, Cpu, ArrowRight, Sparkles } from 'lucide-react';

export default function Methodology() {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-brand-brown mb-4">O Método EcE</h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-16">
                    Transformamos conhecimento acadêmico em impacto real na sala de aula através de um processo único que une ciência, arte e tecnologia.
                </p>

                <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0">

                    {/* Passo 1: Ciência */}
                    <div className="relative z-10 flex flex-col items-center group">
                        <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Atom size={40} className="text-brand-brown" />
                        </div>
                        <h3 className="mt-6 font-bold text-gray-800 text-lg">Evidência Científica</h3>
                        <p className="text-sm text-gray-500 mt-2 max-w-[200px]">Pesquisa rigorosa e validade acadêmica como base.</p>
                    </div>

                    {/* Seta de Conexão (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-[100px] justify-center text-brand-pink">
                        <ArrowRight size={32} className="animate-pulse" />
                    </div>

                    {/* Passo 2: O Processo (Consultoria + Arte/Tech) */}
                    <div className="relative z-10 flex flex-col items-center bg-[#FFF0F5] p-8 rounded-3xl border border-pink-100 shadow-sm mx-4">
                        <div className="absolute -top-4 bg-brand-brown text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                            Nossa Abordagem
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-4">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-3">
                                    <Users size={24} className="text-brand-brown" />
                                </div>
                                <span className="text-sm font-bold text-gray-700">Consultoria <br />& Formação</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-3">
                                    <Palette size={24} className="text-brand-brown" />
                                </div>
                                <span className="text-sm font-bold text-gray-700">Arte <br />& Tecnologia</span>
                            </div>
                        </div>
                        <div className="w-full h-px bg-pink-200 my-2"></div>
                        <p className="text-xs text-gray-500 mt-2 max-w-[250px] leading-relaxed">
                            Integramos capacitação técnica com sensibilidade artística e inovação digital.
                        </p>
                    </div>

                    {/* Seta de Conexão (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-[100px] justify-center text-brand-pink">
                        <ArrowRight size={32} className="animate-pulse" />
                    </div>

                    {/* Passo 3: Ação */}
                    <div className="relative z-10 flex flex-col items-center group">
                        <div className="absolute -top-6 -right-6 text-yellow-400 animate-bounce">
                            <Sparkles size={24} />
                        </div>
                        <div className="w-24 h-24 bg-brand-brown rounded-full flex items-center justify-center border-4 border-pink-100 shadow-xl group-hover:scale-110 transition-transform duration-300">
                            <Rocket size={40} className="text-white" />
                        </div>
                        <h3 className="mt-6 font-bold text-gray-800 text-lg">Ação Educacional</h3>
                        <p className="text-sm text-gray-500 mt-2 max-w-[200px]">Práticas transformadoras aplicáveis no dia a dia escolar.</p>
                    </div>

                    {/* Linha conectora de fundo (Desktop apenas) */}
                    <div className="absolute top-12 left-0 w-full h-1 bg-pink-50 -z-0 hidden md:block"></div>
                </div>
            </div>
        </section>
    );
}
