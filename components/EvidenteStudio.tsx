'use client';

import React, { useState } from 'react';
import { generateEducationalPlan, savePlan } from '../app/lab/actions';
import { Sparkles, Loader2, BookOpen, Save, Zap, Brain, Lock } from 'lucide-react';
import { Evidence } from '../types/evidence'; // Adjust path if needed

interface EvidenteStudioProps {
    evidences: Evidence[];
    userPlan: string; // 'free', 'casual', 'intensive'
    usageLimit: number;
}

export default function EvidenteStudio({ evidences, userPlan = 'free', usageLimit = 2 }: EvidenteStudioProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [generatedPlan, setGeneratedPlan] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<'gemini' | 'gpt-5.2'>('gemini');

    // Only show "Modo Degustação" if limit is small (e.g., Free Tier = 2)
    // If limit is high (Casual=10, Intensive=Unlimited), do not show this banner.
    const isFree = usageLimit < 5;

    async function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsGenerating(true);
        setGeneratedPlan(''); // Clear previous plan

        const form = e.currentTarget;
        const formData = new FormData(form);

        // Prepare context from top evidences (simplification)
        const evidenceContext = evidences.slice(0, 5).map(e => `- ${e.titulo}: ${e.acao}`).join('\n');

        try {
            const result = await generateEducationalPlan({
                topic: formData.get('topic') as string,
                grade: formData.get('grade') as string,
                context: formData.get('context') as string, // Ensure context is passed
                model: selectedModel,
                duration_days: formData.get('duration_days') as string,
                duration_time: formData.get('duration_time') as string,
                evidenceContext: evidenceContext // Pass evidence context
            });
            setGeneratedPlan(result.plan);
        } catch (error) {
            console.error(error);
            alert("Erro ao gerar plano. Tente novamente.");
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <div id="evidente-studio-root" className="flex flex-col lg:flex-row gap-8 animate-fade-in relative">
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

                    {isFree && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                            <Sparkles size={18} className="text-yellow-600 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-yellow-800 text-sm">Modo Degustação</h4>
                                <p className="text-xs text-yellow-700 mt-1">
                                    Você tem <strong>{usageLimit} gerações gratuitas</strong> por mês.
                                    <br />Para uso ilimitado, <a href="/plans" className="underline font-bold hover:text-yellow-900">faça um upgrade</a>.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Model Selector */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setSelectedModel('gemini')}
                            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${selectedModel === 'gemini'
                                ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm ring-1 ring-blue-200'
                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                }`}
                        >
                            <Zap size={24} className={selectedModel === 'gemini' ? 'text-blue-500' : 'text-gray-300'} />
                            <span className="text-xs font-bold text-center">E-Vidente Gênio (Gemini 3)</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => userPlan === 'intensive' && setSelectedModel('gpt-5.2')}
                            disabled={userPlan !== 'intensive'}
                            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden ${selectedModel === 'gpt-5.2'
                                ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-sm ring-1 ring-purple-200'
                                : 'bg-white border-gray-100 text-gray-400'
                                } ${userPlan !== 'intensive' ? 'opacity-60 cursor-not-allowed' : 'hover:border-purple-200 cursor-pointer'}`}
                        >
                            {userPlan !== 'intensive' && (
                                <div className="absolute inset-0 bg-gray-50/50 flex items-center justify-center z-10 backdrop-blur-[1px]">
                                    <Lock size={20} className="text-gray-400" />
                                </div>
                            )}
                            <Brain size={24} className={selectedModel === 'gpt-5.2' ? 'text-purple-500' : 'text-gray-300'} />
                            <span className="text-xs font-bold text-center">E-Vidente Gênio (GPT-5.2)</span>
                        </button>
                    </div>
                    <form onSubmit={handleGenerate} className="space-y-4">
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
                            disabled={isGenerating}
                            className="w-full bg-brand-brown text-white py-4 rounded-xl font-bold hover:bg-brown-900 transition-all shadow-lg shadow-pink-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} className="group-hover:text-yellow-200 transition-colors" /> Gerar Planejamento</>}
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
                        <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center print:hidden">
                            <span className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Plano Gerado com Sucesso
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={async () => {
                                        const form = document.querySelector('form') as HTMLFormElement;
                                        const formData = new FormData(form);
                                        const defaultTitle = formData.get('topic') as string || 'Plano Sem Título';

                                        // Ask for custom name
                                        const customTitle = window.prompt("Nome do Plano:", defaultTitle);
                                        if (customTitle === null) return; // Cancelled

                                        setIsSaving(true);
                                        const grade = formData.get('grade') as string || 'Geral';

                                        const res = await savePlan({
                                            title: customTitle || defaultTitle,
                                            html: generatedPlan,
                                            grade
                                        });

                                        setIsSaving(false);
                                        if (res?.success) {
                                            alert("Plano salvo com sucesso!");
                                        } else {
                                            alert("Erro ao salvar plano.");
                                        }
                                    }}
                                    disabled={isSaving}
                                    className="bg-brand-brown/10 text-brand-brown px-4 py-2 rounded-lg text-sm font-bold shadow-sm border border-brand-brown/20 hover:bg-brand-brown/20 flex items-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    {isSaving ? 'Salvando...' : 'Salvar no Painel'}
                                </button>
                            </div>
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
