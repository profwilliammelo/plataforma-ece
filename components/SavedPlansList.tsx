'use client';

import React, { useState } from 'react';
import { Trash2, FileText, Calendar, ExternalLink, Loader2, Pencil } from 'lucide-react';
import { deletePlan, renamePlan } from '../app/lab/actions';

interface SavedPlan {
    id: string;
    titulo: string;
    conteudo_html: string;
    criado_em: string;
    persona?: string; // Used for grade/turma
}

interface SavedPlansListProps {
    plans: SavedPlan[];
}

export default function SavedPlansList({ plans: initialPlans }: SavedPlansListProps) {
    const [plans, setPlans] = useState(initialPlans);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isRenaming, setIsRenaming] = useState<string | null>(null);

    // Function to handle deletion
    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este plano?')) return;

        setIsDeleting(id);
        const res = await deletePlan(id);

        if (res.success) {
            setPlans(plans.filter(p => p.id !== id));
        } else {
            alert("Erro ao excluir. Tente novamente.");
        }
        setIsDeleting(null);
    };

    // Handle Rename
    const handleRename = async (id: string, currentTitle: string) => {
        const newTitle = window.prompt("Novo nome do plano:", currentTitle);
        if (!newTitle || newTitle === currentTitle) return;

        setIsRenaming(id);
        const res = await renamePlan(id, newTitle);

        if (res.success) {
            setPlans(plans.map(p => p.id === id ? { ...p, titulo: newTitle } : p));
        } else {
            alert("Erro ao renomear.");
        }
        setIsRenaming(null);
    };

    // Function to open plan (Navigate to Editor Page)
    const handleView = (planId: string) => {
        window.open(`/plans/${planId}`, '_blank');
    };

    if (plans.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-8 border border-dashed border-gray-300 text-center">
                <p className="text-gray-400 mb-2">Você ainda não salvou nenhum plano.</p>
                <p className="text-xs text-brand-brown">Gere um plano com a E-Vidente e clique em "Salvar".</p>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-4">
            {plans.map((plan) => (
                <div key={plan.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 pr-2">
                            <h4 className="font-bold text-gray-800 line-clamp-1" title={plan.titulo}>
                                {plan.titulo}
                            </h4>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                    {plan.persona || 'Geral'}
                                </span>
                                <span className="mx-1">•</span>
                                <Calendar size={12} />
                                {new Date(plan.criado_em).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                        <div className="p-2 bg-pink-50 text-brand-brown rounded-lg opacity-80 group-hover:opacity-100">
                            <FileText size={20} />
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t border-gray-50">
                        <button
                            onClick={() => handleView(plan.id)}
                            className="flex-1 bg-gray-50 hover:bg-brand-brown hover:text-white text-gray-600 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
                        >
                            <ExternalLink size={14} /> Abrir
                        </button>

                        <button
                            onClick={() => handleRename(plan.id, plan.titulo)}
                            disabled={isRenaming === plan.id}
                            className="w-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-lg transition-colors disabled:opacity-50"
                            title="Renomear"
                        >
                            {isRenaming === plan.id ? <Loader2 size={14} className="animate-spin" /> : <Pencil size={14} />}
                        </button>

                        <button
                            onClick={() => handleDelete(plan.id)}
                            disabled={isDeleting === plan.id}
                            className="w-10 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 rounded-lg transition-colors disabled:opacity-50"
                            title="Excluir"
                        >
                            {isDeleting === plan.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
