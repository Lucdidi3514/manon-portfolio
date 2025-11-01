import { notFound } from 'next/navigation';
import { getCreationById } from '@/lib/supabase/admin-actions';
import { EditCreationForm } from '@/components/admin/edit-creation-form';

export const dynamic = 'force-dynamic';

interface EditCreationPageProps {
  params: {
    id: string;
  };
}

export default async function EditCreationPage({ params }: EditCreationPageProps) {
  const creation = await getCreationById(params.id);

  if (!creation) {
    notFound();
  }

  return <EditCreationForm creation={creation} />;
}
