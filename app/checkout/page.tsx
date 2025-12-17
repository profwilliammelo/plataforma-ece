'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { createClient } from '@/utils/supabase/client';

// Make sure to call loadStripe outside of a component’s render to avoid recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
    const searchParams = useSearchParams();
    const router = useRouter(); // Import this
    const planParam = searchParams.get('plan');
    const plan = (planParam === 'intensive' ? 'intensive' : 'casual');
    const [clientSecret, setClientSecret] = useState('');
    const [loadingAuth, setLoadingAuth] = useState(true);

    const supabase = createClient(); // Import from utils/supabase/client

    useEffect(() => {
        async function checkAuthAndInit() {
            setLoadingAuth(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // Redirect to login, remembering to come back here
                const returnUrl = encodeURIComponent(`/checkout?plan=${plan}`);
                router.push(`/login?next=${returnUrl}`);
                return;
            }

            // If logged in, create session
            fetch("/api/checkout_sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setClientSecret(data.clientSecret);
                    setLoadingAuth(false);
                });
        }

        checkAuthAndInit();
    }, [plan, router]);

    if (loadingAuth && !clientSecret) {
        return (
            <div className="flex justify-center py-20 flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-brown mb-4"></div>
                <p className="text-gray-500">Verificando segurança...</p>
            </div>
        );
    }

    return (
        <div id="checkout" className="w-full">
            {clientSecret ? (
                <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{ clientSecret }}
                >
                    <EmbeddedCheckout className="w-full min-h-[800px] py-8" />
                </EmbeddedCheckoutProvider>
            ) : (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-brown"></div>
                </div>
            )}
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white border-b border-gray-200 pt-8 pb-8 px-4 mb-8">
                <div className="max-w-6xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-brown mb-4 transition-colors">
                        <ArrowLeft size={18} /> Voltar
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">Finalizar Assinatura</h1>
                    <p className="text-gray-500 mt-2">Pagamento seguro via Stripe</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                <Suspense fallback={<div className="text-center p-10">Carregando...</div>}>
                    <CheckoutForm />
                </Suspense>
            </div>
        </div>
    );
}
