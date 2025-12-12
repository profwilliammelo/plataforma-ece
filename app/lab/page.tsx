import { createClient } from '@/utils/supabase/server';
import LabClient from './LabClient';

export const dynamic = 'force-dynamic';

export default async function LabPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    console.log('LabPage User Check:', user ? `User Found: ${user.email}` : 'No User Found');

    let profile = null;
    let favorites: string[] = [];

    if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        profile = data;

        const { data: favs } = await supabase.from('favorites').select('evidence_id').eq('user_id', user.id);
        if (favs) {
            favorites = favs.map(f => f.evidence_id);
        }
    }

    const { data: evidences } = await supabase
        .from('evidences')
        .select('*');

    // fallback para array vazio se der erro ou null
    return <LabClient initialEvidenceData={evidences} user={user} profile={profile} initialFavorites={favorites} />;
}
