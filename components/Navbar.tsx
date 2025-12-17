'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Lightbulb, User as UserIcon } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface NavbarProps {
    user?: User | null;
}

export default function Navbar({ user }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 cursor-pointer">
                        <div className="relative h-10 w-12">
                            <Image
                                src="/logo.png"
                                alt="Educação com Evidências - Logo"
                                fill
                                className="object-contain object-left"
                                priority
                            />
                        </div>
                        <span className="text-lg font-bold text-brand-brown leading-tight hidden sm:block">
                            Educação com Evidências
                        </span>
                        <span className="text-lg font-bold text-brand-brown leading-tight sm:hidden">
                            EcE
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/"
                            className="font-medium text-brand-brown hover:opacity-80 transition-colors"
                        >
                            Página inicial
                        </Link>
                        <Link
                            href="/metodologia"
                            className="font-medium text-gray-500 hover:text-brand-brown transition-colors"
                        >
                            Método EcE
                        </Link>
                        <Link
                            href="/lab"
                            className="bg-brand-brown hover:bg-[#4E342E] text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md flex items-center gap-2"
                        >
                            <Lightbulb size={18} />
                            Acessar EcE.Lab
                        </Link>

                        <Link
                            href={user ? "/dashboard" : "/login"}
                            className="bg-white border-2 border-brand-brown text-brand-brown hover:bg-pink-50 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
                        >
                            <UserIcon size={18} />
                            {user ? 'Área Pessoal' : 'Entrar'}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-brand-brown">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-lg">
                    <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-left py-2 font-medium text-brand-brown"
                    >
                        Home
                    </Link>
                    <Link
                        href="/lab"
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-left py-2 font-medium text-brand-brown"
                    >
                        EcE Lab
                    </Link>
                    <Link
                        href={user ? "/dashboard" : "/login"}
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-left py-2 font-bold text-brand-brown border-t border-gray-50 mt-2 pt-4"
                    >
                        {user ? 'Minha Área Pessoal' : 'Login / Entrar'}
                    </Link>
                </div>
            )}
        </nav>
    );
}
