-- 1. Alterar a tabela para remover a coluna antiga e coluna de check constraint, se houver
ALTER TABLE evidences DROP CONSTRAINT IF EXISTS evidences_validity_check;
ALTER TABLE evidences DROP COLUMN IF EXISTS validity;

-- 2. Adicionar as novas colunas
ALTER TABLE evidences ADD COLUMN IF NOT EXISTS validade_interna text CHECK (validade_interna IN ('Alta', 'Média', 'Baixa', 'N/A'));
ALTER TABLE evidences ADD COLUMN IF NOT EXISTS confiabilidade text CHECK (confiabilidade IN ('Alta', 'Média', 'Baixa', 'N/A'));
ALTER TABLE evidences ADD COLUMN IF NOT EXISTS validade_externa text CHECK (validade_externa IN ('Alta', 'Média', 'Baixa', 'N/A'));

-- Limpar dados existentes para repopular limpo
TRUNCATE TABLE evidences RESTART IDENTITY;

-- Inserir as 20 Evidências com Detalhes Ricos e Novos Critérios
INSERT INTO evidences (title, summary, action, tags, validade_interna, confiabilidade, validade_externa, year, link, details) VALUES

-- 1. Cultura Afro-Brasileira no Ensino Superior
(
    'Cultura Afro-Brasileira no Ensino Superior (Souza & Dorneles, 2022)',
    'O estudo analisa o acesso e a performance de estudantes negros em cursos STEM. Apesar de entrarem em menor número, apresentam performance similar.',
    'Criar disciplinas que conectem ciência e cultura afro-brasileira para reduzir evasão.',
    ARRAY['Ensino Superior', 'Relações Raciais', 'STEM', 'Evasão'],
    'Média', 'Média', 'Baixa',
    2022,
    'https://example.com/artigo1',
    '{
        "resumo_aside": "\\n\\n**RESUMO**\\n\\nO estudo analisa o acesso e a performance de estudantes negros em cursos STEM na FURG. A evasão está ligada à falta de pertencimento e currículos eurocêntricos, não à incapacidade.\\n\\n",
        "publico_alvo": ["Coordenadores de cursos", "Núcleos de ações afirmativas"],
        "metodologia_passos": [
            {"titulo": "Análise mista", "descricao": "Dados quantitativos de ingresso/notas e qualitativa (questionários) na FURG."}
        ],
        "resultados_key": [
            {"label": "Performance", "valor": "Similar", "descricao": "Estatisticamente igual"},
            {"label": "Currículo", "valor": "Barreira", "descricao": "Falta de identidade"}
        ],
        "resultados_texto": "Performance acadêmica de negros é similar à de não-negros.",
        "tabela_evidencias": [
            {"desfecho": "Desempenho", "grupo": "Negros vs Não-negros", "efeito": "Nulo", "tamanho": "-", "significancia": "n.s.", "observacoes": "Sem diferença sig."}
        ],
        "recomendacoes": {
            "uso": "Universidades com evasão em STEM.",
            "evitar": "Interpretar evasão como déficit cognitivo.",
            "recursos": "Formação docente.",
            "custo": "Baixo."
        },
        "referencia": "Souza & Dorneles (2022)."
    }'::jsonb
),

