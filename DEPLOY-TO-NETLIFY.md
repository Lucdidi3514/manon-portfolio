# 🚀 Deploy Portfolio-Manon to Netlify

## ✅ Is Your Project Ready?

Let's check if you're ready to deploy:

### Quick Readiness Check:

```
☐ Database migrations run in Supabase? (Check: Database → Tables exist)
☐ Admin user created? (Check: Can login to /admin)
☐ At least 1 test creation added? (Recommended)
☐ Environment variables in .env.local? (Check file exists)
☐ Code saved and ready?
```

**All checked?** You're ready to deploy! 🎉

**Missing some?** That's okay! You can:
1. Deploy first (get your live URL)
2. Add content later via admin panel
3. No pressure!

---

## 📋 Pre-Deployment Checklist (Optional but Recommended)

### Add Some Test Content (10 minutes)

Having content makes your site look better at launch:

```
☐ Create 2-3 categories (e.g., Taschen, Kleidung, Accessoires)
☐ Add 2-3 test creations with images
☐ Test contact form works
☐ Check everything looks good
```

**Skip this?** No problem! You can add content after deployment via your admin panel.

---

## 🎯 Step-by-Step Deployment Guide

### Step 1: Initialize Git Repository (5 minutes)

Your project needs to be in a Git repository. Let's check:

```bash
cd /Users/lucdidion/Desktop/Projets/Portfolio-Manon

# Check if Git is already initialized
git status
```

**If you see "not a git repository"**, initialize Git:

```bash
# Initialize Git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Portfolio ready for deployment"
```

**If Git is already initialized**, just commit your latest changes:

```bash
git add .
git commit -m "Add carousel feature and prepare for deployment"
```

---

### Step 2: Create GitHub Repository (5 minutes)

Netlify works best with GitHub. Let's create a repository:

1. **Go to:** https://github.com/new
2. **Repository name:** `portfolio-manon` (or your choice)
3. **Privacy:** Choose Public or Private (your choice)
4. **DON'T** check "Initialize with README" (you already have files)
5. **Click:** "Create repository"

You'll see a page with instructions. **Use these commands:**

```bash
# Add GitHub as remote (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/portfolio-manon.git

# Push your code
git branch -M main
git push -u origin main
```

**✅ Done!** Your code is now on GitHub.

---

### Step 3: Connect Netlify to GitHub (5 minutes)

1. **Go to:** https://app.netlify.com/
2. **Sign up/Login** (use GitHub account for easier setup)
3. **Click:** "Add new site" → "Import an existing project"
4. **Click:** "Deploy with GitHub"
5. **Authorize** Netlify to access your GitHub
6. **Search** for "portfolio-manon"
7. **Click** on your repository

---

### Step 4: Configure Build Settings (2 minutes)

Netlify should auto-detect Next.js settings, but verify:

**Build settings:**
```
Build command:    npm run build
Publish directory: .next
```

**✅ These should be auto-filled.** If not, enter them manually.

**DON'T CLICK DEPLOY YET!** We need to add environment variables first.

---

### Step 5: Add Environment Variables (3 minutes) ⚠️ IMPORTANT

**Click:** "Add environment variables" or "Advanced build settings"

Add these 3 variables:

```
Variable 1:
Name:  NEXT_PUBLIC_SUPABASE_URL
Value: https://oiyeelnxgefhocajqdfh.supabase.co

Variable 2:
Name:  NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9peWVlbG54Z2VmaG9jYWpxZGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NTM1MDUsImV4cCI6MjA3NzQyOTUwNX0.kjF5jdAVmpVtesae3xjv4nm85XSIftrUYjK7OSUz04s

Variable 3:
Name:  NEXT_PUBLIC_SITE_URL
Value: (Leave empty for now - we'll update this after deployment)
```

**✅ Variables added?** Great! Now you can deploy.

---

### Step 6: Deploy! (2 minutes)

