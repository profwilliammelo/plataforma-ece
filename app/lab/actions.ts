'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";
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

    // 2. Build Prompt
    const prompt = `
    Atue como uma Consultora Pedagógica de Elite chamada "E-Vidente".
    Sua missão é criar um planejamento de aula EXCEPCIONAL, visualmente IMPACTANTE e baseado em evidências científicas.

    TEMA: ${input.topic}
    PÚBLICO: ${input.grade}
    ${input.context ? `CONTEXTO: ${input.context}` : ''}
    ${input.duration_days ? `DURAÇÃO: ${input.duration_days} dias, ${input.duration_time} por dia` : ''}
    
    ${input.evidenceContext ? `BASEADO NAS SEGUINTES EVIDÊNCIAS:\n${input.evidenceContext}` : ''}

    DIRETRIZES VISUAIS OBRIGATÓRIAS (HTML + TAILWIND CSS):
    - Use EXCLUSIVAMENTE tags HTML com classes Tailwind CSS inline.
    - NÃO use Markdown. APENAS HTML.
    - O visual deve ser MODERNO, LIMPO e PROFISSIONAL.
    - Use cartões (cards) para separar seções.
    - Use ícones (emojis) para ilustrar cada seção.

    ESTRUTURA DA RESPOSTA (Siga rigorosamente):

    <div class="space-y-6 font-sans text-gray-900 bg-white">
        
        <!-- CABEÇALHO -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-lg mb-8">
            <h1 class="text-3xl font-extrabold mb-2 text-white">📝 Título Criativo da Aula Aqui</h1>
            <div class="flex flex-wrap gap-4 text-sm opacity-90 mt-4 text-white">
                <span class="bg-white/20 px-3 py-1 rounded-full flex items-center gap-2 text-white">🎓 ${input.grade}</span>
                <span class="bg-white/20 px-3 py-1 rounded-full flex items-center gap-2 text-white">⏳ ${input.duration_days || '1'} dia(s)</span>
                <span class="bg-white/20 px-3 py-1 rounded-full flex items-center gap-2 text-white">📚 ${input.topic}</span>
            </div>
        </div>

        <!-- OBJETIVOS -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-l-4 border-emerald-500">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">🎯 Objetivos de Aprendizagem</h2>
            <ul class="space-y-3 list-none">
                <li class="flex items-start gap-3">
                    <span class="text-emerald-600 mt-1 font-bold">✓</span>
                    <span class="text-gray-800 font-medium">Objetivo claro e mensurável 1...</span>
                </li>
                <!-- listar 3-4 objetivos -->
            </ul>
        </div>

        <!-- EVIDÊNCIAS -->
        <div class="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <h2 class="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">🧠 Por que isso funciona? (Ciência da Aprendizagem)</h2>
            <p class="text-indigo-700/80 mb-4 italic">"Explicação breve sobre os princípios utilizados..."</p>
            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-white p-4 rounded-xl shadow-sm">
                    <strong class="text-indigo-600 block mb-1">Princípio 1</strong>
                    <span class="text-sm text-gray-600">Explicação curta...</span>
                </div>
                <!-- mais princípios -->
            </div>
        </div>

        <!-- ROTEIRO -->
        <div class="space-y-4">
            <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2 px-2">⏱️ Roteiro da Aula</h2>
            
            <!-- ETAPA 1 -->
            <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex gap-4 hover:border-blue-300 transition-colors">
                <div class="bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-lg h-fit shrink-0 whitespace-nowrap">10 min</div>
                <div>
                    <h3 class="font-bold text-gray-800 mb-1">Introdução / Aquecimento</h3>
                    <p class="text-gray-600 leading-relaxed">Descrição detalhada do que o professor deve fazer...</p>
                    <div class="mt-3 bg-yellow-50 text-yellow-800 text-sm p-3 rounded-lg inline-block">
                        💡 <strong>Dica do Professor:</strong> Uma sugestão prática aqui.
                    </div>
                </div>
            </div>

            <!-- ETAPA 2... -->
        </div>

        <!-- FIXAÇÃO -->
        <div class="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-2xl text-white shadow-md">
            <h2 class="text-xl font-bold mb-4 flex items-center gap-2">🧩 Atividade de Fixação</h2>
            <p class="opacity-90 leading-relaxed">Descrição da atividade prática para consolidar o aprendizado.</p>
        </div>

        <!-- AVALIAÇÃO -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">📊 Avaliação da Aprendizagem</h2>
            <ul class="grid md:grid-cols-3 gap-4">
                <li class="bg-gray-50 p-3 rounded-lg text-center text-sm font-medium text-gray-600">Critério 1</li>
                <li class="bg-gray-50 p-3 rounded-lg text-center text-sm font-medium text-gray-600">Critério 2</li>
                <li class="bg-gray-50 p-3 rounded-lg text-center text-sm font-medium text-gray-600">Critério 3</li>
            </ul>
        </div>
    </div>
    `;

    let generatedText = "";

    try {
        if (input.model === 'gpt-5.2') {
            // GPT-5.2 Logic
            if (userPlan !== 'intensive') {
                throw new Error("O modelo GPT-5.2 é exclusivo para o plano Intensivo.");
            }

            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'dummy' }); // Lazy init with fallback
            const completion = await openai.chat.completions.create({
                model: "gpt-5.2",
                messages: [
                    { role: "system", content: "Você é a E-Vidente, uma especialista em pedagogia baseada em evidências." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
            });
            generatedText = completion.choices[0].message.content || "";

        } else {
            // Gemini Logic
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy'); // Lazy init
            const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });
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
            modelo: input.model === 'gpt-5.2' ? 'gpt-5.2' : 'gemini-3',
            custo_creditos: 1
        });

        // Clean HTML
        const cleanHtml = generatedText.replace(/```html\s*/g, '').replace(/```/g, '');
        return { plan: cleanHtml };

    } catch (error) {
        console.error("Generation Error:", error);
        throw new Error("Erro ao gerar o plano. Tente novamente.");
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
