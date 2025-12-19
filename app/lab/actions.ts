'use server';

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import OpenAI from "openai";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";



export async function generateEducationalPlan(input: {
    topic: string;
    grade: string;
    context?: string;
    model?: 'gemini' | 'gpt-5.2';
    duration_days?: string;
    duration_time?: string;
    evidenceContext?: string;
    style?: string; // 'academic', 'gamified', 'tech', 'minimalist', 'custom'
    customStyleContext?: string;
    includeERER?: boolean; // Mode 10639
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    // 1. Check Usage Limits
    const { data: profile } = await supabase.from('perfis').select('limite_mensal, planos_gerados_mes, plano').eq('id', user.id).single();
    const limit = profile?.limite_mensal || 2;
    const usageCount = profile?.planos_gerados_mes || 0;
    const userPlan = profile?.plano || 'free';

    if (usageCount >= limit) {
        throw new Error("Limite mensal atingido.");
    }

    // --- STYLE LOGIC ---
    let styleInstructions = "";
    switch (input.style) {
        case 'academic':
            styleInstructions = "Estilo ACADÊMICO: Use linguagem formal, cite bases teóricas e foque em rigor conceitual. Use tons sóbrios (azuis, cinzas) no design.";
            break;
        case 'gamified':
            styleInstructions = "Estilo GAMIFICADO: Use termos de jogos (missões, XP, chefões), emojis divertidos e uma linguagem engajadora/entusiasmada. Cores vibrantes (roxo, laranja, verde).";
            break;
        case 'tech':
            styleInstructions = "Estilo TECNOLÓGICO: Foque em inovação, futuro e ferramentas digitais. Use uma estética 'Cyber/Modern' (neons, preto, ciano).";
            break;
        case 'minimalist':
            styleInstructions = "Estilo MINIMALISTA: Vá direto ao ponto. Pouco texto, muito espaço em branco, design limpo e essencialista. Preto e branco com detalhe sutil.";
            break;
        case 'custom':
            styleInstructions = `Estilo PERSONALIZADO: ${input.customStyleContext || 'Siga as preferências do usuário.'}`;
            break;
        default: // 'standard'
            styleInstructions = "Estilo PROFISSIONAL E MODERNO: Equilibrado, claro e inspirador. Cores índigo/azul.";
    }

    // --- ERER LOGIC (Mode 10639) ---
    let ererContext = "";
    if (input.includeERER) {
        ererContext = `
        MODO E-VIDENTE 10639 ATIVADO (Educação para Relações Étnico-Raciais):
        - Sua missão é integrar SUTIL e ORGANICAMENTE a valorização da história e cultura afro-brasileira e indígena.
        - Não force a barra; encontre conexões autênticas com o tema ${input.topic}.
        - Utilize metodologias que favoreçam a equidade, o diálogo e o respeito à diversidade.
        - Se possível, sugira autores, cientistas ou personalidades negras/indígenas relacionados ao tema.
        - Refira-se, quando pertinente, a diretrizes da Lei 10.639/03, da Lei 11.645/08 e PNEERQ ou documentos do MEC/SECADI sobre diversidade.
        - O objetivo é normalizar a presença negra/indígena no currículo, não apenas em datas comemorativas.
        `;
    }

    // 2. Build Prompt
    const prompt = `
    Atue como uma Consultora Pedagógica de Elite chamada "E-Vidente".
    Sua missão é criar um planejamento de aula EXCEPCIONAL.
    
    ${ererContext}

    TEMA: ${input.topic}
    PÚBLICO: ${input.grade}
    ${input.context ? `CONTEXTO: ${input.context}` : ''}
    ${input.duration_days ? `DURAÇÃO: ${input.duration_days} dias, ${input.duration_time} por dia` : ''}
    
    ${input.evidenceContext ? `BASEADO NAS SEGUINTES EVIDÊNCIAS:\n${input.evidenceContext}` : ''}

    DIRETRIZES DE ESTILO:
    ${styleInstructions}

    DIRETRIZES VISUAIS OBRIGATÓRIAS (HTML + TAILWIND CSS):
    - Use EXCLUSIVAMENTE tags HTML com classes Tailwind CSS inline.
    - NÃO use Markdown (nada de **bold** ou # header). APENAS HTML.
    - O visual deve ser MODERNO e responsivo.
    - Use cartões (cards) para separar seções.

    ESTRUTURA DA RESPOSTA (Siga rigorosamente, adaptando o tom ao estilo escolhido):

    <div class="space-y-6 font-sans text-gray-900 bg-white p-2 md:p-4">
        
        <!-- CABEÇALHO (Adapte cores ao estilo) -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-lg mb-8 text-white relative overflow-hidden">
            <h1 class="text-3xl font-extrabold mb-2 relative z-10">📝 Título Criativo da Aula</h1>
            <div class="flex flex-wrap gap-4 text-sm opacity-90 mt-4 relative z-10">
                <span class="bg-white/20 px-3 py-1 rounded-full flex items-center gap-2">🎓 ${input.grade}</span>
                <span class="bg-white/20 px-3 py-1 rounded-full flex items-center gap-2">⏳ ${input.duration_days || '1'} dia(s)</span>
            </div>
        </div>

        <!-- CONTEÚDO -->
        <!-- Inclua: Objetivos, Justificativa (Evidências/ERER), Roteiro Detalhado, Atividade Fixação, Avaliação -->
        <!-- Use cards, ícones e destaques visuais -->
        
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-l-4 border-emerald-500">
             <h2 class="text-xl font-bold mb-4">🎯 Objetivos</h2>
             <!-- Lista -->
        </div>

        <!-- Se ERER estiver ativado, inclua um box sutil "Conexão 10.639" ou integre no roteiro -->

        <!-- Roteiro -->
        <div class="space-y-4">
            <h2 class="text-xl font-bold">⏱️ Roteiro</h2>
            <!-- Etapas -->
        </div>

    </div>
    `;

    let generatedText = "";

    try {
        if (input.model === 'gpt-5.2') {
            // GPT Logic (Legacy/Alternative)
            if (userPlan !== 'intensive') {
                throw new Error("O modelo GPT-5.2 é exclusivo para o plano Intensivo.");
            }
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'dummy' });
            const completion = await openai.chat.completions.create({
                model: "gpt-5.2", // Simulator/Placeholder name
                messages: [
                    { role: "system", content: "Você é a E-Vidente." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
            });
            generatedText = completion.choices[0].message.content || "";

        } else {
            // Gemini Logic (Default)
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy');

            const safetySettings = [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
            ];

            // Using a capable model for generation
            const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview", safetySettings });
            const result = await model.generateContent(prompt);
            generatedText = result.response.text();
        }

        // 3. Register Usage
        await supabase.from('perfis').update({
            planos_gerados_mes: usageCount + 1
        }).eq('id', user.id);

        await supabase.from('logs_uso').insert({
            usuario_id: user.id,
            acao: 'gerar_plano',
            modelo: input.model || 'gemini',
            detalhes: { style: input.style, erer: input.includeERER },
            custo_creditos: 1
        });

        // Clean HTML
        const cleanHtml = generatedText.replace(/```html\s*/g, '').replace(/```/g, '');
        return { plan: cleanHtml };

    } catch (error: any) {
        console.error("Generation Error:", error);
        throw new Error(`Erro ao gerar o plano: ${error.message || JSON.stringify(error)}`);
    }
}

// === CHAT ACTION ===

export async function chatWithPlan(
    history: { role: 'user' | 'model', parts: string }[],
    currentPlanHTML: string,
    userMessage: string
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy');
        // Requested model: gemini-3-flash-preview (or fallback to 1.5-flash if unavailable, but user insisted)
        // Requested model: gemini-3-flash-preview for chat
        const chatModel = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            // Apply safety settings here as well to avoid blocks on ERER content during chat
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ]
        });

        // Context setup
        const systemInstruction = `
        Você é a E-Vidente, uma assistente pedagógica inteligente.
        O usuário está visualizando um PLANO DE AULA gerado por você.
        
        CONTEÚDO ATUAL DO PLANO (HTML):
        ${currentPlanHTML}
        
        SEU OBJETIVO: Ajudar o usuário a refinar, alterar ou tirar dúvidas sobre este plano.
        
        IMPORTANTE - PROTOCOLO DE ATUALIZAÇÃO:
        1. Se o usuário pedir qualquer alteração que mude o plano (ex: "mude a atividade", "adicione mais tempo", "troque o estilo"), você DEVE fornecer o CÓDIGO HTML COMPLETO ATUALIZADO DO PLANO.
        2. O código HTML deve vir SEMPRE dentro destes delimitadores exatos:
           :::PLAN_START:::
           <div...> ... seu html completo atualizado ... </div>
           :::PLAN_END:::
        3. Você deve responder ao usuário fora desses delimitadores com uma mensagem curta e amigável (ex: "Claro! Atualizei o plano com uma nova atividade de fixação. O que achou?").
        4. Se for apenas uma dúvida sem alterar o plano, responda normalmente sem os delimitadores.
        `;

        const chat = chatModel.startChat({
            history: [
                { role: 'user', parts: [{ text: systemInstruction }] },
                { role: 'model', parts: [{ text: "Entendido. Estou pronta para ajudar a refinar o plano." }] },
                ...history.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.parts }]
                }))
            ]
        });

        const result = await chat.sendMessage(userMessage);
        const responseText = result.response.text();

        return { response: responseText };

    } catch (error) {
        console.error("Chat Error:", error);
        return { error: "Erro ao processar mensagem." };
    }
}

