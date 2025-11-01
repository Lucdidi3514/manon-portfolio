# 🚀 Quick Start - Database Setup (15 minutes)

## Your Supabase Details

```
Project URL: https://oiyeelnxgefhocajqdfh.supabase.co
Project ID:  oiyeelnxgefhocajqdfh
Dashboard:   https://supabase.com/dashboard/project/oiyeelnxgefhocajqdfh
```

---

## ⚡ 5-Step Setup Process

### STEP 1: Open SQL Editor (1 minute)
```
1. Go to: https://supabase.com/dashboard/project/oiyeelnxgefhocajqdfh
2. Click "SQL Editor" in left sidebar
3. Click "+ New Query"
```

---

### STEP 2: Run 4 Migrations (5 minutes)

Copy and run each file in this order:

#### Migration 1: Create Tables
```
File: supabase/migrations/20251028191355_create_initial_schema.sql
Action: Copy entire file → Paste in SQL Editor → Click "Run"
Result: ✅ "Success. No rows returned"
```

#### Migration 2: Fix Security
```
File: supabase/migrations/20251029193942_fix_security_issues.sql
Action: New Query → Copy file → Paste → Run
Result: ✅ "Success. No rows returned"
```

#### Migration 3: Performance
```
File: supabase/migrations/20251030114756_fix_performance_and_security_issues.sql
Action: New Query → Copy file → Paste → Run
Result: ✅ "Success. No rows returned"
```

#### Migration 4: Documentation
```
File: supabase/migrations/20251030115412_document_indexes_and_password_policy.sql
Action: New Query → Copy file → Paste → Run
Result: ✅ "Success. No rows returned"
```

---

### STEP 3: Verify Tables (2 minutes)

```
1. Go to: Database → Tables
2. Check these exist:
   ☐ categories
   ☐ creations
   ☐ creation_images
   ☐ contact_submissions
```

---

### STEP 4: Create Admin User (3 minutes)

```
1. Go to: Authentication → Users
2. Click "Add user"
3. Fill in:
   Email: ________________
   Password: ________________
   ✓ Auto Confirm User
4. Click "Create user"
```

---

### STEP 5: Configure Auth URLs (2 minutes)

```
1. Go to: Authentication → URL Configuration
2. Site URL: http://localhost:3000
3. Redirect URLs:
   - http://localhost:3000/**
   - http://localhost:3000/admin/**
4. Save
```

---

## ✅ Test Your Setup

```bash
# In your terminal:
cd /Users/lucdidion/Desktop/Projets/Portfolio-Manon
npm run build
```

**Expected**: ✅ Build succeeds without database errors

```bash
# Start dev server:
npm run dev
```

**Test admin login**:
1. Go to: http://localhost:3000/admin
2. Should redirect to login
3. Enter your credentials
4. ✅ Should see admin dashboard

---

## 🎨 Optional: Storage Setup (5 minutes)

For image uploads:

```
1. Go to: Storage
2. Click "New bucket"
3. Name: creations
4. ✓ Public bucket
5. Create
```

Add policies in SQL Editor:

```sql
-- Public read
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'creations' );

-- Authenticated upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'creations' );

-- Authenticated delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'creations' );
```

---

## 🎯 You're Done When:

- [x] All 4 migrations run successfully
- [x] 4 tables visible in Database → Tables
- [x] Admin user created
- [x] Auth URLs configured
- [x] `npm run build` succeeds
- [x] Can login to admin dashboard
- [ ] Storage bucket created (optional)

---

## 🚨 Quick Troubleshooting

**Build fails with "table not found"**
→ Run migrations in SQL Editor

**Can't run migrations**
→ Make sure you're in the SQL Editor, not another tab

**Can't login**
→ Check email confirmed in Authentication → Users

**"Policy already exists" error**
→ It's OK, migrations handle this, click Run anyway

---

## 📚 Full Documentation

- Detailed setup: `DATABASE-SETUP-GUIDE.md`
- Admin setup: `ADMIN_SETUP.md`
- Deployment: `DEPLOYMENT.md`
- Full checklist: `PRE-DEPLOYMENT-CHECKLIST.md`

---

**Ready to add content? Go to http://localhost:3000/admin 🚀**
