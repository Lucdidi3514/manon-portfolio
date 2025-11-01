# Complete Supabase Database Setup Guide

Follow these steps to set up your database for the Portfolio-Manon project.

---

## 🎯 Overview

You need to run **4 migration files** in your Supabase database. These migrations will:
1. ✅ Create all necessary tables (categories, creations, creation_images, contact_submissions)
2. ✅ Set up Row Level Security (RLS) policies
3. ✅ Create performance indexes
4. ✅ Configure triggers and functions

**Time Required**: 10-15 minutes

---

## 📋 Prerequisites

- ✅ Supabase project created: `oiyeelnxgefhocajqdfh`
- ✅ Access to Supabase dashboard
- ✅ Project URL: `https://oiyeelnxgefhocajqdfh.supabase.co`

---

## 🚀 Step-by-Step Instructions

### Step 1: Access Supabase SQL Editor

1. Go to: **https://supabase.com/dashboard**
2. Sign in to your account
3. Select your project: **`oiyeelnxgefhocajqdfh`**
4. In the left sidebar, click **SQL Editor**

### Step 2: Run Migration 1 - Create Initial Schema

This creates all the tables and basic security policies.

1. In the SQL Editor, click **"+ New Query"**
2. Copy the **entire contents** of this file:
   ```
   supabase/migrations/20251028191355_create_initial_schema.sql
   ```
3. Paste into the SQL Editor
4. Click **"Run"** (or press Cmd/Ctrl + Enter)
5. ✅ You should see: **"Success. No rows returned"**

**What this creates:**
- ✅ `categories` table
- ✅ `creations` table
- ✅ `creation_images` table
- ✅ `contact_submissions` table
- ✅ Basic RLS policies
- ✅ Initial indexes
- ✅ Updated_at triggers

### Step 3: Run Migration 2 - Fix Security Issues

This optimizes the security policies and removes redundant indexes.

1. Click **"+ New Query"** for a new query tab
2. Copy the **entire contents** of this file:
   ```
   supabase/migrations/20251029193942_fix_security_issues.sql
   ```
3. Paste into the SQL Editor
4. Click **"Run"**
5. ✅ You should see: **"Success. No rows returned"**

**What this does:**
- ✅ Consolidates RLS policies
- ✅ Removes unused indexes
- ✅ Hardens function security

### Step 4: Run Migration 3 - Performance Optimization

This re-adds critical indexes and optimizes query performance.

1. Click **"+ New Query"** for a new query tab
2. Copy the **entire contents** of this file:
   ```
   supabase/migrations/20251030114756_fix_performance_and_security_issues.sql
   ```
3. Paste into the SQL Editor
4. Click **"Run"**
5. ✅ You should see: **"Success. No rows returned"**

**What this does:**
- ✅ Adds foreign key indexes
- ✅ Optimizes RLS policy performance

### Step 5: Run Migration 4 - Documentation

This adds documentation comments to the indexes.

1. Click **"+ New Query"** for a new query tab
2. Copy the **entire contents** of this file:
   ```
   supabase/migrations/20251030115412_document_indexes_and_password_policy.sql
   ```
3. Paste into the SQL Editor
4. Click **"Run"**
5. ✅ You should see: **"Success. No rows returned"**

**What this does:**
- ✅ Documents index purposes
- ✅ Verifies indexes exist

---

## ✅ Verify Setup

After running all migrations, verify everything is set up correctly:

### Check 1: Verify Tables Exist

1. In Supabase Dashboard, go to **Database** → **Tables**
2. You should see these 4 tables:
   - ✅ `categories`
   - ✅ `creations`
   - ✅ `creation_images`
   - ✅ `contact_submissions`

### Check 2: View Table Structure

Click on each table to see its columns:

**categories:**
- id, name, slug, description, image_url, display_order, created_at, updated_at

**creations:**
- id, title, slug, category_id, description, materials, sizes, colors, featured, status, created_at, updated_at, published_at

**creation_images:**
- id, creation_id, url, alt_text, is_primary, display_order, created_at

**contact_submissions:**
- id, name, email, subject, message, created_at, read

### Check 3: Verify RLS is Enabled

1. Click on any table
2. Look for **"RLS enabled"** badge at the top
3. All 4 tables should have RLS enabled ✅

### Check 4: Test Database Connection

Run this test query in SQL Editor:

```sql
-- This should return 0 (empty tables)
SELECT
  (SELECT COUNT(*) FROM categories) as categories_count,
  (SELECT COUNT(*) FROM creations) as creations_count,
  (SELECT COUNT(*) FROM creation_images) as images_count,
  (SELECT COUNT(*) FROM contact_submissions) as messages_count;
```

Expected result:
```
categories_count | creations_count | images_count | messages_count
-----------------|-----------------|--------------|----------------
       0         |        0        |      0       |       0
```

