import React from 'react';
import Hero from '@/components/Hero';
import Methodology from '@/components/Methodology';
import PersonaCard from '@/components/PersonaCard';
import Testimonial from '@/components/Testimonial';
import About from '@/components/About';
import { GraduationCap, BarChart2, Users, FileText, Check, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import PricingSection from '@/components/PricingSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Hero />
      <Methodology />

      {/* Section Personas */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-center text-3xl font-bold mb-12 text-[#1A1A1A]">Para quem é o EcE?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <PersonaCard
            icon={GraduationCap}
            title="Professor(a)"
            desc="Planos de aula e estratégias de sala baseadas no que funciona."
            color="bg-pink-400"
          />
          <PersonaCard
            icon={BarChart2}
            title="Gestor(a)"
            desc="Dados territoriais e ferramentas para monitorar equidade."
            color="bg-brand-brown"
          />
          <PersonaCard
            icon={Users}
            title="Família"
            desc="Entenda como apoiar a vida escolar dos seus filhos."
            color="bg-teal-600"
          />
          <PersonaCard
            icon={FileText}
            title="Estudante"
            desc="Dicas de estudo e acolhimento para sua jornada."
            color="bg-orange-500"
          />
        </div>
      </div>

      {/* 2.5 New AI Models Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto border-t border-gray-200 bg-white">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <div className="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold mb-4 uppercase tracking-wider">
              Diferencial E-Vidente
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Planejamentos baseados em evidências <span className="text-brand-brown">com poucos cliques.</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Esqueça a inteligência artificial genérica que &quot;alucina&quot;. A E-Vidente é uma consultora pedagógica treinada com uma base de dados proprietária, curada cientificamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/resources/e-vidente" className="px-8 py-4 bg-brand-brown text-white rounded-xl font-bold hover:bg-brown-900 transition-all shadow-lg flex items-center justify-center gap-2">
                <Sparkles size={20} />
                Conhecer a E-Vidente
              </Link>
            </div>
            <Link href="/nota-tecnica" className="text-gray-500 text-sm hover:text-brand-brown hover:underline flex items-center gap-2">
              <BookOpen size={16} /> Ler Nota Técnica sobre metodologia de classificação de evidências
            </Link>
          </div>

          <div className="md:w-1/2 w-full">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                    <Sparkles size={32} className="text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">E-Vidente Gênio</h3>
                    <p className="text-purple-300 font-medium">Sua Consultora de Elite</p>
                  </div>
                </div>

                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Capaz de analisar múltiplas evidências, criar sequências didáticas detalhadas e justificar cada escolha pedagógica com rigor científico.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">Versão Gemini</p>
                    <p className="font-bold text-white">Raciocínio Ágil</p>
                  </div>
                  <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                    <p className="text-xs text-purple-300 uppercase font-bold mb-1">Versão GPT-5.2</p>
                    <p className="font-bold text-white">Criatividade Profunda</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pricing Section (UPDATED) */}
      <PricingSection />

      <About />
      <Testimonial />
    </main >
  );
}
