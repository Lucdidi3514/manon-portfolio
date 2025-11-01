import { notFound } from 'next/navigation';
import { getCategoryById } from '@/lib/supabase/category-actions';
import { EditCategoryForm } from '@/components/admin/edit-category-form';

export const dynamic = 'force-dynamic';

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const category = await getCategoryById(params.id);

  if (!category) {
    notFound();
  }

  return <EditCategoryForm category={category} />;
}