---

## 🎨 Optional: Set Up Storage for Images

Your creations will need images. Set up Supabase Storage:

### Step 1: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click **"New bucket"**
3. Bucket name: **`creations`**
4. Check **"Public bucket"** ✅
5. Click **"Create bucket"**

### Step 2: Set Up Storage Policies

1. Click on the **`creations`** bucket
2. Go to **"Policies"** tab
3. Click **"New policy"**
4. Add these policies:

**Policy 1: Public Read Access**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'creations' );
```

**Policy 2: Authenticated Upload**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'creations' );
```

**Policy 3: Authenticated Delete**
```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'creations' );
```

---

## 🔐 Configure Authentication (Important!)

### Step 1: Set Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your domain (or `http://localhost:3000` for now)
3. Add **Redirect URLs**:
   ```
   http://localhost:3000/**
   http://localhost:3000/admin/**
   ```

### Step 2: Create Admin User

You need an admin user to access `/admin`. Follow one of these methods:

**Method 1: Via Supabase Dashboard (Easiest)**

1. Go to **Authentication** → **Users**
2. Click **"Add user"** or **"Invite user"**
3. Enter:
   - **Email**: your-email@example.com
   - **Password**: Your secure password (min 6 characters)
   - ✅ Check **"Auto Confirm User"**
4. Click **"Create user"**

**Method 2: Via SQL Editor**

```sql
-- Replace with your email and password
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
  'your-email@example.com',  -- ⚠️ CHANGE THIS
  crypt('your-password-here', gen_salt('bf')),  -- ⚠️ CHANGE THIS
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  FALSE,
  ''
);
```

---

## 🧪 Test Your Setup

### Test 1: Build Your App

```bash
cd /Users/lucdidion/Desktop/Projets/Portfolio-Manon
npm run build
```

✅ Should now build successfully without database errors!

### Test 2: Start Development Server

```bash
npm run dev
```

Then visit:
- `http://localhost:3000` - Homepage (should load)
- `http://localhost:3000/admin` - Should redirect to login
- `http://localhost:3000/admin/login` - Login page

### Test 3: Admin Login

1. Go to `http://localhost:3000/admin/login`
2. Enter your admin credentials
3. ✅ Should log in and see admin dashboard

---

## 🎉 Success Checklist

After completing all steps, you should have:

- [x] All 4 migrations run successfully
- [x] 4 tables created (categories, creations, creation_images, contact_submissions)
- [x] RLS enabled on all tables
- [x] Storage bucket created (optional but recommended)
- [x] Admin user created
- [x] Authentication URLs configured
- [x] App builds without errors
- [x] Can access admin dashboard

---

## ❌ Troubleshooting

### Error: "Table already exists"

**Cause**: Migration was run multiple times
**Solution**:
```sql
-- Drop all tables and start over
DROP TABLE IF EXISTS creation_images CASCADE;
DROP TABLE IF EXISTS creations CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS contact_submissions CASCADE;

-- Then re-run Migration 1
```

### Error: "Policy already exists"

**Cause**: Policy was created multiple times
**Solution**: The migrations use `IF EXISTS` so this shouldn't happen. If it does:
```sql
-- View all policies
SELECT * FROM pg_policies WHERE tablename IN ('categories', 'creations', 'creation_images', 'contact_submissions');

-- Drop specific policy
DROP POLICY "policy_name" ON table_name;
```

### Error: "Function does not exist"

**Cause**: Migration 1 wasn't run
**Solution**: Make sure to run migrations in order (1 → 2 → 3 → 4)

### Build still shows database errors

**Cause**:
1. Migrations not run
2. Wrong Supabase credentials in `.env.local`

**Solution**:
1. Verify tables exist in Supabase Dashboard
2. Check `.env.local` has correct credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://oiyeelnxgefhocajqdfh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```

### Can't login to admin

**Cause**: Admin user not created or wrong credentials
**Solution**:
1. Check user exists in Authentication → Users
2. Verify email is confirmed
3. Try password reset if needed

---

## 📚 Next Steps

After database setup is complete:

1. ✅ **Add some content**:
   - Go to `http://localhost:3000/admin/categories` and create 2-3 categories
   - Go to `http://localhost:3000/admin/creations` and add some creations
   - Upload images for your creations

2. ✅ **Test the public site**:
   - Visit `http://localhost:3000` to see your creations
   - Test the contact form
   - Navigate through categories

3. ✅ **Deploy to production**:
   - Follow `DEPLOYMENT.md` for deployment instructions

---

## 🆘 Need Help?

If you encounter issues:

1. Check the Supabase logs in Dashboard → Logs
2. Check browser console for errors (F12)
3. Verify environment variables are correct
4. Review `PRE-DEPLOYMENT-CHECKLIST.md`

---

**Database setup complete? Great! You're ready to deploy! 🚀**
