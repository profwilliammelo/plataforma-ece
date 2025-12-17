'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle } from 'lucide-react';

function ReturnContent() {
    const router = useRouter(); // Import this
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {
        if (sessionId) {
            setStatus('complete');
            // Force a refresh so when they navigate back to Dashboard, 
            // the server components re-fetch fresh data from Supabase.
            // This clears the Router Cache.
            router.refresh();
        }
    }, [sessionId, router]);

    if (status === 'complete') {
        return (
            <div className="text-center py-20 px-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <CheckCircle size={40} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Assinatura Confirmada!</h1>
                <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto">
                    Obrigado por assinar o Plano. Seu acesso ao E-Vidente já está liberado.
                    Um recibo foi enviado para seu email.
                </p>
                <Link href="/dashboard" className="bg-brand-brown text-white px-8 py-3 rounded-xl font-bold hover:bg-brown-900 transition-colors inline-block">
                    Ir para o Dashboard
                </Link>
            </div>
        );
    }

    return null;
}

export default function ReturnPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-2xl w-full mx-4">
                <Suspense fallback={<div>Carregando...</div>}>
                    <ReturnContent />
                </Suspense>
            </div>
        </div>
    );
}
