'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitContactForm(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const supabase = createClient();

  try {
    console.log('Submitting contact form:', { name: formData.name, email: formData.email });

    const { error } = await supabase
      .from('contact_submissions')
      .insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        read: false,
      });

    if (error) {
      console.error('Contact form database error:', error);
      return {
        success: false,
        error: `Fehler beim Senden: ${error.message}`,
      };
    }

    // Revalidate admin messages page
    revalidatePath('/admin/messages');

    console.log('Contact form submitted successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Unexpected contact form error:', error);
    return {
      success: false,
      error: `Unerwarteter Fehler: ${error?.message || 'Unbekannt'}`,
    };
  }
}
