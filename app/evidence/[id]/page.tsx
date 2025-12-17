import { createClient } from "@/utils/supabase/server";
import { ArrowLeft, BookOpen, ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Evidence } from "@/types/evidence";

export default async function EvidencePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch the evidence
    const { data: rawEvidence, error } = await supabase
        .from('evidences')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !rawEvidence) {
        return notFound();
    }

    const evidence = rawEvidence as Evidence;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <Link href="/lab" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-brown mb-8 transition-colors">
                    <ArrowLeft size={20} />
                    Voltar para o Lab
                </Link>

                <article className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-brand-brown to-brown-900 p-8 md:p-12 text-white">
                        <div className="flex items-center gap-3 mb-4 opacity-80">
                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                {evidence.validade_externa ? `Escala: ${evidence.validade_externa}` : 'Evidência'}
                            </span>
                            <span className="flex items-center gap-1 text-sm">
                                <Calendar size={14} />
                                {evidence.ano || '2024'}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                            {evidence.titulo}
                        </h1>
                        <p className="text-xl text-orange-50 font-light leading-relaxed max-w-2xl">
                            {evidence.resumo}
                        </p>
                    </div>

                    <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-2 space-y-8">
                            <section>
                                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                                    <BookOpen size={24} className="text-brand-brown" />
                                    O que diz a ciência?
                                </h3>
                                <div className="prose prose-brown max-w-none text-gray-600 leading-relaxed">
                                    {evidence.detalhes?.resultados_texto || evidence.resumo}
                                </div>
                            </section>

                            <section className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                                <h4 className="font-bold text-brand-brown mb-2">Aplicação Prática</h4>
                                <p className="text-gray-700">
                                    {evidence.acao}
                                </p>
                            </section>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Detalhes</h4>
                                <ul className="space-y-4 text-sm text-gray-600">
                                    <li className="flex flex-col">
                                        <span className="text-gray-400 text-xs">Certeza de Causa</span>
                                        <span className="font-medium text-gray-800">{evidence.validade_interna || 'N/A'}</span>
                                    </li>
                                    <li className="flex flex-col">
                                        <span className="text-gray-400 text-xs">Tags</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {evidence.tags?.map(tag => (
                                                <span key={tag} className="bg-gray-200 px-2 py-0.5 rounded text-xs">{tag}</span>
                                            ))}
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {evidence.link && (
                                <a
                                    href={evidence.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-white border-2 border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                    Ler Artigo Original
                                    <ExternalLink size={18} />
                                </a>
                            )}
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