**Click:** "Deploy [your-site-name]"

**Wait for build** (usually 2-3 minutes):
- ⏳ Building...
- ⏳ Deploying...
- ✅ Published!

**You'll see a URL like:** `https://your-site-name.netlify.app`

**🎉 Your site is LIVE!**

---

### Step 7: Update Site URL (2 minutes)

Now that you have your Netlify URL, let's update it:

1. **In Netlify:** Site settings → Environment variables
2. **Edit** `NEXT_PUBLIC_SITE_URL`
3. **Set to:** `https://your-actual-url.netlify.app`
4. **Click:** "Trigger deploy" to rebuild with new URL

---

### Step 8: Configure Supabase Auth (3 minutes) ⚠️ CRITICAL

Your admin login won't work until you do this:

1. **Go to:** https://supabase.com/dashboard/project/oiyeelnxgefhocajqdfh
2. **Click:** Authentication → URL Configuration
3. **Site URL:** Set to `https://your-site-name.netlify.app`
4. **Redirect URLs:** Add these:
   ```
   https://your-site-name.netlify.app/**
   https://your-site-name.netlify.app/admin/**
   https://your-site-name.netlify.app/auth/callback
   ```
5. **Click:** Save

**✅ Done!** Admin login will now work.

---

## 🧪 Test Your Live Site

### Test Checklist:

```
☐ 1. Visit: https://your-site-name.netlify.app
     → Homepage loads ✅

☐ 2. Visit: /admin
     → Redirects to /admin/login ✅

☐ 3. Login with your admin credentials
     → Successfully logs in ✅
     → See admin dashboard ✅

☐ 4. Create a test creation with images
     → Can upload and save ✅

☐ 5. View creation on public site
     → Carousel works ✅
     → Images load ✅

☐ 6. Test contact form
     → Can submit message ✅
     → See in admin messages ✅
```

---

## 🎨 Customize Your URL (Optional)

### Option A: Use Netlify Subdomain (Free)

1. **Netlify Dashboard → Site settings → Domain management**
2. **Click:** "Options" → "Edit site name"
3. **Change to:** `portfolio-manon.netlify.app` or your choice
4. **Save**

### Option B: Add Custom Domain (Your Own Domain)

If you own a domain (e.g., `manon-atelier.com`):

1. **Netlify Dashboard → Domain management**
2. **Click:** "Add custom domain"
3. **Enter your domain**
4. **Follow DNS setup instructions**
5. **Netlify adds free SSL automatically!**

---

## 🔄 Future Updates

### How to Update Your Live Site:

Whenever you make changes:

```bash
# Make your changes in code
# ...

# Save and commit
git add .
git commit -m "Description of your changes"
git push

# Netlify automatically rebuilds!
# Wait 2-3 minutes
# Changes are live! ✅
```

**That's it!** Netlify auto-deploys on every push to main branch.

---

## ⚙️ Optional: Custom Domain + SSL

### If You Want a Custom Domain:

**Already have a domain?** (e.g., from Namecheap, GoDaddy, etc.)

1. **In Netlify:** Domain management → Add domain
2. **Add:** `yourdomain.com`
3. **Update DNS** at your domain registrar:
   - Add CNAME record
   - Point to your Netlify URL
4. **Wait** for DNS propagation (up to 24 hours)
5. **Netlify automatically adds free SSL!**

**Don't have a domain yet?**
- Continue using `your-site.netlify.app` (totally fine!)
- Buy one later when ready

---

## 📊 Post-Deployment

### What to Do After Deployment:

1. **Add Real Content:**
   ```
   → Login to your-site.netlify.app/admin
   → Create real categories
   → Add your handmade creations
   → Upload actual photos
   ```

2. **Share Your Site:**
   ```
   → Share URL with friends/family
   → Add to social media bios
   → Use for your business
   ```

3. **Monitor Traffic:**
   ```
   → Netlify Dashboard → Analytics (free basic stats)
   → Or add Google Analytics later
   ```

