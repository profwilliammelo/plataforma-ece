'use client';

import { User } from '@supabase/supabase-js';
import { signOut } from '../app/login/actions';
import { LogOut, User as UserIcon } from 'lucide-react';

interface UserHeaderProps {
    user: User;
    profile: { full_name?: string; acesso_bia?: boolean;[key: string]: unknown };
}

export default function UserHeader({ user, profile }: UserHeaderProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex flex-col text-right hidden md:block">
                <span className="text-sm font-bold text-gray-800">
                    {profile?.full_name || user.email?.split('@')[0]}
                </span>
                <span className="text-xs text-brand-brown">
                    {profile?.acesso_bia ? '⭐ Membro Premium' : 'Membro Gratuito'}
                </span>
                <button className="text-[10px] text-gray-500 hover:text-brand-brown underline mt-0.5" onClick={() => window.location.href = '/dashboard'}>
                    Acessar E-Vidente
                </button>
            </div>

            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-brand-brown border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform" onClick={() => window.location.href = '/dashboard'}>
                <UserIcon size={20} />
            </div>

            <button
                onClick={() => signOut()}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Sair"
            >
                <LogOut size={18} />
            </button>
        </div>
    );
}
