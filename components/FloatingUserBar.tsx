'use client';

import React from 'react';
import { User } from '@supabase/supabase-js';
import { LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { signOut } from '../app/login/actions';

interface FloatingUserBarProps {
    user: User | null;
    profile: { full_name?: string } | null;
}

export default function FloatingUserBar({ user, profile }: FloatingUserBarProps) {
    if (!user) return null;

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md shadow-2xl border border-gray-200 rounded-full px-6 py-3 z-50 flex items-center gap-6 animate-slide-up">
            <div className="flex items-center gap-3 border-r border-gray-200 pr-6">
                <div className="w-8 h-8 bg-brand-brown text-white rounded-full flex items-center justify-center">
                    <UserIcon size={16} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-800 leading-none">
                        {profile?.full_name?.split(' ')[0] || 'Educador(a)'}
                    </span>
                    <span className="text-[10px] text-gray-500 leading-none mt-1">
                        Logado
                    </span>
                </div>
            </div>

            <button
                onClick={() => window.location.href = '/dashboard'}
                className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-brand-brown transition-colors"
                title="Ir para Dashboard"
            >
                <LayoutDashboard size={18} />
                <span className="hidden sm:inline">Dashboard</span>
            </button>

            <button
                onClick={() => signOut()}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Sair"
            >
                <LogOut size={18} />
            </button>
        </div>
    );
}
