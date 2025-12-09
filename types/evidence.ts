export interface EvidenceDetail {
    resumo_aside: string;
    publico_alvo: string[];
    metodologia_passos: { titulo: string; descricao: string }[];
    resultados_key: { label: string; valor: string; descricao: string }[];
    resultados_texto: string;
    limites: string[];
    tabela_evidencias: {
        desfecho: string;
        grupo: string;
        efeito: string;
        tamanho: string;
        significancia: string;
        observacoes: string;
    }[];
    diagnostico: {
        validade_interna: 'Excelente' | 'Boa' | 'Moderada' | 'Baixa' | 'Muito Baixa';
        poder_precisao: 'Alta' | 'Média' | 'Média-baixa' | 'Baixa';
        generalizacao: 'Alta' | 'Moderada' | 'Limitada' | 'Muito Limitada';
    };
    recomendacoes: {
        uso: string;
        evitar: string;
        recursos: string;
        custo: string;
    };
    referencia: string;
}

export interface Evidence {
    id: number;
    title: string;
    summary: string;
    action: string;
    tags: string[];
    validity: string;
    link?: string;
    year?: number;
    details?: EvidenceDetail;
}
