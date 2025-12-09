import { createClient } from '@/utils/supabase/server';
import LabClient from './LabClient';

export const dynamic = 'force-dynamic';

export default async function LabPage() {
    const supabase = await createClient();

    const { data: evidences } = await supabase
        .from('evidences')
        .select('*');

    // fallback para array vazio se der erro ou null
    return <LabClient initialEvidenceData={evidences} />;
}
