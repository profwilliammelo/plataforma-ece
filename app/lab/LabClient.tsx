'use client';

import React, { useState } from 'react';
import { BookOpen, Map, Search, Heart, Lightbulb, BarChart2 } from 'lucide-react';

interface Evidence {
    id: number;
    title: string;
    summary: string;
    action: string;
    tags: string[];
    validity: string;
}

interface LabClientProps {
    initialEvidenceData: Evidence[] | null;
}

export default function LabClient({ initialEvidenceData }: LabClientProps) {
    const [activeTab, setActiveTab] = useState('library');
    const [evidenceData] = useState<Evidence[]>(initialEvidenceData || []);

    const getValidityColor = (validity: string) => {
        switch (validity) {
            case 'Forte': return 'bg-green-100 text-green-800';
            case 'Promissor': return 'bg-blue-100 text-blue-800';
            case 'Em Estudo': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
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
                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2 mb-8 inline-flex flex-wrap">
                    <button
                        onClick={() => setActiveTab('library')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'library'
                                ? 'bg-pink-100 text-brand-brown'
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <BookOpen size={18} />
                        Biblioteca de Práticas
                    </button>
                    <button
                        onClick={() => setActiveTab('data')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'data'
                                ? 'bg-pink-100 text-brand-brown'
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <Map size={18} />
                        Monitor de Dados
                    </button>
                </div>

                {/* Content Area */}
                {activeTab === 'library' ? (
                    <div className="animate-fade-in">
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-3.5 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Busque por 'alfabetização', 'gestão', 'clima'..."
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none"
                                />
                            </div>
                            <button className="bg-white px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">
                                Filtros
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {evidenceData.length > 0 ? evidenceData.map((item) => (
                                <div key={item.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`text-xs font-bold px-3 py-1 rounded-full ${getValidityColor(item.validity)}`}>
                                            Evidência {item.validity}
                                        </div>
                                        <button className="text-gray-300 hover:text-pink-500"><Heart size={20} /></button>
                                    </div>

                                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-3 leading-tight">{item.title}</h3>
                                    <p className="text-gray-600 text-sm mb-6 flex-grow">{item.summary}</p>

                                    <div className="bg-[#FFF0F5] p-4 rounded-xl border border-pink-100 mt-auto">
                                        <div className="flex items-center gap-2 text-brand-brown font-bold text-sm mb-2">
                                            <Lightbulb size={16} />
                                            Ação Prática:
                                        </div>
                                        <p className="text-gray-800 text-sm">{item.action}</p>
                                    </div>

                                    <div className="mt-4 flex gap-2 flex-wrap">
                                        {item.tags.map(tag => (
                                            <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-3 text-center py-10 text-gray-500">
                                    <p className="text-lg font-medium mb-2">Nenhuma evidência encontrada no banco de dados.</p>
                                    <p className="text-sm">Por favor, execute o script SQL no Supabase para carregar os dados iniciais.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden h-[600px] animate-fade-in relative">
                        {/* Placeholder para Iframe do Shiny/Streamlit */}
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
