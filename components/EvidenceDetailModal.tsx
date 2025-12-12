import React from 'react';
import { X, Target, GitMerge, BookOpen, ExternalLink } from 'lucide-react';
import { Evidence } from '../types/evidence';

interface EvidenceDetailModalProps {
    evidence: Evidence;
    onClose: () => void;
}

const ValidityBadge = ({ value }: { value: string }) => {
    const colors = {
        'Excelente': 'bg-green-100 text-green-800 border-green-200',
        'Boa': 'bg-green-50 text-green-700 border-green-200',
        'Moderada': 'bg-yellow-50 text-yellow-800 border-yellow-200',
        'Baixa': 'bg-orange-100 text-orange-800 border-orange-200',
        'Muito Baixa': 'bg-red-50 text-red-800 border-red-200',
        'Alta': 'bg-green-100 text-green-800 border-green-200',
        'Média': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Média-baixa': 'bg-orange-50 text-orange-800 border-orange-200',
        'Limitada': 'bg-orange-50 text-orange-800 border-orange-200',
        'Muito Limitada': 'bg-red-50 text-red-800 border-red-200',
    };
    // @ts-expect-error Index signature is missing in type
    const colorClass = colors[value] || 'bg-gray-100 text-gray-800';

    return <span className={`px-2 py-1 rounded-md text-xs font-bold border ${colorClass}`}>{value}</span>;
};

export default function EvidenceDetailModal({ evidence, onClose }: EvidenceDetailModalProps) {
    if (!evidence.details) return null;

    const { details } = evidence;

    // Helper para formatar texto (novas linhas literais e markdown simples)
    const formatText = (text: string) => {
        if (!text) return '';
        return text
            .replace(/\\n/g, '<br/>') // Remove literal \n
            .replace(/\n/g, '<br/>')  // Remove newlines reais
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold simples
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end transition-opacity">
            <div className="bg-white w-full max-w-2xl h-full overflow-y-auto shadow-2xl animate-slide-in-right">
                {/* Header */}
                <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-gray-100 px-8 py-6 flex justify-between items-start z-10">
                    <div>
                        <div className="flex gap-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold border bg-purple-50 text-purple-700 border-purple-100`}>
                                Certeza: {evidence.validade_interna}
                            </span>
                            {evidence.tags.map(t => <span key={t} className="px-2 py-1 rounded-full text-xs bg-pink-50 text-brand-brown">#{t}</span>)}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">{evidence.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-8 space-y-12">
                    {/* Resumo Aside */}
                    <aside className="bg-pink-50/50 p-6 rounded-2xl border-l-4 border-brand-brown text-gray-700 italic leading-relaxed">
                        <span className="block text-2xl mb-2">✏️</span>
                        <div dangerouslySetInnerHTML={{ __html: formatText(details.resumo_aside) }} />
                    </aside>

                    {/* Para quem é? */}
                    <section>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                            <Target className="text-brand-brown" /> Para quem é?
                        </h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            {(details.publico_alvo || []).map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}
                        </ul>
                    </section>

                    {/* Metodologia */}
                    <section>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                            <GitMerge className="text-brand-brown" /> Metodologia (Passo a Passo)
                        </h3>
                        <div className="space-y-4">
                            {(details.metodologia_passos || []).map((step, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="font-bold text-brand-brown whitespace-nowrap">{i + 1}. {step.titulo}</div>
                                    <div className="text-gray-600 text-sm">{step.descricao}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Resultados Box */}
                    <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">📊 Resultados Principais</h3>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {(details.resultados_key || []).map((res, i) => (
                                <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{res.label}</div>
                                    <div className="text-xl font-bold text-brand-brown">{res.valor}</div>
                                    <div className="text-xs text-gray-400 mt-1">{res.descricao}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Tabela de Evidências */}
                    <section>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                            📐 Quadro de Evidências
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-600 font-bold">
                                    <tr>
                                        <th className="p-3 rounded-tl-lg">Desfecho</th>
                                        <th className="p-3">Efeito</th>
                                        <th className="p-3">Tamanho</th>
                                        <th className="p-3 rounded-tr-lg">Obs</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {(details.tabela_evidencias || []).map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="p-3 font-medium text-gray-800">{row.desfecho}</td>
                                            <td className="p-3 text-brand-pink font-bold">{row.efeito}</td>
                                            <td className="p-3">{row.tamanho}</td>
                                            <td className="p-3 text-gray-500 text-xs">{row.observacoes}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Diagnóstico EcE.Lab (Atualizado) */}
                    <section>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                            📰 Diagnóstico Metodológico
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-600">Certeza de Causa (Validade Interna)</span>
                                    <span className="text-xs text-gray-400">O estudo isolou bem a causa?</span>
                                </div>
                                <ValidityBadge value={evidence.validade_interna} />
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-600">Precisão dos Dados (Confiabilidade)</span>
                                    <span className="text-xs text-gray-400">Precisão estatística dos dados?</span>
                                </div>
                                <ValidityBadge value={evidence.confiabilidade} />
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-600">Potencial de Escala (Validade Externa)</span>
                                    <span className="text-xs text-gray-400">Generalizável para outros contextos?</span>
                                </div>
                                <ValidityBadge value={evidence.validade_externa} />
                            </div>
                        </div>
                    </section>

                    {/* Recomendações */}
                    <section>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                            ✅ Recomendações
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                <div className="font-bold text-green-800 mb-1">Quando usar</div>
                                <p className="text-sm text-green-700">{details.recomendacoes?.uso}</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                <div className="font-bold text-red-800 mb-1">Quando evitar</div>
                                <p className="text-sm text-red-700">{details.recomendacoes?.evitar}</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 md:col-span-2">
                                <div className="font-bold text-blue-800 mb-1">Recursos Necessários</div>
                                <p className="text-sm text-blue-700">{details.recomendacoes?.recursos}</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t border-gray-100 p-8 text-center text-xs text-gray-400">
                    <BookOpen size={16} className="mx-auto mb-2 text-gray-300" />
                    <p>{details.referencia}</p>
                    {evidence.link && (
                        <a href={evidence.link} target="_blank" className="inline-flex items-center gap-1 mt-4 text-brand-brown hover:underline font-bold">
                            <ExternalLink size={12} /> Ver estudo original
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