4. **SEO (Later):**
   ```
   → Submit sitemap: https://your-site.netlify.app/sitemap.xml
   → To: Google Search Console
   → To: Bing Webmaster Tools
   ```

---

## 🐛 Troubleshooting

### Build Fails on Netlify

**Check:**
1. Netlify build log for errors
2. Environment variables are set
3. Node version (Netlify uses Node 18+ by default)

**Solution:**
- Check build log in Netlify dashboard
- Ensure all env variables added correctly
- Try deploying again

### Admin Login Doesn't Work

**Problem:** Redirects but can't login
**Solution:**
1. Check Supabase redirect URLs include your Netlify URL
2. Verify environment variables in Netlify
3. Clear browser cache

### Images Don't Load

**Problem:** Carousel shows but images broken
**Solution:**
1. Check image URLs are valid
2. Verify `next.config.js` has correct image domains
3. Make sure images are from HTTPS sources

### 404 on All Pages

**Problem:** Only homepage works, other pages 404
**Solution:**
- This shouldn't happen with Netlify auto-config
- Check "Publish directory" is `.next` not `out`
- Ensure `next.config.js` doesn't have `output: 'export'`

---

## 💰 Costs

### Netlify Free Tier Includes:

- ✅ 100 GB bandwidth/month (plenty for portfolio)
- ✅ 300 build minutes/month
- ✅ Continuous deployment
- ✅ Free SSL certificate
- ✅ Custom domain support
- ✅ Form submissions (100/month)

**Perfect for your portfolio!** You won't need to upgrade.

### Supabase Free Tier Includes:

- ✅ 500 MB database
- ✅ 1 GB file storage
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests

**Also perfect!** More than enough for a portfolio.

**Total Cost: $0/month** 🎉

---

## 🎯 Quick Reference

### Your URLs:

```
Live Site:     https://your-site-name.netlify.app
Admin Panel:   https://your-site-name.netlify.app/admin
Netlify Dash:  https://app.netlify.com/
Supabase Dash: https://supabase.com/dashboard/project/oiyeelnxgefhocajqdfh
GitHub Repo:   https://github.com/YOUR-USERNAME/portfolio-manon
```

### Important Files:

```
Local:  /Users/lucdidion/Desktop/Projets/Portfolio-Manon/.env.local
Docs:   DEPLOY-TO-NETLIFY.md (this file)
        DEPLOYMENT.md (alternative platforms)
        NEW-FEATURES.md (carousel guide)
```

---

## ✅ Deployment Summary

**Time Required:** 20-30 minutes total

**Steps:**
1. ✅ Initialize Git (5 min)
2. ✅ Create GitHub repo (5 min)
3. ✅ Connect Netlify (5 min)
4. ✅ Configure build settings (2 min)
5. ✅ Add environment variables (3 min)
6. ✅ Deploy (2 min)
7. ✅ Update site URL (2 min)
8. ✅ Configure Supabase auth (3 min)

**Result:** Professional portfolio live on the web! 🚀

---

## 🆘 Need Help?

**Common Questions:**

**Q: Can I deploy without adding content first?**
A: Yes! Deploy now, add content later via admin panel.

**Q: Will my local site still work?**
A: Yes! Local dev continues to work normally.

**Q: How do I update my live site?**
A: Just `git push` - Netlify auto-deploys.

**Q: Can I undo a deployment?**
A: Yes! Netlify keeps all versions, can rollback anytime.

**Q: What if I mess something up?**
A: No worries! Just redeploy or rollback in Netlify dashboard.

---

## 🎉 Ready to Deploy?

**You have everything you need!**

Start with **Step 1** above and follow through.

In ~30 minutes, your portfolio will be live on the web! 🌐

**Good luck! You've got this!** 💪

---

**Questions during deployment? Having issues? Just ask - I'm here to help!** 😊
