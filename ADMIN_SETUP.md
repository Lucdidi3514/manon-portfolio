# Admin Dashboard Setup Guide

The admin dashboard is now fully functional and accessible at `/admin`. However, you need to create an admin user first before you can log in.

## Creating Your First Admin User

You have two options to create an admin user:

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard at https://supabase.com/dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add User** (or **Invite User**)
4. Enter:
   - Email: Your admin email address
   - Password: A secure password (minimum 6 characters)
   - Check "Auto Confirm User" if available
5. Click **Create User**

### Option 2: Via SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run this SQL query (replace with your credentials):

```sql
-- Create a new user in the auth.users table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@example.com', -- Replace with your email
  crypt('your-password-here', gen_salt('bf')), -- Replace with your password
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  FALSE,
  ''
);
```

**Note:** The SQL method requires the `pgcrypto` extension to be enabled in your Supabase database.

## Accessing the Admin Dashboard

1. Start your development server: `npm run dev`
2. Navigate to http://localhost:3000/admin
3. You'll be redirected to the login page at http://localhost:3000/admin/login
4. Enter your admin credentials (email and password)
5. Click **Anmelden** (Sign In)

## Admin Dashboard Features

Once logged in, you'll have access to:

- **Übersicht (Overview)**: Dashboard with statistics and recent creations
- **Kreationen (Creations)**: Manage your handmade creations
  - View all creations
  - Create new creations
  - Edit existing creations
  - Publish or keep as drafts
- **Kategorien (Categories)**: Organize your creations into categories
- **Nachrichten (Messages)**: View contact form submissions from your website

## Security

- All admin routes are protected by middleware
- Authentication is handled server-side using cookies
- Row Level Security (RLS) is enabled on all database tables
- Only authenticated users can access admin features
- Unauthenticated users are automatically redirected to the login page

## Troubleshooting

### Cannot Log In

- Ensure your user email is confirmed in Supabase
- Check that the password is correct (minimum 6 characters)
- Verify that your `.env` file has the correct Supabase credentials

### Admin Pages Not Loading

- Clear your browser cookies and try again
- Check the browser console for any errors
- Ensure the database connection is working

### Database Connection Issues

- Verify your `NEXT_PUBLIC_SUPABASE_URL` in the `.env` file
- Verify your `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the `.env` file
- Check that your Supabase project is active and not paused

## Next Steps

After setting up your admin user:

1. Log in to the admin dashboard
2. Create some categories for your creations
3. Add your first creation
4. Test the contact form on your public website
5. View messages in the admin dashboard
