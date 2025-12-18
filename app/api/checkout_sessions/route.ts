import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

// Initialize Stripe with the private key
export async function POST(request: Request) {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
            apiVersion: '2025-11-17.clover',
        });

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const { plan } = await request.json();

        // Define price IDs (You would typically fetch these from your DB or Env)
        // For now, we simulate different prices. In production, use real Stripe Price IDs (price_...)
        // Use explicit Price IDs from Stripe Dashboard
        let priceId;

        if (plan === 'casual') {
            priceId = 'price_1Sffz7FTKk14sJdfy0tvIq2N';
        } else if (plan === 'intensive') {
            priceId = 'price_1SffzWFTKk14sJdfBKBLKUQD';
        } else {
            return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            return_url: `${request.headers.get('origin')}/return?session_id={CHECKOUT_SESSION_ID}`,
            metadata: {
                user_id: user?.id || 'guest',
                plan: plan
            }
        });

        return NextResponse.json({ clientSecret: session.client_secret });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
