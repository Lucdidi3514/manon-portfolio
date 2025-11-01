import { createClient } from '@supabase/supabase-js';
import { Database } from './types';
import { env } from '@/lib/env';

export const supabase = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
