'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

const getURL = () => {
    let url =
        process.env.NEXT_PUBLIC_SITE_URL || // Set this to your site URL in production env.
        process.env.NEXT_PUBLIC_VERCEL_URL || // Automatically set by Vercel.
        process.env.VERCEL_URL || // Automatically set by Vercel.
        'http://localhost:3000/'

    // Make sure to include `https://` when not localhost.
    if (!url.includes('http')) {
        url = url.includes('localhost') ? `http://${url}` : `https://${url}`
    }

    // Force http for localhost if accidentally set to https in env
    if (url.includes('localhost') && url.includes('https')) {
        url = url.replace('https', 'http')
    }
    // Remove trailing slash if present to avoid double slashes when determining redirect path
    url = url.charAt(url.length - 1) === '/' ? url.slice(0, -1) : url

    console.log('getURL resolved to:', url, {
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
        NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
        VERCEL_URL: process.env.VERCEL_URL
    })

    return url
}

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    console.log('Login attempt:', email, error ? 'Error: ' + error.message : 'Success');
    if (data.session) console.log('Session created');

    if (error) {
        redirect('/login?error=true')
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        redirect('/login?error=true')
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function resetPassword(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getURL()}/auth/callback?next=/dashboard/settings`,
    })

    if (error) {
        console.error(error)
        return { error: 'Erro ao enviar email de recuperação.' }
    }

    return { success: 'Email de recuperação enviado!' }
}

export async function signInWithGoogle() {
    const supabase = await createClient()
    const redirectUrl = `${getURL()}/auth/callback`
    console.log('>>> LOGIN INITIATED. Target Redirect:', redirectUrl);

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUrl,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    })

    if (data.url) {
        redirect(data.url)
    }
}
