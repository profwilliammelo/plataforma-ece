'use client';

import React, { useState } from 'react';
import { generateEducationalPlan, savePlan, chatWithPlan } from '../app/lab/actions';
import { Sparkles, Loader2, BookOpen, Save, Zap, Brain, Lock, ArrowRight, Download, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Type, Heading1, Heading2, Palette, Undo, Redo, Highlighter } from 'lucide-react';
import { Evidence } from '../types/evidence'; // Adjust path if needed

interface EvidenteStudioProps {
    evidences: Evidence[];
    userPlan: string; // 'free', 'casual', 'intensive'
    usageLimit: number;
}

const ToolbarButton = ({ onClick, icon: Icon, title }: { onClick: () => void, icon: any, title: string }) => (
    <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); onClick(); }}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
        title={title}
    >
        <Icon size={16} />
    </button>
);

export default function EvidenteStudio({ evidences, userPlan = 'free', usageLimit = 2 }: EvidenteStudioProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [generatedPlan, setGeneratedPlan] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<'gemini' | 'gpt-5.2'>('gemini');
    const editorRef = React.useRef<HTMLDivElement>(null);

    // Feature States
    const [style, setStyle] = useState('academic');
    const [includeERER, setIncludeERER] = useState(false);
    const [loadingStep, setLoadingStep] = useState(1);

    // Chat States
    const [generationTime, setGenerationTime] = useState(0);
    const [lastGenerationTime, setLastGenerationTime] = useState(0);

    // Chat States
    const [chatOpen, setChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', parts: string }[]>([]);
    const [isChatting, setIsChatting] = useState(false);
    const [isChatMinimized, setIsChatMinimized] = useState(false);

    const execCmd = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    // Timer Effect
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isGenerating) {
            setGenerationTime(0);
            interval = setInterval(() => {
                setGenerationTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isGenerating]);

    // Only show "Modo Degustação" if limit is small (e.g., Free Tier = 2)
    // If limit is high (Casual=10, Intensive=Unlimited), do not show this banner.
    const isFree = usageLimit < 5;

    const formatTime = (seconds: number) => {
        if (seconds < 60) return `${seconds} segundos`;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins} minuto${mins > 1 ? 's' : ''} e ${secs} segundo${secs > 1 ? 's' : ''}`;
    };

    async function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsGenerating(true);
        setLoadingStep(1);
        setGeneratedPlan('');
        setLastGenerationTime(0);

        // Animation Simulation
        const stepInterval = setInterval(() => {
            setLoadingStep(prev => prev < 5 ? prev + 1 : prev);
        }, 3000);

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            // Note: evidenceContext removed. The server now fetches ALL evidence from the database.
            const result = await generateEducationalPlan({
                topic: formData.get('topic') as string,
                grade: formData.get('grade') as string,
                context: formData.get('context') as string,
                model: selectedModel,
                duration_days: formData.get('duration_days') as string,
                duration_time: formData.get('duration_time') as string,
                style,
                includeERER
            });
            setGeneratedPlan(result.plan);
            setLastGenerationTime(generationTime); // Will settle shortly due to scope, mostly approximate is fine or use ref
            setChatOpen(true);
        } catch (error) {
            console.error(error);
            alert("Erro ao gerar plano. Tente novamente.");
        } finally {
            clearInterval(stepInterval);
            setIsGenerating(false);
            setLastGenerationTime(prev => prev || generationTime); // Save the time
        }
    }

    const handleChatSend = async () => {
        if (!chatInput.trim()) return;
        const msg = chatInput;
        setChatInput('');
        setChatHistory(prev => [...prev, { role: 'user', parts: msg }]);
        setIsChatting(true);

        try {
            const result = await chatWithPlan(chatHistory, generatedPlan, msg);
            if (result.response) {
                let finalResponse = result.response;

                // Real-time Update Logic
                const planStart = result.response.indexOf(':::PLAN_START:::');
                const planEnd = result.response.indexOf(':::PLAN_END:::');

                if (planStart !== -1 && planEnd !== -1) {
                    // Extract HTML
                    const newHtml = result.response.substring(planStart + 16, planEnd).trim();
                    setGeneratedPlan(newHtml);

                    // Update the editor content directly if ref exists
                    if (editorRef.current) {
                        editorRef.current.innerHTML = newHtml;
                    }

                    // Clean message for chat
                    const part1 = result.response.substring(0, planStart).trim();
                    const part2 = result.response.substring(planEnd + 14).trim();
                    finalResponse = `${part1} ${part2}`.trim();
                    if (!finalResponse) finalResponse = "Plan atualizado com sucesso!";
                }

                setChatHistory(prev => [...prev, { role: 'model', parts: finalResponse }]);
            }
        } catch (e: any) {
            console.error(e);
            if (e.message?.includes('Unauthorized') || e.message?.includes('Not logged in')) {
                alert("Sua sessão expirou. Por favor, faça login novamente.");
                window.location.href = '/login';
            } else {
                alert("Ocorreu um erro ao processar sua mensagem. Tente novamente.");
            }
        } finally {
            setIsChatting(false);
        }
    };

    const printPlan = () => {
        // Update state with current editor html before printing just in case
        if (editorRef.current) {
            setGeneratedPlan(editorRef.current.innerHTML);
        }

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>Plano de Aula E-Vidente</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        @media print {
                            @page {
                                margin: 15mm;
                                size: A4;
                            }
                            body {
                                margin: 0;
                                padding: 0;
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                            #print-content {
                                width: 100%;
                                margin: 0 auto;
                            }
                        }
                    </style>
                </head>
                <body class="bg-white text-black">
                    <div id="print-content" class="max-w-4xl mx-auto p-8 lg:p-12 prose prose-slate prose-headings:text-slate-900 prose-p:text-slate-800">
                        ${editorRef.current ? editorRef.current.innerHTML : generatedPlan}
                    </div>
                    <script>
                        // Wait for Tailwind and Fonts
                        setTimeout(() => {
                            window.print();
                        }, 1000);
                    </script>
                </body>
                </html>
            `);
        }
    };

    return (
        <div id="evidente-studio-root" className="flex flex-col lg:flex-row gap-8 animate-fade-in relative min-h-screen">
            {/* Decorative Background Elements */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-pink-300/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-300/10 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Form Section */}
            <div className={`w-full lg:w-1/3 space-y-6 relative z-10 transition-all duration-500 ${generatedPlan ? 'hidden xl:block' : ''}`}>
                {/* Note: Hiding form on smaller desktop screens when plan is visible to focus on content, but widely visible on XL */}
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

                        {/* Style Selector */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Estilo do Documento</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['academic', 'gamified', 'tech', 'minimalist'].map(s => (
                                    <button
                                        type="button"
                                        key={s}
                                        onClick={() => setStyle(s)}
                                        className={`p-2 rounded-lg text-xs font-medium border transition-all ${style === s ? 'bg-brand-brown text-white border-brand-brown shadow-md' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                                    >
                                        {s === 'academic' && '🎓 Acadêmico'}
                                        {s === 'gamified' && '🎮 Gamificado'}
                                        {s === 'tech' && '🤖 Tecnológico'}
                                        {s === 'minimalist' && '✨ Minimalista'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ERER Toggle */}
                        <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-4 rounded-xl border border-orange-100 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-brand-brown text-sm">Modo E-Vidente 10639</span>
                                    <span className="bg-brand-brown text-white text-[10px] px-1.5 rounded-full" title="Lei 10.639">ERER</span>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1 leading-tight">Enriquece o plano com história e cultura afro-brasileira.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIncludeERER(!includeERER)}
                                className={`w-10 h-6 rounded-full transition-colors relative ${includeERER ? 'bg-brand-brown' : 'bg-gray-300'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${includeERER ? 'left-5' : 'left-1'}`} />
                            </button>
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
            <div className={`w-full ${generatedPlan ? 'lg:w-2/3 lg:flex-1' : 'lg:w-2/3'} relative z-10 transition-all duration-500`}>
                {generatedPlan ? (
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-full min-h-[600px] animate-slide-up">
                        <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center print:hidden">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    Plano Gerado com Sucesso
                                </span>
                                {lastGenerationTime > 0 && (
                                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md hidden lg:inline-block">
                                        Pensou por {formatTime(lastGenerationTime)}
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setChatOpen(true); setIsChatMinimized(false); }}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${chatOpen ? 'bg-pink-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                                >
                                    <Sparkles size={16} /> Chat
                                </button>
                                <button onClick={printPlan} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-200 flex items-center gap-2">
                                    <Download size={16} /> PDF
                                </button>
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
                                            html: editorRef.current?.innerHTML || generatedPlan,
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
                                    {isSaving ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </div>
                        <div className="bg-blue-50/50 p-2 text-xs text-center text-blue-600 border-b border-blue-100 print:hidden">
                            ✏️ <strong>Modo Edição Livre:</strong> Clique em qualquer texto abaixo para editar, apagar ou corrigir.
                        </div>

                        {/* Editor Toolbar */}
                        <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1 print:hidden">
                            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
                                <ToolbarButton onClick={() => execCmd('undo')} icon={Undo} title="Desfazer" />
                                <ToolbarButton onClick={() => execCmd('redo')} icon={Redo} title="Refazer" />
                            </div>
                            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
                                <ToolbarButton onClick={() => execCmd('formatBlock', 'H1')} icon={Heading1} title="Título 1" />
                                <ToolbarButton onClick={() => execCmd('formatBlock', 'H2')} icon={Heading2} title="Título 2" />
                                <ToolbarButton onClick={() => execCmd('formatBlock', 'p')} icon={Type} title="Parágrafo" />
                            </div>
                            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
                                <ToolbarButton onClick={() => execCmd('bold')} icon={Bold} title="Negrito" />
                                <ToolbarButton onClick={() => execCmd('italic')} icon={Italic} title="Itálico" />
                                <ToolbarButton onClick={() => execCmd('underline')} icon={Underline} title="Sublinhado" />
                            </div>
                            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
                                <ToolbarButton onClick={() => execCmd('justifyLeft')} icon={AlignLeft} title="Esquerda" />
                                <ToolbarButton onClick={() => execCmd('justifyCenter')} icon={AlignCenter} title="Centro" />
                                <ToolbarButton onClick={() => execCmd('justifyRight')} icon={AlignRight} title="Direita" />
                            </div>
                            <div className="flex items-center gap-1">
                                <ToolbarButton onClick={() => execCmd('insertUnorderedList')} icon={List} title="Lista com Marcadores" />
                                <button onClick={() => execCmd('insertOrderedList')} className="p-2 hover:bg-gray-100 rounded text-gray-600" title="Lista Numerada"><ListOrdered size={18} /></button>
                                <div className="w-px h-6 bg-gray-200 mx-2"></div>

                                {/* Color Pickers */}
                                <div className="flex items-center gap-1">
                                    <label className="cursor-pointer p-2 hover:bg-gray-100 rounded text-gray-600 flex items-center gap-1" title="Cor do Texto">
                                        <span className="font-bold text-xs">A</span>
                                        <div className="w-4 h-4 rounded-full border border-gray-200 overflow-hidden">
                                            <input
                                                type="color"
                                                onChange={(e) => execCmd('foreColor', e.target.value)}
                                                className="w-8 h-8 -m-2 cursor-pointer"
                                            />
                                        </div>
                                    </label>
                                    <label className="cursor-pointer p-2 hover:bg-gray-100 rounded text-gray-600 flex items-center gap-1" title="Cor de Fundo (Marca-texto)">
                                        <Highlighter size={16} />
                                        <div className="w-4 h-4 rounded-full border border-gray-200 overflow-hidden">
                                            <input
                                                type="color"
                                                onChange={(e) => execCmd('hiliteColor', e.target.value)}
                                                className="w-8 h-8 -m-2 cursor-pointer"
                                                defaultValue="#ffff00"
                                            />
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div
                            className="p-8 overflow-y-auto max-h-[800px] prose max-w-none focus:outline-none focus:ring-2 focus:ring-pink-100/50 transition-all custom-scrollbar"
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            ref={editorRef}
                            dangerouslySetInnerHTML={{ __html: generatedPlan }}
                            onBlur={(e) => setGeneratedPlan(e.currentTarget.innerHTML)}
                        />
                    </div>
                ) : (<div className="h-full min-h-[500px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-white/50 backdrop-blur-sm">

                    {isGenerating ? (
                        <div className="max-w-md w-full">
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-full border-4 border-gray-100"></div>
                                    <div className="w-20 h-20 rounded-full border-4 border-brand-brown border-t-transparent animate-spin absolute top-0 left-0"></div>
                                    <div className="absolute top-0 left-0 w-20 h-20 flex items-center justify-center">
                                        <Sparkles className="text-pink-500 animate-pulse" size={24} />
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2 animate-pulse">
                                {loadingStep === 1 && `Analisando ${evidences?.length || 50}+ evidências do acervo...`}
                                {loadingStep === 2 && "Selecionando as melhores estratégias (ABNT)..."}
                                {loadingStep === 3 && (includeERER ? "Conectando saberes ancestrais e Lei 10.639..." : "Estruturando objetivos e justificativas...")}
                                {loadingStep === 4 && "Desenhando a experiência visual..."}
                                {loadingStep >= 5 && "Finalizando detalhes..."}
                            </h3>
                            <div className="flex justify-center mt-2">
                                <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-mono text-gray-500 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                    {formatTime(generationTime)}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-24 h-24 bg-gradient-to-br from-white to-pink-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-white">
                                <Sparkles size={40} className="text-pink-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-500 mb-2">Seu plano aparecerá aqui</h3>
                            <p className="max-w-md leading-relaxed">
                                Preencha os dados e escolha o <strong>estilo</strong> para a IA criar sua aula.
                            </p>
                        </>
                    )}
                </div>
                )}
            </div>

            {/* CHAT OVERLAY/PANEL (Responsive & Minimizable) */}
            {chatOpen && generatedPlan && (
                <div
                    className={`
                        fixed z-50 transition-all duration-300 ease-in-out flex flex-col shadow-2xl bg-white
                        ${isChatMinimized
                            ? 'bottom-8 right-8 w-14 h-14 rounded-full overflow-hidden bg-brand-brown cursor-pointer hover:scale-110'
                            : 'top-0 right-0 h-full w-full lg:w-[400px] border-l border-gray-200'
                        }
                    `}
                    onClick={isChatMinimized ? () => setIsChatMinimized(false) : undefined}
                >
                    {isChatMinimized ? (
                        /* Minimized State (Icon Only) */
                        <div className="w-full h-full flex items-center justify-center text-white" title="Expandir Chat">
                            <Sparkles size={24} />
                        </div>
                    ) : (
                        /* Maximized State */
                        <>
                            {/* Header */}
                            <div className="bg-pink-50 p-4 border-b border-pink-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-brand-brown flex items-center gap-2 text-sm">
                                        <Sparkles size={16} /> Chat E-Vidente
                                    </h3>
                                    <span className="text-[10px] text-pink-600 font-medium">Refine seu plano</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsChatMinimized(true); }}
                                        className="p-1 text-gray-400 hover:text-brand-brown hover:bg-pink-100 rounded hidden lg:block"
                                        title="Minimizar"
                                    >
                                        <span className="block w-4 h-[2px] bg-current mt-2"></span>
                                    </button>
                                    <button
                                        onClick={() => setChatOpen(false)}
                                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                                        title="Fechar"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 custom-scrollbar">
                                {chatHistory.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${msg.role === 'user' ? 'bg-brand-brown text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none shadow-sm'}`}>
                                            {msg.parts}
                                        </div>
                                    </div>
                                ))}
                                {isChatting && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-gray-200 text-gray-500 rounded-2xl rounded-tl-none p-3 text-xs shadow-sm flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input */}
                            <div className="p-3 border-t border-gray-100 bg-white">
                                <div className="relative">
                                    <input
                                        className="w-full pl-3 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-brown outline-none text-xs"
                                        placeholder="Digite sua dúvida..."
                                        value={chatInput}
                                        onChange={e => setChatInput(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleChatSend();
                                            }
                                        }}
                                        disabled={isChatting}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleChatSend}
                                        disabled={isChatting || !chatInput.trim()}
                                        className="absolute right-2 top-2 p-1.5 bg-brand-brown text-white rounded-lg hover:bg-brown-900 disabled:opacity-50 transition-colors"
                                    >
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
