import React from 'react';
import { Heart, User } from 'lucide-react';

export default function Testimonial() {
    return (
        <div className="bg-white py-16">
            <div className="max-w-5xl mx-auto px-4">
                <div className="bg-brand-brown rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden text-white shadow-xl">
                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-pink-200 rounded-full flex-shrink-0 border-4 border-white/20 overflow-hidden relative flex items-center justify-center">
                            <User className="w-12 h-12 text-brand-brown/50" />
                        </div>
                        <div className="text-center sm:text-left">
                            <div className="mb-4">⭐⭐⭐⭐⭐</div>
                            <p className="text-lg sm:text-2xl font-medium leading-relaxed italic mb-6">
                                &quot;Eu me sentia muito insegura recém-aprovada no concurso. O EcE me deu um &apos;norte&apos; prático, baseado em ciência, mas com uma linguagem que abraça a gente.&quot;
                            </p>
                            <div>
                                <p className="font-bold text-lg">Priscila Santos</p>
                                <p className="text-pink-200 text-sm">Estudante de Pedagogia e Professora da Rede Pública</p>
                            </div>
                        </div>
                    </div>
                    {/* Background Pattern */}
                    <Heart className="absolute -bottom-10 -right-10 w-64 h-64 text-white opacity-5" />
                </div>
            </div>
        </div>
    );
}
