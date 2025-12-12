import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, BookOpen, PenTool, Users } from 'lucide-react';

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-brand-brown py-12 md:py-20 text-center px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/" className="inline-flex items-center text-pink-200 hover:text-white mb-6 uppercase text-xs font-bold tracking-widest transition-colors">
            <ArrowLeft size={14} className="mr-2" /> Voltar para Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Nossa Metodologia</h1>
          <p className="text-xl text-pink-100 max-w-2xl mx-auto font-light">
            Um mergulho profundo em como transformamos teoria em prática escolar, honrando nossa ancestralidade.
          </p>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 opacity-10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-16">

        {/* Infographic Section */}
        <div className="mb-20 text-center animate-fade-in">
          <h2 className="text-xs font-bold text-brand-brown uppercase mb-8 tracking-widest">Fluxo Visual do Processo</h2>
          <div className="relative w-full h-[300px] md:h-[500px] bg-pink-50/50 rounded-3xl border border-pink-100 p-8 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <Image
              src="/methodology-cultural-final.png"
              alt="Infográfico Cultural: Baobá (Ciência), Sankofa (Arte/Tecnologia) e Ação Educacional (Conexão Humana)"
              fill
              className="object-contain mix-blend-multiply"
              priority
            />
          </div>
          <p className="text-sm text-gray-500 mt-4 italic">Nosso ciclo virtuoso conectando ancestralidade, inovação e comunidade.</p>
        </div>

        {/* Detailed Text */}
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-brand-brown mb-4">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">1. Baobá do Conhecimento</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Representamos a ciência com o <strong>Baobá</strong>, árvore símbolo de resistência e ancestralidade. Assim como suas raízes profundas nutrem o solo, nossa base é a evidência científica sólida e contextualizada, que sustenta todo o ecossistema educacional.
            </p>
          </div>

          <div>
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-brand-brown mb-4">
              <PenTool size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">2. Sankofa: Arte & Tecnologia</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Inspirados no <strong>Sankofa</strong> (&quot;olhar para o passado para construir o futuro&quot;), unimos a potência da arte com a inovação tecnológica. Traduzimos saberes acadêmicos em experiências sensíveis, honrando a cultura enquanto olhamos para a frente.
            </p>
          </div>

          <div>
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-brand-brown mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">3. Ação em Comunidade</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              A ação não é um foguete distante, mas uma roda de <strong>pessoas conectadas</strong>. O impacto real acontece no chão da escola, fortalecendo vínculos entre estudantes, professores e famílias. Nossa tecnologia social é o encontro.
            </p>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="bg-gray-50 border-t border-gray-200 py-16 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Quer ver isso em prática?</h3>
          <Link
            href="/lab"
            className="bg-brand-brown text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-brown-900 transition-all hover:shadow-xl transform hover:-translate-y-1"
          >
            Explorar o EcE Lab
          </Link>
        </div>
      </div>
    </main>
  );
}