-- 2. Gaps em Aprendizes de Inglês
(
    'Gaps em Aprendizes de Inglês e Formação Docente (Ghimire, 2019)',
    'Investigação multinível sobre como a formação de professores impacta o gap de aprendizado em minorias. Profs sem treino subestimam alunos.',
    'Evitar currículos simplificados para minorias; garantir altas expectativas.',
    ARRAY['Formação Docente', 'Gaps', 'Expectativas'],
    'Alta', 'Alta', 'Média',
    2019,
    'https://example.com/artigo2',
    '{
        "resumo_aside": "\\n\\n**RESUMO**\\n\\nInvestigação multinível sobre como a formação de professores impacta o gap de aprendizado. Professores sem treinamento específico tendem a oferecer currículos remediais que ampliam o gap.\\n\\n",
        "publico_alvo": ["Formadores de professores"],
        "metodologia_passos": [{"titulo": "HLM", "descricao": "Modelagem Hierárquica Linear de 3 níveis."}],
        "resultados_key": [{"label": "Preparo", "valor": "Crucial", "descricao": "Reduz gaps"}],
        "resultados_texto": "Professores despreparados focam em básico.",
        "tabela_evidencias": [{"desfecho": "Gap", "grupo": "Remedial vs Normal", "efeito": "Aumenta", "tamanho": "Alto", "significancia": "p<.05", "observacoes": "Com currículo fraco"}],
        "recomendacoes": {"uso": "Redes diversas.", "evitar": "Baixar a régua.", "recursos": "Formação.", "custo": "Médio."},
        "referencia": "Ghimire (2019)."
    }'::jsonb
),

-- 3. Ações Afirmativas de Raça vs. Renda
(
    'Ações Afirmativas de Raça vs. Renda (2023)',
    'Estudo conclui que cotas de renda não aumentam a diversidade racial na mesma proporção que as cotas raciais específicas.',
    'Manter critérios raciais específicos nas políticas de cotas.',
    ARRAY['Ações Afirmativas', 'Cotas', 'Ensino Superior'],
    'Alta', 'Alta', 'Alta',
    2023,
    'https://example.com/artigo3',
    '{
        "resumo_aside": "\\n\\n**RESUMO**\\n\\nComparação entre cotas puramente sociais e raciais. Cotas de renda não garantem diversidade racial suficiente.\\n\\n",
        "publico_alvo": ["Legisladores"],
        "metodologia_passos": [{"titulo": "Revisão", "descricao": "Quasi-experimental (DiD)."}],
        "resultados_key": [{"label": "Cota Racial", "valor": "Essencial", "descricao": "Para diversidade real"}],
        "resultados_texto": "Cotas raciais aumentam efetivamente a proporção de negros.",
        "tabela_evidencias": [{"desfecho": "Acesso Negro", "grupo": "Racial vs Social", "efeito": "Maior", "tamanho": "Grande", "significancia": "Sig.", "observacoes": "Cota racial vence"}],
        "recomendacoes": {"uso": "Políticas de admissão.", "evitar": "Substituir raça por renda.", "recursos": "Legislação.", "custo": "Político."},
        "referencia": "Estudo Comparativo (2023)."
    }'::jsonb
),

-- 4. Dinâmicas de Abandono Escolar na Periferia
(
    'Dinâmicas de Abandono Escolar na Periferia (Liang, 2023)',
    'Estudo qualitativo sobre abandono de jovens negros em SP. Raça aumenta risco de reprovação e exclusão gradual.',
    'Programas de busca ativa e flexibilização curricular.',
    ARRAY['Abandono', 'Periferia', 'Reprovação'],
    'Média', 'Média', 'Baixa',
    2023,
    'https://example.com/artigo4',
    '{
        "resumo_aside": "\\n\\n**RESUMO**\\n\\nEstudo qualitativo em SP. A exclusão escolar é um processo gradual de distanciamento, mediado pela necessidade de trabalho e falta de sentido.\\n\\n",
        "publico_alvo": ["Diretores de escola"],
        "metodologia_passos": [{"titulo": "Qualitativa", "descricao": "Entrevistas em profundidade."}],
        "resultados_key": [{"label": "Reprovação", "valor": "Preditor", "descricao": "Antecede abandono"}],
        "resultados_texto": "Raça é preditor forte para reprovação.",
        "tabela_evidencias": [{"desfecho": "Abandono", "grupo": "Negros vs Brancos", "efeito": "Maior", "tamanho": "Quali", "significancia": "-", "observacoes": "Processo cumutalivo"}],
        "recomendacoes": {"uso": "Escolas periféricas.", "evitar": "Culpar só a família.", "recursos": "Busca ativa.", "custo": "Médio."},
        "referencia": "Liang (2023)."
    }'::jsonb
),

