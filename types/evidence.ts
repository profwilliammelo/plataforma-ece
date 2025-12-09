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
    recomendacoes: {
        uso: string;
        evitar: string;
        recursos: string;
        custo: string;
    };
    referencia: string;
}

export type ValidadeNivel = 'Alta' | 'Média' | 'Baixa' | 'N/A';

export interface Evidence {
    id: number;
    title: string;
    summary: string;
    action: string;
    tags: string[];
    // Novos critérios principais
    validade_interna: ValidadeNivel;
    validade_externa: ValidadeNivel;
    confiabilidade: ValidadeNivel;

    link?: string;
    year?: number;
    details?: EvidenceDetail;
}
