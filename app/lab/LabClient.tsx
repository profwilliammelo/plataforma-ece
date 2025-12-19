'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, Map, Search, Heart, Lightbulb, Filter, Download, FileText, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { Evidence } from '../../types/evidence';
import EvidenceDetailModal from '../../components/EvidenceDetailModal';
import UserHeader from '../../components/UserHeader';
import { User } from '@supabase/supabase-js';
import { toggleFavorite, generateEducationalPlan, chatWithPlan } from './actions';


interface LabClientProps {
    initialEvidenceData: Evidence[] | null;
    user: User | null;
    profile: { full_name?: string; acesso_bia?: boolean;[key: string]: unknown };
    initialFavorites: string[]; // List of evidence IDs
}

export default function LabClient({ initialEvidenceData, user, profile, initialFavorites = [] }: LabClientProps) {
    const [activeTab, setActiveTab] = useState('library');
    const [evidenceData] = useState<Evidence[]>(initialEvidenceData || []);
    const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
    const [favorites, setFavorites] = useState<Set<string>>(new Set(initialFavorites));

    // --- STATES DO GERADOR DE PLANOS ---
    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState('');
    const [days, setDays] = useState('1');
    const [timePerDay, setTimePerDay] = useState('50 min');
    const [context, setContext] = useState('');
    const [style, setStyle] = useState('academic');
    const [includeERER, setIncludeERER] = useState(false);

    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPlan, setGeneratedPlan] = useState('');
    const [loadingStep, setLoadingStep] = useState(1); // 1-5 for animation

    // --- STATES DO CHAT ---
    const [chatOpen, setChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', parts: string }[]>([]);
    const [isChatting, setIsChatting] = useState(false);

    // --- HANDLERS ---
    const handleGenerate = async () => {
        setIsGenerating(true);
        setLoadingStep(1);

        // Simulation of steps
        const stepInterval = setInterval(() => {
            setLoadingStep(prev => prev < 5 ? prev + 1 : prev);
        }, 3000);

        try {
            const { plan } = await generateEducationalPlan({
                topic, grade, context,
                duration_days: days, duration_time: timePerDay,
                style, includeERER
            });
            setGeneratedPlan(plan);
            setChatOpen(true); // Auto open chat on success
        } catch (e) {
            console.error(e);
            alert("Erro ao gerar plano. Tente novamente.");
        } finally {
            clearInterval(stepInterval);
            setIsGenerating(false);
        }
    };

    const handleChatSend = async () => {
        if (!chatInput.trim()) return;
        const msg = chatInput;
        setChatInput('');
        setChatHistory(prev => [...prev, { role: 'user', parts: msg }]);
        setIsChatting(true);

        try {
            const result = await chatWithPlan(chatHistory, generatedPlan, msg);
            if (result.response) {
                setChatHistory(prev => [...prev, { role: 'model', parts: result.response }]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsChatting(false);
        }
    };

    const printPlan = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>Plano de Aula E-Vidente</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                </head>
                <body class="p-8">
                    <div class="max-w-4xl mx-auto prose">
                        ${generatedPlan}
                    </div>
                    <script>
                        setTimeout(() => { window.print(); window.close(); }, 500);
                    </script>
                </body>
                </html>
            `);
        }
    };

    const handleToggleFavorite = async (e: React.MouseEvent, evidenceID: string) => {
        e.stopPropagation(); // Prevent opening modal
        if (!user) return; // Or show toaster "Faça login"

        // Optimistic UI
        const newFavorites = new Set(favorites);
        if (newFavorites.has(evidenceID)) {
            newFavorites.delete(evidenceID);
        } else {
            newFavorites.add(evidenceID);
        }
        setFavorites(newFavorites);

        // Server Action
        try {
            await toggleFavorite(evidenceID);
        } catch (err) {
            console.error(err);
            // Revert on error would go here
        }
    };

    // States de Filtro
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Novos Filtros (3 Critérios)
    const [filterVI, setFilterVI] = useState<string[]>([]); // Validade Interna
    const [filterConf, setFilterConf] = useState<string[]>([]); // Confiabilidade
    const [filterVE, setFilterVE] = useState<string[]>([]); // Validade Externa

    // Extrair opções únicas para filtros (Dinâmico e Ordenado)
    const customSort = (a: string, b: string) => {
        const order = { 'Alta': 1, 'Média': 2, 'Baixa': 3, 'N/A': 4 };
        return (order[a as keyof typeof order] || 99) - (order[b as keyof typeof order] || 99);
    };

    const allTags = Array.from(new Set(evidenceData.flatMap(item => item.tags || []))).sort();

    // Filtros dinâmicos baseados nos dados existentes
    const optionsVI = Array.from(new Set(evidenceData.map(item => item.validade_interna || 'N/A'))).sort(customSort);
    const optionsConf = Array.from(new Set(evidenceData.map(item => item.confiabilidade || 'N/A'))).sort(customSort);
    const optionsVE = Array.from(new Set(evidenceData.map(item => item.validade_externa || 'N/A'))).sort(customSort);

    // Lógica de Filtragem
    const filteredData = useMemo(() => {
        return evidenceData.filter(item => {
            const matchesSearch =
                item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.resumo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.acao.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesTags = selectedTags.length === 0 || (item.tags && item.tags.some(tag => selectedTags.includes(tag)));

            // Novos Matches
            const matchesVI = filterVI.length === 0 || filterVI.includes(item.validade_interna || 'N/A');
            const matchesConf = filterConf.length === 0 || filterConf.includes(item.confiabilidade || 'N/A');
            const matchesVE = filterVE.length === 0 || filterVE.includes(item.validade_externa || 'N/A');

            return matchesSearch && matchesTags && matchesVI && matchesConf && matchesVE;
        });
    }, [evidenceData, searchTerm, selectedTags, filterVI, filterConf, filterVE]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const toggleCriteria = (criteria: 'VI' | 'Conf' | 'VE', value: string) => {
        if (criteria === 'VI') setFilterVI(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
        if (criteria === 'Conf') setFilterConf(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
        if (criteria === 'VE') setFilterVE(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    };

    const getColor = (level: string) => {
        switch (level) {
            case 'Alta': return 'bg-green-100 text-green-800 border-green-200';
            case 'Média': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Baixa': return 'bg-orange-100 text-orange-800 border-orange-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // --- FUNÇÕES DE EXPORTAÇÃO ---

    const exportToCSV = () => {
        const headers = ['ID', 'Título', 'Resumo', 'Ação', 'Tags', 'Certeza de Causa', 'Precisão dos Dados', 'Potencial de Escala', 'Ano', 'Link'];
        const csvContent = [
            headers.join(','),
            ...filteredData.map(item => [
                item.id,
                `"${item.titulo.replace(/"/g, '""')}"`,
                `"${item.resumo.replace(/"/g, '""')}"`,
                `"${item.acao.replace(/"/g, '""')}"`,
                `"${(item.tags || []).join(', ')}"`,
                item.validade_interna,
                item.confiabilidade,
                item.validade_externa,
                item.ano || '',
                item.link || ''
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'evidencias_ece.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const generateHTMLReport = () => {
        const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Relatório de Evidências - EcE</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1A1A1A; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 40px; background-color: #f9fafb; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #5D4037; padding-bottom: 20px; }
          .header h1 { color: #5D4037; margin: 0; font-size: 28px; }
          .header p { color: #666; margin-top: 5px; }
          .summary-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 30px; display: flex; justify-content: space-around; }
          .stat { text-align: center; }
          .stat-value { font-size: 24px; font-weight: bold; color: #D81B60; }
          .stat-label { font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
          .evidence-item { background: white; border-radius: 16px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #eee; break-inside: avoid; }
          .evidence-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
          .badges { display: flex; gap: 5px; }
          .validity { font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 4px; border: 1px solid #eee; }
          .title { font-size: 18px; font-weight: bold; margin: 0 0 10px 0; color: #1A1A1A; }
          .section-title { font-size: 12px; font-weight: bold; color: #5D4037; text-transform: uppercase; margin-bottom: 5px; display: flex; align-items: center; gap: 5px; }
          .action-box { background-color: #FFF0F5; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #D81B60; }
          .tags { margin-top: 15px; }
          .tag { display: inline-block; background: #f3f4f6; color: #4b5563; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-right: 5px; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório de Evidências</h1>
          <p>Plataforma Educação com Evidências</p>
          <p style="font-size: 14px; margin-top: 5px;">Gerado em: ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="summary-card">
          <div class="stat">
            <div class="stat-value">${filteredData.length}</div>
            <div class="stat-label">Evidências Listadas</div>
          </div>
          <div class="stat">
            <div class="stat-value">${activeTab === 'library' ? 'Biblioteca' : 'Monitor'}</div>
            <div class="stat-label">Origem</div>
          </div>
        </div>

        ${filteredData.map(item => `
          <div class="evidence-item">
            <div class="evidence-header">
              <div class="badges">
                  <span class="validity" title="Certeza de Causa">Causa: ${item.validade_interna}</span>
                  <span class="validity" title="Precisão dos Dados">Dados: ${item.confiabilidade}</span>
                  <span class="validity" title="Potencial de Escala">Escala: ${item.validade_externa}</span>
              </div>
              ${item.ano ? `<span style="font-size: 12px; color: #666;">Ano: ${item.ano}</span>` : ''}
            </div>
            <h2 class="title">${item.titulo}</h2>
            <p style="color: #444; font-size: 14px; margin-bottom: 0;">${item.resumo}</p>
            
            <div class="action-box">
              <div class="section-title">⚡ Ação Prática</div>
              <div style="font-size: 14px;">${item.acao}</div>
            </div>

            <div style="margin-top: 15px; display: flex; justify-content: space-between; align-items: center;">
              <div class="tags">
                ${(item.tags || []).map(tag => `<span class="tag">#${tag}</span>`).join('')}
              </div>
              ${item.link ? `<a href="${item.link}" target="_blank" style="font-size: 12px; color: #5D4037; text-decoration: none;">🔗 Ver Fonte Original</a>` : ''}
            </div>
          </div>
        `).join('')}

        <div class="footer">
          © ${new Date().getFullYear()} Plataforma EcE - Secretaria de Educação e Ciências
        </div>
      </body>
      </html>
    `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Relatorio_EcE_${new Date().toISOString().slice(0, 10)}.html`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Modal de Detalhes */}
            {selectedEvidence && (
                <EvidenceDetailModal
                    evidence={selectedEvidence}
                    onClose={() => setSelectedEvidence(null)}
                />
            )}

            {/* Lab Header */}
            <div className="bg-brand-brown pt-12 pb-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Lightbulb className="text-yellow-300" /> EcE Lab
                    </h2>
                    <p className="text-pink-100 max-w-2xl">
                        A ponte entre a teoria e a sua sala de aula. Navegue por evidências ou explore os dados do seu território.
                    </p>
                </div>
                {user && (
                    <div className="absolute top-8 right-8">
                        <UserHeader user={user} profile={profile} />
                    </div>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-16">
                {/* Tabs & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2 inline-flex flex-wrap">
                        <button
                            onClick={() => setActiveTab('library')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'library'
                                ? 'bg-pink-100 text-brand-brown'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <BookOpen size={18} />
                            Biblioteca
                        </button>
                        <button
                            onClick={() => setActiveTab('data')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'data'
                                ? 'bg-pink-100 text-brand-brown'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <Map size={18} />
                            Recursos Digitais
                        </button>
                    </div>

                    {activeTab === 'library' && (
                        <div className="flex gap-2">
                            <button
                                onClick={exportToCSV}
                                className="bg-white p-3 rounded-xl text-brand-brown hover:bg-pink-50 shadow-sm border border-gray-100 tooltip"
                                title="Baixar CSV"
                            >
                                <Download size={20} />
                            </button>
                            <button
                                onClick={generateHTMLReport}
                                className="bg-brand-brown p-3 rounded-xl text-white hover:bg-brown-900 shadow-lg shadow-pink-900/20 tooltip"
                                title="Gerar Relatório HTML"
                            >
                                <FileText size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                {activeTab === 'library' ? (
                    <div className="animate-fade-in">
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-3.5 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Busque por título, resumo ou ação..."
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none shadow-sm"
                                    />
                                </div>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`px-6 py-3 rounded-xl border font-medium hover:bg-gray-50 flex items-center gap-2 transition-colors ${showFilters ? 'bg-pink-50 border-pink-200 text-brand-brown' : 'bg-white border-gray-200 text-gray-700'}`}
                                >
                                    <Filter size={18} />
                                    Filtros
                                    {(selectedTags.length > 0 || filterVI.length > 0 || filterConf.length > 0 || filterVE.length > 0) && (
                                        <span className="bg-brand-brown text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
                                            {selectedTags.length + filterVI.length + filterConf.length + filterVE.length}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Painel de Filtros */}
                            {showFilters && (
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-slide-down">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-gray-800">Refinar Busca</h3>
                                        <button onClick={() => { setSearchTerm(''); setSelectedTags([]); setFilterVI([]); setFilterConf([]); setFilterVE([]); }} className="text-xs text-pink-600 hover:underline">Limpar Filtros</button>
                                    </div>

                                    <div className="grid md:grid-cols-4 gap-6">
                                        <div>
                                            <div className="flex items-center gap-1 mb-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Certeza de Causa</label>
                                                <span className="text-[10px] text-gray-400 bg-gray-50 px-1 rounded border border-gray-100" title="Validade Interna: O quanto podemos confiar que a ação causou o resultado?">?</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {optionsVI.map(val => (
                                                    <button key={val} onClick={() => toggleCriteria('VI', val)} className={`px-2 py-1 rounded text-xs border ${filterVI.includes(val) ? 'bg-brand-brown text-white' : 'bg-gray-50'}`}>{val}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1 mb-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Precisão dos Dados</label>
                                                <span className="text-[10px] text-gray-400 bg-gray-50 px-1 rounded border border-gray-100" title="Confiabilidade: Os dados foram coletados de forma rigorosa e precisa?">?</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {optionsConf.map(val => (
                                                    <button key={val} onClick={() => toggleCriteria('Conf', val)} className={`px-2 py-1 rounded text-xs border ${filterConf.includes(val) ? 'bg-brand-brown text-white' : 'bg-gray-50'}`}>{val}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1 mb-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Potencial de Escala</label>
                                                <span className="text-[10px] text-gray-400 bg-gray-50 px-1 rounded border border-gray-100" title="Validade Externa: Funciona em outros lugares além de onde foi testado?">?</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {optionsVE.map(val => (
                                                    <button key={val} onClick={() => toggleCriteria('VE', val)} className={`px-2 py-1 rounded text-xs border ${filterVE.includes(val) ? 'bg-brand-brown text-white' : 'bg-gray-50'}`}>{val}</button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Temas</label>
                                            <div className="flex flex-wrap gap-2">
                                                {allTags.map(tag => (
                                                    <button
                                                        key={tag}
                                                        onClick={() => toggleTag(tag)}
                                                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${selectedTags.includes(tag) ? 'bg-pink-100 text-brand-brown border-pink-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'}`}
                                                    >
                                                        #{tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Lista de Cards */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredData.length > 0 ? filteredData.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col h-full group cursor-pointer"
                                    onClick={() => setSelectedEvidence(item)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2 mb-3">

                                            {user && (
                                                <button
                                                    onClick={(e) => handleToggleFavorite(e, String(item.id))}
                                                    className={`ml-auto p-2 rounded-full transition-colors ${favorites.has(String(item.id)) ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:text-red-300 hover:bg-gray-50'}`}
                                                    title={favorites.has(String(item.id)) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                                >
                                                    <Heart size={20} fill={favorites.has(String(item.id)) ? "currentColor" : "none"} />
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex gap-1">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getColor(item.validade_interna)}`} title="Certeza de Causa">
                                                Causa: {item.validade_interna}
                                            </span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getColor(item.confiabilidade)}`} title="Precisão dos Dados">
                                                Dados: {item.confiabilidade}
                                            </span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getColor(item.validade_externa)}`} title="Potencial de Escala">
                                                Escala: {item.validade_externa}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            {item.ano && (
                                                <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                                                    <Calendar size={12} /> {item.ano}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-3 leading-tight group-hover:text-brand-brown transition-colors">{item.titulo}</h3>
                                    <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">{item.resumo}</p>

                                    <div className="bg-[#FFF0F5] p-4 rounded-xl border border-pink-100 mt-auto">
                                        <div className="flex items-center gap-2 text-brand-brown font-bold text-sm mb-2">
                                            <Lightbulb size={16} />
                                            Ação Prática:
                                        </div>
                                        <p className="text-gray-800 text-sm line-clamp-2">{item.acao}</p>
                                    </div>

                                    <div className="mt-4 flex gap-2 flex-wrap items-center justify-between">
                                        <div className="flex gap-2 flex-wrap">
                                            {item.tags?.slice(0, 3).map(tag => (
                                                <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">#{tag}</span>
                                            ))}
                                        </div>
                                        {item.detalhes && <span className="text-xs text-brand-brown font-bold underline">Ver detalhes +</span>}
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-3 py-20 text-center">
                                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                        <Search size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-700">Nenhum resultado encontrado</h3>
                                    <p className="text-gray-500">Tente ajustar seus filtros ou termos de busca.</p>
                                    <button
                                        onClick={() => { setSearchTerm(''); setSelectedTags([]); setFilterVI([]); setFilterConf([]); setFilterVE([]); }}
                                        className="mt-4 text-brand-brown font-medium hover:underline"
                                    >
                                        Limpar tudo
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="py-8 animate-fade-in">
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Card E-Vidente */}
                            <Link href="/resources/e-vidente" className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-100 to-transparent opacity-50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-gradient-to-br from-pink-500 to-brand-brown rounded-xl text-white shadow-lg shadow-pink-500/20">
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">E-Vidente ✨</h3>
                                        <p className="text-xs text-brand-brown font-bold uppercase tracking-wider">IA Pedagógica</p>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                                    Sua consultora de elite. Crie planejamentos baseados em evidências, sequências didáticas e muito mais em segundos.
                                </p>

                                <div className="flex items-center text-brand-brown font-bold text-sm gap-2 group-hover:gap-3 transition-all">
                                    Acessar Landing Page <ArrowRight size={16} />
                                </div>
                            </Link>

                            {/* Card Placeholder for Future Tools */}
                            <div className="bg-gray-50 rounded-3xl p-6 border border-dashed border-gray-300 flex flex-col items-center justify-center text-center opacity-70">
                                <Map size={32} className="text-gray-400 mb-3" />
                                <h3 className="font-bold text-gray-600">Mapa de Território</h3>
                                <p className="text-xs text-gray-400 mt-1">Em breve</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>





    );
}