-- 5. Desigualdades Raciais e Permanência
(
    'Desigualdades Raciais e Permanência (2022)',
    'Argumenta que o preconceito racial em sala de aula é um fator ativo de expulsão. A evasão não é apenas escolha do aluno.',
    'Treinamento anti-racista focado em clima escolar.',
    ARRAY['Permanência', 'Preconceito', 'Clima Escolar'],
    'Média', 'Baixa', 'Média',
    2022,
    'https://example.com/artigo5',
    '{
        "resumo_aside": "\\n\\n**RESUMO**\\n\\nRevisão bibliográfica. O preconceito racial em sala funciona como fator de expulsão.\\n\\n",
        "publico_alvo": ["Professores"],
        "metodologia_passos": [{"titulo": "Revisão", "descricao": "Bibliográfica sistemática."}],
        "resultados_key": [{"label": "Expulsão", "valor": "Ativa", "descricao": "Pelo clima hostil"}],
        "resultados_texto": "Preconceito direto afeta permanência.",
        "tabela_evidencias": [{"desfecho": "Evasão", "grupo": "Ambiente Hostil", "efeito": "Aumenta", "tamanho": "-", "significancia": "-", "observacoes": "Mecanismo social"}],
        "recomendacoes": {"uso": "Diagnóstico de clima.", "evitar": "Ignorar racismo.", "recursos": "Formação.", "custo": "Baixo."},
        "referencia": "Revisão (2022)."
    }'::jsonb
),

-- 6. Discurso, Ameaças e Ação Afirmativa
(
    'Discurso, Ameaças e Ação Afirmativa (Sharifitabar, 2023)',
    'Análise Brasil-EUA. Discursos de liberalismo abstrato desmantelam políticas. Ambiguidade pardo vs preto dilui impacto.',
    'Comissões de heteroidentificação.',
    ARRAY['Política', 'Discurso', 'Liberalismo'],
    'Média', 'Média', 'Alta',
    2023,
    'https://example.com/artigo6',
    '{
        "resumo_aside": "\\n\\n**RESUMO**\\n\\nAnálise comparativa. Discursos de diversidade sem reparação enfraquecem políticas efetivas.\\n\\n",
        "publico_alvo": ["Analistas políticos"],
        "metodologia_passos": [{"titulo": "Mistos", "descricao": "Discurso + Estatística."}],
        "resultados_key": [{"label": "Discurso", "valor": "Enfraquece", "descricao": "Se abstrato"}],
        "resultados_texto": "Liberalismo abstrato reduz impacto.",
        "tabela_evidencias": [{"desfecho": "Efetividade", "grupo": "Discurso", "efeito": "Reduz", "tamanho": "-", "significancia": "-", "observacoes": "Político"}],
        "recomendacoes": {"uso": "Monitoramento.", "evitar": "Termos vagos.", "recursos": "Heteroidentificação.", "custo": "Médio."},
        "referencia": "Sharifitabar (2023)."
    }'::jsonb
),

-- 7. Decomposição de Gaps em Múltiplos Níveis
(
    'Decomposição de Gaps em Múltiplos Níveis (Cordoba et al., 2022)',
    'Gap racial acontece também entre distritos e por segregação. Segregação escolar é mediador chave.',
    'Políticas de desegregação territorial/distrital.',
    ARRAY['Metodologia', 'Gaps', 'Segregação'],
    'Alta', 'Alta', 'Média',
    2022,
    'https://example.com/artigo7',
    '{
        "resumo_aside": "\\n\\n**RESUMO**\\n\\nAvanço metodológico. Mostra que a segregação na admissão e entre distritos explica parte do gap racial.\\n\\n",
        "publico_alvo": ["Estatísticos"],
        "metodologia_passos": [{"titulo": "Mediação", "descricao": "Multinível."}],
        "resultados_key": [{"label": "Segregação", "valor": "Mediador", "descricao": "Explica gap"}],
        "resultados_texto": "Segregação escolar é chave.",
        "tabela_evidencias": [{"desfecho": "Gap Racial", "grupo": "Segregação", "efeito": "Mediação", "tamanho": "Alto", "significancia": "Sig.", "observacoes": "Entre escolas"}],
        "recomendacoes": {"uso": "Planejamento.", "evitar": "Olhar só intra-escola.", "recursos": "Dados Geo.", "custo": "Alto."},
        "referencia": "Cordoba et al. (2022)."
    }'::jsonb
),

