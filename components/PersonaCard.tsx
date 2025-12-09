import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PersonaCardProps {
    icon: LucideIcon;
    title: string;
    desc: string;
    color: string;
}

export default function PersonaCard({ icon: Icon, title, desc, color }: PersonaCardProps) {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-pink-200 transition-all cursor-pointer group">
            <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="text-white h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Sou {title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}
