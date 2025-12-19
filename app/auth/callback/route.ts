import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    console.log('Auth Callback Hit!', request.url);
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard'

    console.log('Processing code:', code ? 'YES' : 'NO', 'Redirecting to:', next);

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            console.log('Session exchanged successfully');
            return NextResponse.redirect(`${origin}${next}`)
        } else {
            console.error('Session exchange error:', error);
        }
    }

    // callbacks are essentially generic, but here we can handle errors
    return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}