-- 8. Identificando Discriminação pelo Desempenho
(
    'Identificando Discriminação pelo Desempenho (Carneiro et al., 2023)',
    'Resíduo estatístico após controles aponta para barreiras institucionais específicas enfrentadas por negros no Ensino Médio.',
    'Intervenções precoces para quebrar a dependência das condições iniciais.',
    ARRAY['Econometria', 'Discriminação', 'Ensino Médio'],
    'Média', 'Alta', 'Alta',
    2023,
    'https://example.com/artigo8',
    '{
        "resumo_aside": "\\n\\n**RESUMO**\\n\\nIsola a discriminação racial ao analisar o diferencial de desempenho. Há indícios de armadilha de desigualdade.\\n\\n",
        "publico_alvo": ["Economistas"],
        "metodologia_passos": [{"titulo": "Econometria", "descricao": "Controles extensivos."}],
        "resultados_key": [{"label": "Armadilha", "valor": "Existe", "descricao": "Raça impede conversão"}],
        "resultados_texto": "Trajetórias marcadas por condições iniciais.",
        "tabela_evidencias": [{"desfecho": "Trajetória", "grupo": "Racial", "efeito": "Negativo", "tamanho": "Médio", "significancia": "p<.05", "observacoes": "Resíduo"}],
        "recomendacoes": {"uso": "Políticas focadas.", "evitar": "Cegueira racial.", "recursos": "Nivelamento.", "custo": "Médio."},
        "referencia": "Carneiro et al. (2023)."
    }'::jsonb
),

-- 9. Repetência Escolar e Sociodemografia
(
    'Repetência Escolar e Sociodemografia (Ferrão & Alves, 2023)',
    'Análise de 10 anos da Prova Brasil. Probabilidade de repetência caiu mas ainda é maior para negros e pobres.',
    'Rever políticas de retenção escolar.',
    ARRAY['Repetência', 'Prova Brasil', 'Longitudinal'],
    'Alta', 'Alta', 'Alta',
    2023,
    'https://example.com/artigo9',
    '{
        "resumo_aside": "\\n\\n**RESUMO**\\n\\nAnálise de 10 anos (2007-2017). Gap racial na reprovação diminuiu ligeiramente, mas permanece. Gap de gênero aumentou.\\n\\n",
        "publico_alvo": ["Gestores de rede"],
        "metodologia_passos": [{"titulo": "Logística", "descricao": "Multinível repetido."}],
        "resultados_key": [{"label": "Gap Racial", "valor": "Persiste", "descricao": "Caiu pouco"}],
        "resultados_texto": "Cultura de reprovação persiste.",
        "tabela_evidencias": [{"desfecho": "Reprovação", "grupo": "Gap Racial", "efeito": "Diminuindo", "tamanho": "Pequeno", "significancia": "Sig.", "observacoes": "Lento"}],
        "recomendacoes": {"uso": "Correção de fluxo.", "evitar": "Reprovação punitiva.", "recursos": "Sistemas alerta.", "custo": "Baixo."},
        "referencia": "Ferrão & Alves (2023)."
    }'::jsonb
),

