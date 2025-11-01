/**
 * Environment Variable Validation
 *
 * This file validates that all required environment variables are set
 * and provides helpful error messages if they're missing.
 */

function getEnvVar(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n\n` +
      `Please ensure you have a .env.local file with all required variables.\n` +
      `See .env.example for reference.`
    );
  }

  return value;
}

function validateEnvVars() {
  // Validate Supabase configuration
  const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
  const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  // Validate URL format
  if (!supabaseUrl.startsWith('https://')) {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL must start with https://\n` +
      `Current value: ${supabaseUrl}`
    );
  }

  // Validate anon key format (should be a JWT)
  if (!supabaseAnonKey.startsWith('eyJ')) {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid.\n` +
      `It should be a JWT token starting with 'eyJ'`
    );
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  };
}

// Run validation
export const env = validateEnvVars();
