# Deployment Guide

This guide will walk you through deploying your Portfolio-Manon website to production.

## Prerequisites

Before deploying, ensure you have:

1. ✅ A Supabase project set up with all migrations applied
2. ✅ An admin user created in Supabase (see ADMIN_SETUP.md)
3. ✅ Your production domain ready
4. ✅ All environment variables configured

## Recommended Hosting: Vercel

Vercel is the recommended platform for deploying Next.js applications.

### Step 1: Prepare Your Repository

1. Commit all your changes to Git:
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   ```

2. Push to GitHub (or GitLab/Bitbucket):
   ```bash
   git remote add origin https://github.com/yourusername/portfolio-manon.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository
4. Configure your project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

### Step 3: Configure Environment Variables

In Vercel's project settings, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://oiyeelnxgefhocajqdfh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9peWVlbG54Z2VmaG9jYWpxZGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NTM1MDUsImV4cCI6MjA3NzQyOTUwNX0.kjF5jdAVmpVtesae3xjv4nm85XSIftrUYjK7OSUz04s
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

**Important**: Replace `NEXT_PUBLIC_SITE_URL` with your actual Vercel domain after deployment.

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 2-3 minutes)
3. Visit your deployed site at the provided URL

### Step 5: Configure Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Update `NEXT_PUBLIC_SITE_URL` environment variable with your custom domain
5. Redeploy to apply changes

## Alternative Hosting Options

### Option 2: Netlify

1. Go to [https://netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Add environment variables (same as Vercel)
6. Deploy

### Option 3: Self-Hosted (VPS/Cloud)

For self-hosting on a VPS or cloud provider:

```bash
# Install Node.js 18+ on your server
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone your repository
git clone https://github.com/yourusername/portfolio-manon.git
cd portfolio-manon

# Install dependencies
npm install

# Create .env.local file with your environment variables
nano .env.local

# Build the application
npm run build

# Install PM2 for process management
npm install -g pm2

# Start the application
pm2 start npm --name "portfolio-manon" -- start

# Configure PM2 to start on system boot
pm2 startup
pm2 save
```

Configure Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then set up SSL with Let's Encrypt:

```bash
sudo certbot --nginx -d yourdomain.com
```

## Post-Deployment Checklist

After deployment, verify:

- [ ] Homepage loads correctly
- [ ] All images display properly
- [ ] Admin login works
- [ ] Admin dashboard is accessible
- [ ] Categories page works
- [ ] Creations page works
- [ ] Individual creation pages work
- [ ] Contact form submits successfully
- [ ] Sitemap is accessible at `/sitemap.xml`
- [ ] Robots.txt is accessible at `/robots.txt`
- [ ] Favicon appears in browser tab
- [ ] Mobile responsiveness works
- [ ] 404 page displays correctly
- [ ] Error handling works

## Supabase Configuration

### Update Allowed Redirect URLs

In your Supabase dashboard:

1. Go to Authentication → URL Configuration
2. Add your production URL to "Allowed Redirect URLs":
   ```
   https://your-domain.com/**
   https://your-domain.com/admin/**
   ```

### Configure Storage Bucket (if using image uploads)

1. Go to Storage in Supabase dashboard
2. Create a bucket named `creations` (if not exists)
3. Set bucket to **public**
4. Configure CORS if needed

## Monitoring and Analytics (Recommended)

### Add Error Tracking

Consider adding Sentry for error tracking:

```bash
npm install @sentry/nextjs
```

### Add Analytics

Consider adding analytics:
- Google Analytics
- Plausible Analytics
- Vercel Analytics (built-in)

## Security Best Practices

1. **Keep dependencies updated**:
   ```bash
   npm audit
   npm audit fix
   ```

2. **Enable HTTPS** - Always use HTTPS in production

3. **Set up backups** for your Supabase database

4. **Monitor logs** regularly for suspicious activity

5. **Rate limit** your contact form (consider adding Cloudflare)

## Troubleshooting

### Build Fails

- Check that all environment variables are set
- Verify Node.js version is 18+
- Check build logs for specific errors

### Images Not Loading

- Verify Supabase storage bucket is public
- Check `next.config.js` image domains configuration
- Ensure images are uploaded to Supabase storage

### Admin Login Not Working

- Verify Supabase credentials are correct
- Check that redirect URLs are configured in Supabase
- Clear browser cookies and try again

### Database Connection Issues

- Verify Supabase project is active (not paused)
- Check environment variables are correct
- Test connection from Supabase dashboard

## Support

For issues or questions:
- Check Next.js documentation: https://nextjs.org/docs
- Check Supabase documentation: https://supabase.com/docs
- Vercel documentation: https://vercel.com/docs

## Performance Optimization

After deployment, use these tools to check performance:

- Lighthouse (Chrome DevTools)
- PageSpeed Insights: https://pagespeed.web.dev/
- WebPageTest: https://www.webpagetest.org/

Target metrics:
- Lighthouse Score: 90+
- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.8s
