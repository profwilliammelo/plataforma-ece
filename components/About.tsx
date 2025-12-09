import React from 'react';
import Image from 'next/image';

const TeamMember = ({ name, role, tags, bio, imageSrc, linkedinUrl }: { name: string, role: string, tags: string[], bio: string, imageSrc: string, linkedinUrl?: string }) => (
    <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="relative w-48 h-48 flex-shrink-0 cursor-pointer block group">
            <Image
                src={imageSrc}
                alt={name}
                fill
                className="object-cover rounded-full border-4 border-pink-50 group-hover:border-brand-brown transition-colors"
            />
        </a>
        <div className="flex-1 text-center md:text-left">
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:underline decoration-brand-brown">
                <h3 className="text-2xl font-bold text-brand-brown mb-2">{name}</h3>
            </a>
            <p className="text-pink-600 font-medium mb-3">{role}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                {tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded-full border border-gray-100">
                        {tag}
                    </span>
                ))}
            </div>
            <p className="text-gray-600 leading-relaxed">
                {bio}
            </p>
        </div>
    </div>
);

export default function About() {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-pink-50/30">
            <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-pink-600 font-bold tracking-wider uppercase text-sm">Quem Somos</span>
                    <h2 className="text-4xl font-extrabold text-[#1A1A1A] mt-2 mb-4">
                        O Coração da <span className="text-brand-brown">EcE</span>
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Conheça as mentes e corações por trás da nossa missão de transformar a educação com ciência e afeto.
                    </p>
                </div>

                <div className="space-y-8">
                    <TeamMember
                        name="William Melo"
                        role="Fundador & Especialista em Educação"
                        tags={['Doutor em Educação (UFRJ)', 'Ciência do Afeto', 'Artista HipHop']}
                        bio="Sou Educador, artista de HipHop, Doutor em Educação pela Universidade Federal do Rio de Janeiro e tenho especialidade em distribuição de oportunidades educacionais. Sou fundador da metodologia educacional Ciência do Afeto e da Educação com Evidências."
                        imageSrc="/will.jpg"
                        linkedinUrl="https://www.linkedin.com/in/williamcorreademelo/"
                    />
                    <TeamMember
                        name="Isabel Costa"
                        role="Gestão Administrativa"
                        tags={['Administração (UVA)', 'Gestão de Processos', 'Operações']}
                        bio="Natural do Rio de Janeiro, formada em Administração de Empresas pela Universidade Veiga de Almeida (UVA). Responsável por garantir que nossa operação flua com eficiência e carinho."
                        imageSrc="/isabel.png"
                        linkedinUrl="https://www.linkedin.com/in/isabel-c-aa9117a7/"
                    />
                </div>
            </div>
        </section>
    );
}