export async function toggleFavorite(evidenceId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not logged in' }

    // Check if already favorite
    const { data: existing } = await supabase
        .from('favoritos')
        .select('*')
        .eq('usuario_id', user.id)
        .eq('evidencia_id', evidenceId)
        .single()

    if (existing) {
        // Remove
        await supabase.from('favoritos').delete().eq('id', existing.id)
        revalidatePath('/lab')
        return { isFavorite: false }
    } else {
        // Add
        await supabase.from('favoritos').insert({ usuario_id: user.id, evidencia_id: evidenceId })
        revalidatePath('/lab')
        return { isFavorite: true }
    }
}

// === Saved Plans Actions ===

export async function savePlan(planData: { title: string, html: string, grade: string }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase.from('planos_salvos').insert({
        usuario_id: user.id,
        titulo: planData.title,
        conteudo_html: planData.html,
        persona: planData.grade // Storing grade in 'persona' column for display purposes
    }).select().single();

    if (error) {
        console.error("Error saving plan:", error);
        return { error: 'Failed to save plan' };
    }

    revalidatePath('/dashboard');
    return { success: true, plan: data };
}

export async function getSavedPlans() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data } = await supabase
        .from('planos_salvos')
        .select('*')
        .eq('usuario_id', user.id)
        .order('criado_em', { ascending: false });

    return data || [];
}

export async function deletePlan(planId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('planos_salvos')
        .delete()
        .eq('id', planId)
        .eq('usuario_id', user.id);

    if (error) {
        console.error("Error deleting plan:", error);
        return { error: 'Failed' };
    }

    revalidatePath('/dashboard');
    return { success: true };
}

export async function renamePlan(planId: string, newTitle: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('planos_salvos')
        .update({ titulo: newTitle })
        .eq('id', planId)
        .eq('usuario_id', user.id);

    if (error) {
        console.error("Error renaming plan:", error);
        return { error: 'Failed' };
    }

    revalidatePath('/dashboard');
    return { success: true };
}

export async function updatePlanContent(planId: string, newHtml: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('planos_salvos')
        .update({ conteudo_html: newHtml })
        .eq('id', planId)
        .eq('usuario_id', user.id);

    if (error) {
        console.error("Error updating plan content:", error);
        return { error: 'Failed' };
    }

    revalidatePath('/dashboard');
    revalidatePath(`/plans/${planId}`);
    return { success: true };
}
