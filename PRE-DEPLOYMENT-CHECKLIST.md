# Pre-Deployment Checklist

Complete these steps **before** deploying to production.

## ✅ Database Setup (CRITICAL)

The build errors you're seeing are because the Supabase database tables don't exist yet. You **MUST** complete these steps:

### 1. Apply Database Migrations

In your Supabase project dashboard:

1. Go to **SQL Editor**
2. Run each migration file in order:
   - `supabase/migrations/20251028191355_create_initial_schema.sql`
   - `supabase/migrations/20251029193942_fix_security_issues.sql`
   - `supabase/migrations/20251030114756_fix_performance_and_security_issues.sql`
   - `supabase/migrations/20251030115412_document_indexes_and_password_policy.sql`

OR use the Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref oiyeelnxgefhocajqdfh

# Push migrations
supabase db push
```

### 2. Create Admin User

Follow the instructions in `ADMIN_SETUP.md` to create your first admin user.

### 3. Verify Database Connection

Test that the database is accessible:

1. Go to Supabase Dashboard → Database → Tables
2. Verify these tables exist:
   - ✅ categories
   - ✅ creations
   - ✅ creation_images
   - ✅ contact_submissions

## ✅ Environment Variables

Ensure all environment variables are set:

### Local Development (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://oiyeelnxgefhocajqdfh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (Hosting Platform)
```
NEXT_PUBLIC_SUPABASE_URL=https://oiyeelnxgefhocajqdfh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
```

## ✅ Supabase Configuration

### Configure Authentication URLs

In Supabase Dashboard → Authentication → URL Configuration:

1. **Site URL**: `https://your-production-domain.com`
2. **Redirect URLs**: Add these:
   ```
   http://localhost:3000/**
   https://your-production-domain.com/**
   ```

### Configure Storage (for image uploads)

1. Go to Storage → Create bucket → Name it `creations`
2. Make bucket **public**
3. Add this storage policy:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'creations' );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'creations' );

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'creations' );
```

## ✅ Code Quality Checks

Run these commands to verify everything is ready:

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Run type checking
npm run typecheck

# Test build (will show database errors until DB is set up)
npm run build
```

Expected results:
- ✅ ESLint: No errors
- ✅ TypeScript: No errors
- ⚠️ Build: May show database errors until migrations are run

## ✅ Content Preparation

Before launch, you should have:

1. **Categories created** - At least 2-3 categories for your creations
2. **Some creations added** - At least 3-5 example creations
3. **Images uploaded** - Professional photos of your work
4. **About page content** - Edit `app/about/page.tsx` with your story

## ✅ Testing Checklist

Test these features locally before deploying:

- [ ] Homepage loads with featured creation
- [ ] Categories display correctly
- [ ] Creations gallery shows all items
- [ ] Individual creation pages work
- [ ] Contact form submits successfully
- [ ] Admin login works
- [ ] Admin can create categories
- [ ] Admin can create creations
- [ ] Admin can upload images
- [ ] Admin can view messages
- [ ] Mobile responsive design works
- [ ] All links work correctly

## ✅ Security Checklist

- [x] Environment variables are not committed to Git
- [x] `.env.local` is in `.gitignore`
- [x] Image hostnames restricted in `next.config.js`
- [x] Row Level Security (RLS) enabled on all tables
- [x] Admin routes protected by middleware
- [ ] SSL/HTTPS enabled (handled by hosting platform)

## ✅ SEO Checklist

- [x] Favicon added
- [x] Meta descriptions set
- [x] Sitemap.xml generated
- [x] Robots.txt configured
- [ ] Update domain in `NEXT_PUBLIC_SITE_URL`
- [ ] Submit sitemap to Google Search Console (after deployment)

## 🚀 Ready to Deploy?

If you've completed all items above:

1. Read `DEPLOYMENT.md` for deployment instructions
2. Choose your hosting platform (Vercel recommended)
3. Deploy and test
4. Update DNS if using custom domain
5. Submit sitemap to search engines

## ⚠️ Common Issues

### Build fails with "table not found"
- **Solution**: Run database migrations in Supabase

### "No environment variables" error
- **Solution**: Create `.env.local` file with all required variables

### Images not loading
- **Solution**: Set up Supabase Storage bucket and make it public

### Can't log in to admin
- **Solution**: Create admin user following ADMIN_SETUP.md

### 404 on all pages after deployment
- **Solution**: Ensure hosting platform is configured for Next.js (not static export)

## Need Help?

- Review `ADMIN_SETUP.md` for admin setup
- Review `DEPLOYMENT.md` for deployment steps
- Check Supabase logs in dashboard
- Check Vercel/Netlify deployment logs
- Ensure all migrations are applied
