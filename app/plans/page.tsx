import PricingSection from '@/components/PricingSection';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-100 py-4 px-6 fixed w-full z-10 top-0">
                <div className="max-w-7xl mx-auto flex items-center">
                    <Link href="/dashboard" className="text-gray-500 hover:text-brand-brown flex items-center gap-2 text-sm font-medium">
                        <ArrowLeft size={18} /> Voltar para o Dashboard
                    </Link>
                </div>
            </div>

            <div className="pt-20">
                <PricingSection />
            </div>
        </div>
    );
}
