import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover',
} as Stripe.StripeConfig);

export async function POST(request: Request) {
    try {
        const body = await request.text();
        const headerPayload = await headers();
        const sig = headerPayload.get('stripe-signature');

        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            console.error('❌ STRIPE_WEBHOOK_SECRET is missing.');
            return NextResponse.json({ error: 'Missing STRIPE_WEBHOOK_SECRET' }, { status: 500 });
        }

        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing.');
            return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 });
        }

        if (!sig) {
            return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
        }

        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
        } catch (err: any) {
            console.error(`⚠️ Webhook signature verification failed.`, err.message);
            return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
        }

        // Initialize Supabase Admin Client
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutSessionCompleted(session, supabase);
                break;
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionUpdated(subscription, supabase);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error('❌ Unhandled Webhook Error:', err);
        return NextResponse.json({ error: `Server Error: ${err.message}` }, { status: 500 });
    }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, supabase: any) {
    const userId = session.metadata?.user_id;
    const plan = session.metadata?.plan;

    if (!userId || userId === 'guest') {
        console.log('Guest checkout or missing user_id');
        return;
    }

    console.log(`Processing subscription for user ${userId}, plan ${plan}`);

    let limit = 2; // Default Free
    if (plan === 'casual') limit = 10;
    if (plan === 'intensive') limit = 999999; // Unlimited

    // Update user profile
    const { error } = await supabase
        .from('perfis')
        .update({
            plano: plan,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            limite_mensal: limit,
            planos_gerados_mes: 0, // Reset usage on new sub
            data_renovacao: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString() // +1 Month rough estimate
        })
        .eq('id', userId);

    if (error) {
        console.error('Error updating profile:', error);
    } else {
        console.log(`User ${userId} upgraded to ${plan}`);

        // Explicitly grant access to 'e-vidente' product
        const { data: product } = await supabase
            .from('produtos')
            .select('id')
            .eq('slug', 'e-vidente')
            .single();

        if (product) {
            await supabase
                .from('produtos_usuario')
                .upsert({
                    usuario_id: userId,
                    produto_id: product.id,
                    ativo: true
                }, { onConflict: 'usuario_id, produto_id' });
            console.log(`Granted E-Vidente product to ${userId}`);
        } else {
            console.error(`ERROR: Product 'e-vidente' not found in DB! Could not grant access to user ${userId}`);
        }
    }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
    const priceId = subscription.items.data[0]?.price.id;
    console.log(`Subscription updated: ${subscription.id}, Status: ${subscription.status}, Price: ${priceId}`);

    // Map Price IDs to Plan Names
    const PRICE_MAP: Record<string, string> = {
        'price_1SebaXF4rm3lI7H55REMC2dA': 'casual',
        'price_1Sf2arF4rm3lI7H5MxWqyPS6': 'intensive'
    };

    const newPlan = PRICE_MAP[priceId];

    // Find user by subscription ID
    const { data: profile } = await supabase
        .from('perfis')
        .select('id, plano')
        .eq('stripe_subscription_id', subscription.id)
        .single();

    if (!profile) {
        console.error('User not found for subscription', subscription.id);
        return;
    }

    const isActive = ['active', 'trialing'].includes(subscription.status);
    const shouldRevoke = ['canceled', 'unpaid', 'past_due', 'incomplete_expired'].includes(subscription.status);

    if (isActive && newPlan) {
        // Handle Upgrade/Downgrade/Renewal
        console.log(`Updating subscription for user ${profile.id} to plan ${newPlan}`);

        let limit = 2;
        if (newPlan === 'casual') limit = 10;
        if (newPlan === 'intensive') limit = 999999;

        await supabase.from('perfis').update({
            plano: newPlan,
            limite_mensal: limit,
            // We don't necessarily reset usage on simple update, only if plan changed? 
            // For simplicity, we keep usage unless we want to reset it on upgrade.
            // Let's reset purely for logic simplicity or keep it? User didn't specify.
            // Let's NOT reset usage here to avoid abuse by switching plans repeatedly.
            data_renovacao: new Date((subscription as any).current_period_end * 1000).toISOString()
        }).eq('id', profile.id);

        console.log(`Profile updated to ${newPlan}`);
        // The DB Trigger will handle the 'produtos_usuario' sync automatically!

    } else if (shouldRevoke) {
        console.log(`Revoking access for subscription ${subscription.id}`);
        // Revoke Access (Set to Free)
        await supabase.from('perfis').update({
            plano: 'free',
            limite_mensal: 2,
            stripe_subscription_id: null,
            data_renovacao: null
        }).eq('id', profile.id);

        console.log(`Access revoked for user ${profile.id}`);
        // The DB Trigger will handle the 'produtos_usuario' sync automatically!
    } else {
        console.log(`Subscription status ${subscription.status} or Price ${priceId} unhandled.`);
    }
}