-- 10. Eficácia Diferencial e Equidade Social
(
    'Eficácia Diferencial e Equidade Social (Ferrão, 2021)',
    'Escolas brasileiras reproduzem desigualdades de entrada; eficácia varia pouco por SES (escola neutra).',
    'Focar em práticas pedagógicas intra-escolares.',
    ARRAY['Valor Agregado', 'Eficácia', 'Equidade'],
    'Alta', 'Alta', 'Alta',
    2021,
    'https://example.com/artigo10',
    '{
        "resumo_aside": "\\n\\n**RESUMO**\\n\\nEstudo longitudinal (5º ao 9º ano). Escolas não conseguem quebrar a relação entre origem e destino.\\n\\n",
        "publico_alvo": ["Pesquisadores"],
        "metodologia_passos": [{"titulo": "Valor Agregado", "descricao": "Longitudinal."}],
        "resultados_key": [{"label": "Equidade", "valor": "Baixa", "descricao": "Escola reproduz"}],
        "resultados_texto": "Fatores intra-escolares são cruciais.",
        "tabela_evidencias": [{"desfecho": "VA", "grupo": "SES", "efeito": "Neutro", "tamanho": "-", "significancia": "-", "observacoes": "Não corrige"}],
        "recomendacoes": {"uso": "Avaliação.", "evitar": "Achar que acesso basta.", "recursos": "Pedagogia.", "custo": "Médio."},
        "referencia": "Ferrão (2021)."
    }'::jsonb
),

-- 11. Equidade e Política Internacional
(
    'Equidade e Política Internacional (Ludlum, 2015)',
    'Políticas neoliberais e testes padronizados perpetuam inequidades ao ignorar segregação residencial.',
    'Evitar copiar modelos de voucher sem considerar segregação.',
    ARRAY['Internacional', 'Política', 'Segregação'],
    'Média', 'Média', 'Alta',
    2015,
    'https://example.com/artigo11',
    '{
        "resumo_aside": "\\n\\n**RESUMO**\\n\\nComparação Brasil, Chile, EUA. Segregação espacial correlaciona-se com pior desempenho negro em todos.\\n\\n",
        "publico_alvo": ["Analistas"],
        "metodologia_passos": [{"titulo": "Comparativo", "descricao": "Estudo de caso."}],
        "resultados_key": [{"label": "Segregação", "valor": "Negativo", "descricao": "Impacto universal"}],
        "resultados_texto": "Políticas simbólicas falham sem redistribuição.",
        "tabela_evidencias": [{"desfecho": "Desempenho", "grupo": "Segregação", "efeito": "Negativo", "tamanho": "Alto", "significancia": "Quali", "observacoes": "Global"}],
        "recomendacoes": {"uso": "Reformas.", "evitar": "Cópias acríticas.", "recursos": "Urbano.", "custo": "Alto."},
        "referencia": "Ludlum (2015)."
    }'::jsonb
),

-- 12. Educação e Diversidade Étnico-Racial
(
    'Educação e Diversidade Étnico-Racial (Sant Ana & Lopes, 2016)',
    'Ensaio sobre descolonização epistemológica. A exclusão é um projeto histórico.',
    'Revisão completa de bibliografia e autores usados nas escolas.',
    ARRAY['Decolonialidade', 'Teoria', 'Currículo'],
    'Baixa', 'Baixa', 'Alta',
    2016,
    'https://example.com/artigo12',
    '{
        "resumo_aside": "\\n\\n**RESUMO**\\n\\nTeórico. A escola funciona intencionalmente para excluir a diversidade. Propõe protagonismo negro.\\n\\n",
        "publico_alvo": ["Pedagogos"],
        "metodologia_passos": [{"titulo": "Ensaio", "descricao": "Crítico."}],
        "resultados_key": [{"label": "Exclusão", "valor": "Projeto", "descricao": "Histórico"}],
        "resultados_texto": "Reinvenção passa por assumir protagonismo negro.",
        "tabela_evidencias": [{"desfecho": "Exclusão", "grupo": "Epistemologia", "efeito": "Causa", "tamanho": "-", "significancia": "-", "observacoes": "Teórico"}],
        "recomendacoes": {"uso": "PPP.", "evitar": "Folclore.", "recursos": "Autores negros.", "custo": "Baixo."},
        "referencia": "Sant Ana & Lopes (2016)."
    }'::jsonb
),

