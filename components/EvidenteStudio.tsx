'use client';

import React, { useState } from 'react';
import { generateEducationalPlan } from '../app/lab/actions';
import { Sparkles, Download, Loader2, BookOpen } from 'lucide-react';
import { Evidence } from '../types/evidence'; // Adjust path if needed

interface EvidenteStudioProps {
    evidences: Evidence[];
}

export default function EvidenteStudio({ evidences }: EvidenteStudioProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.currentTarget);

        // Prepare context from top evidences (simplification)
        const evidenceContext = evidences.slice(0, 5).map(e => `- ${e.title}: ${e.action}`).join('\n');

        try {
            const html = await generateEducationalPlan(formData, evidenceContext);
            setGeneratedPlan(html);
        } catch (error) {
            console.error(error);
            alert("Erro ao gerar plano. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }

    const downloadPlan = () => {
        if (!generatedPlan) return;
        const blob = new Blob([generatedPlan], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Plano_EVidente_${new Date().toISOString().slice(0, 10)}.html`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-fade-in relative">
            {/* Decorative Background Elements */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-pink-300/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-300/10 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Form Section */}
            <div className="w-full lg:w-1/3 space-y-6 relative z-10">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-br from-pink-500 to-brand-brown rounded-2xl text-white shadow-lg shadow-pink-500/20">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">E-Vidente ✨</h3>
                            <p className="text-xs text-gray-500">Sua consultora pedagógica pessoal</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tema da Aula</label>
                            <input
                                name="topic"
                                required
                                type="text"
                                placeholder="Ex: Ciclo da Água, Revolução Francesa..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ano / Série</label>
                            <select name="grade" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none text-sm bg-white">
                                <optgroup label="Ensino Fundamental I">
                                    <option>1º Ano Fundamental</option>
                                    <option>2º Ano Fundamental</option>
                                    <option>3º Ano Fundamental</option>
                                    <option>4º Ano Fundamental</option>
                                    <option>5º Ano Fundamental</option>
                                </optgroup>
                                <optgroup label="Ensino Fundamental II">
                                    <option>6º Ano Fundamental</option>
                                    <option>7º Ano Fundamental</option>
                                    <option>8º Ano Fundamental</option>
                                    <option>9º Ano Fundamental</option>
                                </optgroup>
                                <optgroup label="Ensino Médio">
                                    <option>1º Ano Médio</option>
                                    <option>2º Ano Médio</option>
                                    <option>3º Ano Médio</option>
                                </optgroup>
                            </select>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <label className="block text-xs font-bold text-brand-brown uppercase tracking-wider mb-3">Duração do Planejamento</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Dias</label>
                                    <div className="relative">
                                        <input
                                            name="duration_days"
                                            type="number"
                                            min="1"
                                            defaultValue="1"
                                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none text-sm font-bold text-center"
                                            placeholder="1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tempo / Dia</label>
                                    <select name="duration_time" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none text-sm bg-white">
                                        <option>50 min</option>
                                        <option>100 min</option>
                                        <option>3 horas</option>
                                        <option>4 horas</option>
                                        <option>Personalizado</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contexto / Necessidade</label>
                            <textarea
                                name="context"
                                required
                                rows={4}
                                placeholder="Ex: Turma agitada, preciso de uma atividade prática em grupo..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none text-sm resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand-brown text-white py-4 rounded-xl font-bold hover:bg-brown-900 transition-all shadow-lg shadow-pink-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} className="group-hover:text-yellow-200 transition-colors" /> Gerar Planejamento</>}
                        </button>
                    </form>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-3xl border border-blue-100 hidden lg:block">
                    <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                        <BookOpen size={16} /> Dica pedagógica
                    </h4>
                    <p className="text-sm text-blue-700/80 leading-relaxed">
                        A E-Vidente utiliza o banco de evidências científicas para sugerir estratégias com maior probabilidade de sucesso para o seu contexto específico.
                    </p>
                </div>
            </div>

            {/* Result Section */}
            <div className="w-full lg:w-2/3 relative z-10">
                {generatedPlan ? (
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-full min-h-[600px] animate-slide-up">
                        <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Plano Gerado com Sucesso
                            </span>
                            <button
                                onClick={downloadPlan}
                                className="bg-white text-brand-brown px-4 py-2 rounded-lg text-sm font-bold shadow-sm border border-gray-200 hover:bg-pink-50 flex items-center gap-2 transition-colors"
                            >
                                <Download size={16} /> Baixar HTML
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto max-h-[800px] prose max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: generatedPlan }} />
                        </div>
                    </div>
                ) : (
                    <div className="h-full min-h-[500px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-white/50 backdrop-blur-sm">
                        <div className="w-24 h-24 bg-gradient-to-br from-white to-pink-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-white">
                            <Sparkles size={40} className="text-pink-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-500 mb-2">Seu plano aparecerá aqui</h3>
                        <p className="max-w-md leading-relaxed">
                            Preencha os dados ao lado e deixe a <strong>E-Vidente ✨</strong> criar uma estratégia baseada em evidências para você.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
