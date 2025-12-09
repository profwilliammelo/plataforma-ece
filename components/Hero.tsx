import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Hero() {
    return (
        <div className="relative overflow-hidden bg-[#FFF0F5] py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    <span className="inline-block bg-white/60 backdrop-blur border border-pink-100 text-brand-brown px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-6">
                        ✨ Ciência e Afeto em Educação
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-[#1A1A1A] tracking-tight mb-6 leading-tight">
                        Transformamos dados e boas evidências em <span className="text-brand-brown">acolhimento e ações reais.</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
                        Uma instituição que conecta pesquisas a práticas simples para professores, gestores e famílias. Sem "academiquês".
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/lab"
                            className="bg-brand-brown text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:bg-[#4E342E] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            Explorar o EcE Lab
                            <ChevronRight />
                        </Link>
                        <Link
                            href="/metodologia"
                            className="bg-white text-brand-brown border-2 border-brand-brown/20 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-pink-50 transition-all flex items-center justify-center"
                        >
                            Conhecer Metodologia
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative Blobs */}
            <div className="absolute top-0 left-0 -ml-20 -mt-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>
    );
}
