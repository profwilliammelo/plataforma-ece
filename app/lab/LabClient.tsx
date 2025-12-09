'use client';

import React, { useState, useMemo } from 'react';
import { BookOpen, Map, Search, Heart, Lightbulb, BarChart2, Filter, Download, FileText, ExternalLink, Calendar, X } from 'lucide-react';

interface Evidence {
    id: number;
    title: string;
    summary: string;
    action: string;
    tags: string[];
    validity: string;
    link?: string;
    year?: number;
}

interface LabClientProps {
    initialEvidenceData: Evidence[] | null;
}

export default function LabClient({ initialEvidenceData }: LabClientProps) {
    const [activeTab, setActiveTab] = useState('library');
    const [evidenceData] = useState<Evidence[]>(initialEvidenceData || []);

    // States de Filtro
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedValidity, setSelectedValidity] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Extrair opções únicas para filtros
    const allTags = Array.from(new Set(evidenceData.flatMap(item => item.tags || [])));
    const allValidities = Array.from(new Set(evidenceData.map(item => item.validity)));

    // Lógica de Filtragem
    const filteredData = useMemo(() => {
        return evidenceData.filter(item => {
            const matchesSearch =
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.action.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesValidity = selectedValidity.length === 0 || selectedValidity.includes(item.validity);
            const matchesTags = selectedTags.length === 0 || (item.tags && item.tags.some(tag => selectedTags.includes(tag)));

            return matchesSearch && matchesValidity && matchesTags;
        });
    }, [evidenceData, searchTerm, selectedValidity, selectedTags]);

    const toggleFilter = (type: 'validity' | 'tags', value: string) => {
        if (type === 'validity') {
            setSelectedValidity(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
        } else {
            setSelectedTags(prev => prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]);
        }
    };

    const getValidityColor = (validity: string) => {
        switch (validity) {
            case 'Forte': return 'bg-green-100 text-green-800 border-green-200';
            case 'Promissor': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Em Estudo': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // --- FUNÇÕES DE EXPORTAÇÃO ---

    const exportToCSV = () => {
        const headers = ['ID', 'Título', 'Resumo', 'Ação', 'Tags', 'Validade', 'Ano', 'Link'];
        const csvContent = [
            headers.join(','),
            ...filteredData.map(item => [
                item.id,
                `"${item.title.replace(/"/g, '""')}"`,
                `"${item.summary.replace(/"/g, '""')}"`,
                `"${item.action.replace(/"/g, '""')}"`,
                `"${(item.tags || []).join(', ')}"`,
                item.validity,
                item.year || '',
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
          .validity { font-size: 12px; font-weight: bold; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; }
          .validity.Forte { background-color: #d1fae5; color: #065f46; }
          .validity.Promissor { background-color: #dbeafe; color: #1e40af; }
          .validity.Em { background-color: #fef3c7; color: #92400e; } /* Em Estudo */
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
              <span class="validity ${item.validity.split(' ')[0]}">${item.validity}</span>
              ${item.year ? `<span style="font-size: 12px; color: #666;">Ano: ${item.year}</span>` : ''}
            </div>
            <h2 class="title">${item.title}</h2>
            <p style="color: #444; font-size: 14px; margin-bottom: 0;">${item.summary}</p>
            
            <div class="action-box">
              <div class="section-title">⚡ Ação Prática</div>
              <div style="font-size: 14px;">${item.action}</div>
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
                            Monitor
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
                                    {(selectedTags.length > 0 || selectedValidity.length > 0) && (
                                        <span className="bg-brand-brown text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
                                            {selectedTags.length + selectedValidity.length}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Painel de Filtros */}
                            {showFilters && (
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-slide-down">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-gray-800">Refinar Busca</h3>
                                        <button onClick={() => { setSearchTerm(''); setSelectedTags([]); setSelectedValidity([]); }} className="text-xs text-pink-600 hover:underline">Limpar Filtros</button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Nível de Evidência</label>
                                            <div className="flex flex-wrap gap-2">
                                                {allValidities.map(val => (
                                                    <button
                                                        key={val}
                                                        onClick={() => toggleFilter('validity', val)}
                                                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${selectedValidity.includes(val) ? 'bg-brand-brown text-white border-brand-brown' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'}`}
                                                    >
                                                        {val}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Temas</label>
                                            <div className="flex flex-wrap gap-2">
                                                {allTags.map(tag => (
                                                    <button
                                                        key={tag}
                                                        onClick={() => toggleFilter('tags', tag)}
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
                                <div key={item.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col h-full group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`text-xs font-bold px-3 py-1 rounded-full border ${getValidityColor(item.validity)}`}>
                                            {item.validity}
                                        </div>
                                        <div className="flex gap-2">
                                            {item.year && (
                                                <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                                                    <Calendar size={12} /> {item.year}
                                                </span>
                                            )}
                                            {item.link && (
                                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-brand-brown transition-colors">
                                                    <ExternalLink size={20} />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-3 leading-tight group-hover:text-brand-brown transition-colors">{item.title}</h3>
                                    <p className="text-gray-600 text-sm mb-6 flex-grow">{item.summary}</p>

                                    <div className="bg-[#FFF0F5] p-4 rounded-xl border border-pink-100 mt-auto">
                                        <div className="flex items-center gap-2 text-brand-brown font-bold text-sm mb-2">
                                            <Lightbulb size={16} />
                                            Ação Prática:
                                        </div>
                                        <p className="text-gray-800 text-sm">{item.action}</p>
                                    </div>

                                    <div className="mt-4 flex gap-2 flex-wrap items-center justify-between">
                                        <div className="flex gap-2 flex-wrap">
                                            {item.tags?.map(tag => (
                                                <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">#{tag}</span>
                                            ))}
                                        </div>
                                        <button className="text-gray-300 hover:text-pink-500 transition-colors"><Heart size={20} /></button>
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
                                        onClick={() => { setSearchTerm(''); setSelectedTags([]); setSelectedValidity([]); }}
                                        className="mt-4 text-brand-brown font-medium hover:underline"
                                    >
                                        Limpar tudo
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden h-[600px] animate-fade-in relative">
                        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-center p-8">
                            <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                                <BarChart2 className="h-12 w-12 text-brand-brown" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Painel de Dados Carregando...</h3>
                            <p className="text-gray-500 max-w-md">
                                Aqui entrará o seu app <strong>Shiny</strong> ou <strong>Streamlit</strong> via iframe.
                            </p>
                            <div className="mt-6 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm font-mono border border-yellow-200">
                                &lt;iframe src="https://will-melo.shinyapps.io/seu-app" /&gt;
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
