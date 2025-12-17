'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Save, Printer, ArrowLeft, Loader2, Check, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Type, Heading1, Heading2, Palette, Undo, Redo } from 'lucide-react';
import Link from 'next/link';
import { updatePlanContent } from '../app/lab/actions';

interface PlanEditorProps {
    plan: {
        id: string;
        titulo: string;
        conteudo_html: string;
        criado_em: string;
    };
}

const ToolbarButton = ({ onClick, icon: Icon, active = false, title }: { onClick: () => void, icon: any, active?: boolean, title: string }) => (
    <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); onClick(); }}
        className={`p-2 rounded hover:bg-gray-100 transition-colors ${active ? 'bg-gray-200 text-brand-brown' : 'text-gray-600'}`}
        title={title}
    >
        <Icon size={18} />
    </button>
);

const ColorPicker = ({ onChange }: { onChange: (color: string) => void }) => (
    <div className="relative group flex items-center">
        <label htmlFor="color-picker" className="p-2 rounded hover:bg-gray-100 cursor-pointer flex items-center gap-1 text-gray-600">
            <Palette size={18} />
        </label>
        <input
            id="color-picker"
            type="color"
            onChange={(e) => onChange(e.target.value)}
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
            title="Cor do Texto"
        />
    </div>
);

export default function PlanEditor({ plan }: PlanEditorProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const editorRef = useRef<HTMLDivElement>(null);

    // Initial load
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = plan.conteudo_html;
        }
    }, [plan.conteudo_html]);

    const execCmd = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const handleSave = async () => {
        if (!editorRef.current) return;

        setIsSaving(true);
        const newHtml = editorRef.current.innerHTML;

        const res = await updatePlanContent(plan.id, newHtml);

        setIsSaving(false);
        if (res.success) {
            setLastSaved(new Date());
        } else {
            alert("Erro ao salvar.");
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 print:bg-white print:pb-0">
            {/* Header / Nav */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50 print:hidden shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-gray-500 hover:text-brand-brown transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="font-bold text-gray-800 text-lg line-clamp-1">{plan.titulo}</h1>
                            {lastSaved && <p className="text-xs text-green-600 flex items-center gap-1"><Check size={10} /> Salvo às {lastSaved.toLocaleTimeString()}</p>}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-brand-brown text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brown-900 transition-colors flex items-center gap-2 disabled:opacity-70"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Salvar Alterações
                        </button>
                        <button
                            onClick={handlePrint}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            <Printer size={16} /> Imprimir / PDF
                        </button>
                    </div>
                </div>

                {/* Rich Text Toolbar */}
                <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
                    <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-1">
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
                            <ColorPicker onChange={(color) => execCmd('foreColor', color)} />
                        </div>

                        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
                            <ToolbarButton onClick={() => execCmd('justifyLeft')} icon={AlignLeft} title="Esquerda" />
                            <ToolbarButton onClick={() => execCmd('justifyCenter')} icon={AlignCenter} title="Centro" />
                            <ToolbarButton onClick={() => execCmd('justifyRight')} icon={AlignRight} title="Direita" />
                            <ToolbarButton onClick={() => execCmd('justifyFull')} icon={AlignJustify} title="Justificar" />
                        </div>

                        <div className="flex items-center gap-1">
                            <ToolbarButton onClick={() => execCmd('insertUnorderedList')} icon={List} title="Lista com Marcadores" />
                            <ToolbarButton onClick={() => execCmd('insertOrderedList')} icon={ListOrdered} title="Lista Numerada" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Editable Content Area */}
            <div className="max-w-5xl mx-auto mt-8 px-4 print:mt-0 print:px-0 print:max-w-none">
                <div
                    id="plan-editor-content"
                    ref={editorRef}
                    contentEditable
                    className="bg-white p-16 rounded-none shadow-lg border border-gray-200 min-h-[1123px] w-full outline-none focus:ring-2 focus:ring-pink-100 transition-shadow print:shadow-none print:border-0 print:p-0 prose max-w-none prose-headings:font-bold prose-h1:text-brand-brown prose-a:text-blue-600 prose-img:rounded-xl"
                    suppressContentEditableWarning
                />
            </div>

            <style jsx global>{`
                /* Print Styles remain mostly the same */
                @media print {
                    @page { margin: 1cm; }
                    body * { visibility: hidden; }
                    #plan-editor-content, #plan-editor-content * { visibility: visible; }
                    #plan-editor-content {
                        position: absolute; left: 0; top: 0; width: 100%;
                        margin: 0 !important; padding: 0 !important;
                        background: white; border: none; box-shadow: none;
                    }
                    nav, footer, header, .floating-user-bar { display: none !important; }
                    body { background: white; overflow: visible; }
                }
            `}</style>
        </div>
    );
}
