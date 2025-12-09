import React from 'react';
import Hero from '@/components/Hero';
import Methodology from '@/components/Methodology';
import PersonaCard from '@/components/PersonaCard';
import Testimonial from '@/components/Testimonial';
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

      <Testimonial />
    </main>
  );
}