-- 13. Retenção em Farmácia e Raça
(
    'Retenção em Farmácia e Raça (Araújo et al., 2023)',
    'Intenção de abandono alta (62%) ligada à reprovação em disciplinas. Mulheres e pardos enfrentam barreiras.',
    'Apoio pedagógico no início do curso.',
    ARRAY['Ensino Superior', 'Saúde', 'Evasão'],
    'Média', 'Média', 'Baixa',
    2023,
    'https://example.com/artigo13',
    '{
        "resumo_aside": "\\n\\n**RESUMO**\\n\\nSurvey. Reprovação prévia é o maior preditor de intenção de evasão. Perfil vulnerável: mulher, parda, baixa renda.\\n\\n",
        "publico_alvo": ["Gestão Univ."],
        "metodologia_passos": [{"titulo": "Survey", "descricao": "Transversal."}],
        "resultados_key": [{"label": "Evasão", "valor": "62%", "descricao": "Intenção alta"}],
        "resultados_texto": "Reprovação leva à evasão.",
        "tabela_evidencias": [{"desfecho": "Evasão", "grupo": "Reprovação", "efeito": "Ciclo", "tamanho": "Alto", "significancia": "Sig.", "observacoes": "Correlação"}],
        "recomendacoes": {"uso": "Cursos saúde.", "evitar": "Barreiras 1º ano.", "recursos": "Monitoria.", "custo": "Médio."},
        "referencia": "Araújo et al. (2023)."
    }'::jsonb
),

-- 14. O Negro e Ações Afirmativas na Desigualdade
(
    'O Negro e Ações Afirmativas na Desigualdade (Constâncio, 2009)',
    'Mesmo controlando SES, pretos (retintos) têm desempenho pior que brancos e pardos (colorismo).',
    'Atenção específica para discriminação por fenotipo.',
    ARRAY['Colorismo', 'Desigualdade', 'SAEB'],
    'Alta', 'Alta', 'Alta',
    2009,
    'https://example.com/artigo14',
    '{
        "resumo_aside": "\\n\\n**RESUMO**\\n\\nPretos sofrem penalidade adicional (colorismo) comparados a pardos e brancos pobres.\\n\\n",
        "publico_alvo": ["Pesquisadores"],
        "metodologia_passos": [{"titulo": "Regressão", "descricao": "Hierárquica."}],
        "resultados_key": [{"label": "Pretos", "valor": "Pior", "descricao": "Mais que pardos"}],
        "resultados_texto": "SES não explica toda a diferença.",
        "tabela_evidencias": [{"desfecho": "Desempenho", "grupo": "Preto vs Pardo", "efeito": "Pior", "tamanho": "Médio", "significancia": "Sig.", "observacoes": "Colorismo"}],
        "recomendacoes": {"uso": "Diagnóstico.", "evitar": "Homogeneizar negros.", "recursos": "Dados cor.", "custo": "Baixo."},
        "referencia": "Constâncio (2009)."
    }'::jsonb
),

-- 15. Educação Antirracista nos PPPs de São Paulo
(
    'Educação Antirracista nos PPPs de São Paulo (Santos et al., 2023)',
    'Evidências de práticas antirracistas nos PPPs são frágeis. Maioria não tem metas objetivas.',
    'Exigir metas raciais explícitas nos PPPs.',
    ARRAY['Gestão Escolar', 'PPP', 'Antirracismo'],
    'Média', 'Média', 'Média',
    2023,
    'https://example.com/artigo15',
    '{
        "resumo_aside": "\\n\\n**RESUMO**\\n\\nAnálise documental. Ausência de metas claras para reduzir gaps raciais nos documentos escolares (PPPs).\\n\\n",
        "publico_alvo": ["Diretores"],
        "metodologia_passos": [{"titulo": "Documental", "descricao": "Qualitativa."}],
        "resultados_key": [{"label": "Metas", "valor": "Ausentes", "descricao": "Genérico"}],
        "resultados_texto": "Mito da democracia racial permeia planejamento.",
        "tabela_evidencias": [{"desfecho": "Planejamento", "grupo": "Raça", "efeito": "Nulo", "tamanho": "-", "significancia": "-", "observacoes": "Burocrático"}],
        "recomendacoes": {"uso": "Revisão PPP.", "evitar": "Cópia.", "recursos": "Matriz.", "custo": "Baixo."},
        "referencia": "Santos et al. (2023)."
    }'::jsonb
),

