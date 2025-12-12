import React from 'react';
import Hero from '@/components/Hero';
import Methodology from '@/components/Methodology';
import PersonaCard from '@/components/PersonaCard';
import Testimonial from '@/components/Testimonial';
import About from '@/components/About';
import { GraduationCap, BarChart2, Users, FileText } from 'lucide-react';

export default function Home() {
  return (
    <main>
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


      {/* B.ia Promo Section */}
      <div className="bg-gradient-to-br from-gray-900 to-brand-brown py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="md:w-1/2 text-white">
            <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-bold mb-6 text-pink-200">
              ✨ Nova Funcionalidade Beta
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Planejamento de aulas com <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-200">Inteligência Artificial</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Conheça a <strong>E-Vidente ✨</strong>, nossa assistente virtual. Ela lê as evidências científicas do EcE Lab e cria planos de aula personalizados para sua realidade em segundos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/dashboard" className="bg-white text-brand-brown px-8 py-4 rounded-xl font-bold text-lg hover:bg-pink-50 transition-all shadow-xl inline-flex items-center gap-2 justify-center">
                <span className="text-xl">✨</span> Acessar E-Vidente
              </a>
              <a href="/lab" className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all shadow-xl inline-flex items-center gap-2 justify-center">
                Acessar Biblioteca
              </a>
            </div>
          </div>
          <div className="md:w-1/2 bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
            {/* Abstract UI representation */}
            <div className="space-y-4 opacity-80">
              <div className="h-8 bg-white/10 rounded-lg w-3/4"></div>
              <div className="h-4 bg-white/10 rounded w-full"></div>
              <div className="h-4 bg-white/10 rounded w-5/6"></div>
              <div className="flex gap-2 pt-4">
                <div className="h-20 w-full bg-pink-500/20 rounded-xl border border-pink-500/30"></div>
                <div className="h-20 w-full bg-blue-500/20 rounded-xl border border-blue-500/30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <About />
      <Testimonial />
    </main >
  );
}
