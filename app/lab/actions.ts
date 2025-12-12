'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateEducationalPlan(formData: FormData, evidenceContext: string) {
    const topic = formData.get('topic') as string;
    const grade = formData.get('grade') as string;
    const context = formData.get('context') as string;
    const durationDays = formData.get('duration_days') as string;
    const durationTime = formData.get('duration_time') as string;

    const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

    const prompt = `
    Você é a **E-Vidente ✨**, uma consultora pedagógica especialista em Educação Baseada em Evidências.
    
    Sua missão é criar um Planejamento Pedagógico Personalizado.
    
    **Dados do Pedido:**
    - TEMA: ${topic}
    - ANO/SÉRIE: ${grade}
    - DURAÇÃO: ${durationDays} dia(s), ${durationTime} por dia.
    - CONTEXTO: ${context}
    
    **Diretrizes:**
    1. Utilize o contexto das seguintes evidências científicas se aplicável (mas não se limite a elas):
    ${evidenceContext}
    
    IMPORTANTE: Sempre que citar uma evidência do contexto, você DEVE linkar para a fonte original externa.
    Formato do link: <a href="URL_DA_EVIDENCIA" target="_blank" class="text-brand-brown hover:underline font-bold">TITULO_DA_EVIDENCIA (Link Externo)</a>.
    Onde URL_DA_EVIDENCIA é o campo 'link' fornecido no contexto. Se não houver link, não crie o <a>.

    FORMATO DE SAÍDA (HTML puro, sem markdown):
    <div class="space-y-6">
        <h2 class="text-2xl font-bold text-brand-brown">Planejamento: ${topic}</h2>
        <div class="bg-pink-50 p-4 rounded-xl text-sm border border-pink-100">
             <strong>Público:</strong> ${grade} | <strong>Tempo:</strong> ${durationDays} dia(s) (${durationTime})
        </div>
        ... (Estruture com h3, p, ul, li) ...
    </div>
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // Remove markdown code blocks if present just in case
        return text.replace(/```html/g, '').replace(/```/g, '');
    } catch (error) {
        console.error("Gemini Error:", error);
        return "<p>Desculpe, não consegui gerar o plano no momento. Tente novamente mais tarde.</p>";
    }
}

export async function toggleFavorite(evidenceId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not logged in' }

    // Check if already favorite
    const { data: existing } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('evidence_id', evidenceId)
        .single()

    if (existing) {
        // Remove
        await supabase.from('favorites').delete().eq('id', existing.id)
        revalidatePath('/lab')
        return { isFavorite: false }
    } else {
        // Add
        await supabase.from('favorites').insert({ user_id: user.id, evidence_id: evidenceId })
        revalidatePath('/lab')
        return { isFavorite: true }
    }
}