-- 16. Segregação em Sala Sem Tracking
(
    'Segregação em Sala Sem "Tracking" (2022)',
    'Segregação racial entre turmas é alta e comparável aos EUA, consolidada por omissão na enturmação.',
    'Auditoria ativa da composição das turmas.',
    ARRAY['Segregação', 'Enturmação', 'Equidade'],
    'Alta', 'Alta', 'Alta',
    2022,
    'https://example.com/artigo16',
    '{
        "resumo_aside": "\\n\\n**RESUMO**\\n\\nSegregação intra-escolar é alta. Escolas usam atribuições aleatórias mas não corrigem desequilíbrios, consolidando turmas segregadas.\\n\\n",
        "publico_alvo": ["Diretores"],
        "metodologia_passos": [{"titulo": "Descritiva", "descricao": "Censo Escolar."}],
        "resultados_key": [{"label": "Segregação", "valor": "Alta", "descricao": "Nacional"}],
        "resultados_texto": "Escolas aceitam turmas segregadas como natural.",
        "tabela_evidencias": [{"desfecho": "Segregação", "grupo": "Intra-escolar", "efeito": "Alta", "tamanho": "Grande", "significancia": "-", "observacoes": "Sem tracking formal"}],
        "recomendacoes": {"uso": "Enturmação.", "evitar": "Escolha livre.", "recursos": "Algoritmo.", "custo": "Baixo."},
        "referencia": "Estudo Nacional (2022)."
    }'::jsonb
),

-- 17. Armadilhas de Desigualdade Étnica
(
    'Armadilhas de Desigualdade Étnica (Cruces et al., 2012)',
    'Mobilidade existe mas é mais lenta para negros (armadilha). Crescimento geral não fecha gap.',
    'Políticas de ação afirmativa essenciais.',
    ARRAY['Economia', 'Mobilidade', 'Desigualdade'],
    'Média', 'Alta', 'Média',
    2012,
    'https://example.com/artigo17',
    '{
        "resumo_aside": "\\n\\n**RESUMO**\\n\\nNegros precisam de muito mais esforço para alcançar mobilidade. Armadilha de desigualdade persiste.\\n\\n",
        "publico_alvo": ["Economistas"],
        "metodologia_passos": [{"titulo": "Econometria", "descricao": "Comparativa."}],
        "resultados_key": [{"label": "Mobilidade", "valor": "Lenta", "descricao": "Negros"}],
        "resultados_texto": "Crescimento não equipara.",
        "tabela_evidencias": [{"desfecho": "Mobilidade", "grupo": "Armadilha", "efeito": "Existe", "tamanho": "Médio", "significancia": "Sig.", "observacoes": "Persistente"}],
        "recomendacoes": {"uso": "Planejamento.", "evitar": "Só crescimento.", "recursos": "Transferência.", "custo": "Alto."},
        "referencia": "Cruces et al. (2012)."
    }'::jsonb
),

