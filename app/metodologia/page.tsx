import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, BookOpen, PenTool, Users } from 'lucide-react';

export default function MethodologyPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-brand-brown py-12 md:py-20 text-center px-4 relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <Link href="/" className="inline-flex items-center text-pink-200 hover:text-white mb-6 uppercase text-xs font-bold tracking-widest transition-colors">
                        <ArrowLeft size={14} className="mr-2" /> Voltar para Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Nossa Metodologia</h1>
                    <p className="text-xl text-pink-100 max-w-2xl mx-auto font-light">
                        Um mergulho profundo em como transformamos teoria em prática escolar.
                    </p>
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 opacity-10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 py-16">

                {/* Infographic Section */}
                <div className="mb-20 text-center animate-fade-in">
                    <h2 className="text-xs font-bold text-brand-brown uppercase mb-8 tracking-widest">Fluxo Visual do Processo</h2>
                    <div className="relative w-full h-[300px] md:h-[500px] bg-pink-50/50 rounded-3xl border border-pink-100 p-8 flex items-center justify-center shadow-sm">
                        <Image
                            src="/methodology-banner.png"
                            alt="Infográfico da Metodologia Educação com Evidências"
                            fill
                            className="object-contain mix-blend-multiply"
                            priority
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-4 italic">Nosso ciclo virtuoso de transformação educacional.</p>
                </div>

                {/* Detailed Text */}
                <div className="grid md:grid-cols-3 gap-12">
                    <div>
                        <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-brand-brown mb-4">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">1. Evidência Científica</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Tudo começa com dados. Não "achismos", mas pesquisas de qualidade. Garimpamos o que a academia produziu de mais sólido sobre aprendizagem e equidade em Educação.
                        </p>
                    </div>

                    <div>
                        <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-brand-brown mb-4">
                            <PenTool size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">2. Arte & Tecnologia</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            A ciência sozinha pode ser fria e difícil de entender. Por isso, traduzimos conceitos complexos usando <strong>design, narrativas artísticas e ferramentas digitais</strong>. Nossas formações e consultorias usam afeto, ritmo e ciência para influenciar novas práticas educacionais.
                        </p>
                    </div>

                    <div>
                        <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-brand-brown mb-4">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">3. Ação Educacional</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            O fim é a PRÁTICA educacional. Entregamos sugestões de planos e ações com um objetivo: que na segunda-feira de manhã, o professor, o diretor e a família saibam melhor sobre o que fazer diferente.
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA Footer */}
            <div className="bg-gray-50 border-t border-gray-200 py-16 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-8">Quer ver isso em prática?</h3>
                <Link
                    href="/lab"
                    className="bg-brand-brown text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-brown-900 transition-all hover:shadow-xl transform hover:-translate-y-1"
                >
                    Explorar o EcE Lab
                </Link>
            </div>
        </main>
    );
}