-- 18. Efeitos da Segregação Racial na Proficiência
(
    'Efeitos da Segregação Racial na Proficiência (Flores, 2010)',
    'Maior segregação entre brancos e negros amplifica o diferencial de desempenho contra o aluno negro.',
    'Políticas de matrícula para mixidade racial.',
    ARRAY['Segregação', 'Proficiência', 'Planejamento Urbano'],
    'Média', 'Alta', 'Alta',
    2010,
    'https://example.com/artigo18',
    '{
        "resumo_aside": "\\n\\n**RESUMO**\\n\\nOnde há maior segregação, o gap de nota é maior. A segregação amplifica o prejuízo acadêmico.\\n\\n",
        "publico_alvo": ["Planejamento"],
        "metodologia_passos": [{"titulo": "Regressão", "descricao": "Com controles."}],
        "resultados_key": [{"label": "Efeito", "valor": "Negativo", "descricao": "Segregação"}],
        "resultados_texto": "Segregação tem efeito direto no desempenho.",
        "tabela_evidencias": [{"desfecho": "Nota", "grupo": "Segregação", "efeito": "Negativo", "tamanho": "Médio", "significancia": "Sig.", "observacoes": "Para negros"}],
        "recomendacoes": {"uso": "Zoneamento.", "evitar": "Guetos.", "recursos": "Transporte.", "custo": "Médio."},
        "referencia": "Flores (2010)."
    }'::jsonb
),

-- 19. Desigualdade de Oportunidades Educacionais
(
    'Desigualdade de Oportunidades Educacionais (Wink Jr & Paese, 2019)',
    '15%+ da desigualdade é explicada por circunstâncias (raça, pais). Esforço não compensa estrutura em regiões pobres.',
    'Investimento desproporcional em áreas com alto IOp.',
    ARRAY['IOp', 'Mérito', 'Política Pública'],
    'Alta', 'Alta', 'Alta',
    2019,
    'https://example.com/artigo19',
    '{
        "resumo_aside": "\\n\\n**RESUMO**\\n\\nO berço (família/raça) ainda determina grande parte do sucesso escolar. Esforço individual não basta.\\n\\n",
        "publico_alvo": ["Gestores"],
        "metodologia_passos": [{"titulo": "Índice", "descricao": "Ferreira & Gignoux."}],
        "resultados_key": [{"label": "IOp", "valor": ">15%", "descricao": "Circunstância"}],
        "resultados_texto": "Regiões pobres têm maior IOp.",
        "tabela_evidencias": [{"desfecho": "Equidade", "grupo": "IOp", "efeito": "Alto", "tamanho": "Grande", "significancia": "Sig.", "observacoes": "Origem define"}],
        "recomendacoes": {"uso": "Alocação.", "evitar": "Igualdade formal.", "recursos": "Redistribuição.", "custo": "Nulo."},
        "referencia": "Wink Jr & Paese (2019)."
    }'::jsonb
),

-- 20. Gaps Raciais em Outra América
(
    'Gaps Raciais em "Outra América" (2022)',
    'Políticas cegas à cor fecham gap de acesso, mas não de aprendizado em SP.',
    'Mudar foco de acesso para aprendizado com equidade.',
    ARRAY['SP', 'Gaps', 'Qualidade'],
    'Média', 'Alta', 'Média',
    2022,
    'https://example.com/artigo20',
    '{
        "resumo_aside": "\\n\\n**RESUMO**\\n\\nSP: Acesso melhorou (universalização), mas aprendizado continua muito desigual. Políticas universalistas não atingem a qualidade.\\n\\n",
        "publico_alvo": ["Secretaria SP"],
        "metodologia_passos": [{"titulo": "Quantitativa", "descricao": "Transição/Proficiência."}],
        "resultados_key": [{"label": "Acesso", "valor": "Ok", "descricao": "Resolvido"}],
        "resultados_texto": "Acumulação desigual de capital humano persiste.",
        "tabela_evidencias": [{"desfecho": "Gap", "grupo": "Qualidade", "efeito": "Persiste", "tamanho": "Médio", "significancia": "Sig.", "observacoes": "Gap de nota"}],
        "recomendacoes": {"uso": "Metas.", "evitar": "Só matrícula.", "recursos": "Avaliação.", "custo": "Médio."},
        "referencia": "Estudo Regional (2022)."
    }'::jsonb
);
