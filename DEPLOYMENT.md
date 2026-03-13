# PoshPendant - Cloudflare Pages Deployment Guide

## 🚀 Deploy Enhanced Version to Cloudflare

### Prerequisites
- Cloudflare account (free tier works)
- Wrangler CLI installed (`npm install -g wrangler`)
- Git repository (optional)

### Deployment Steps

#### Option 1: Direct Upload to Cloudflare Pages

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Cloudflare Pages
wrangler pages deploy . --project-name=poshpendant
```

#### Option 2: Git-based Deployment (Recommended)

1. **Push to GitHub/GitLab**
```bash
git init
git add .
git commit -m "PoshPendant Enhanced v2.0"
git remote add origin https://github.com/yourusername/poshpendant
git push -u origin main
```

2. **Connect to Cloudflare Pages**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Select "Pages" → "Create a project"
   - Connect your Git repository
   - Set build settings:
     - Framework: None
     - Build command: `npm run build` (optional)
     - Build output directory: `.`
   - Deploy!

#### Option 3: Via Cloudflare CLI (Fastest)

```bash
npm install
wrangler pages dev .          # Test locally
wrangler pages deploy .       # Deploy to production
```

### Configuration

#### Set Your Domain
```bash
# Update CNAME in DNS
wrangler pages project create poshpendant

# or link existing domain
wrangler pages project create --production-branch main
```

#### Environment Variables
Create a `.env.production` file:
```
STRIPE_KEY=sk_live_xxxxx
ANALYTICS_TOKEN=xxxxx
CLOUDFLARE_ZONE_ID=xxxxx
```

### Features Enabled After Deploy

✅ **Cloudflare Security**
- DDoS protection
- WAF rules
- SSL/TLS encryption (automatic)

✅ **Performance**
- Global CDN (200+ data centers)
- Automatic minification
- Image optimization
- Cache rules applied

✅ **Analytics**
- Cloudflare Analytics Engine
- Real-time analytics
- Performance metrics
- Traffic insights

✅ **SEO Optimizations**
- robots.txt configured
- sitemap.xml included
- Canonical URLs set
- Structured data ready

### Post-Deployment Checklist

- [ ] Test on desktop & mobile
- [ ] Verify all links work
- [ ] Check Lighthouse score (`npm run test:lighthouse`)
- [ ] Test checkout flow
- [ ] Verify analytics tracking
- [ ] Check SSL certificate
- [ ] Setup DNS records
- [ ] Configure email notifications

### Monitor Performance

```bash
# View real-time analytics
wrangler analytics-engine tail

# Check deployment status
wrangler pages project list
```

### Rollback (if needed)

```bash
# View deployment history
wrangler pages deployment list --project-name=poshpendant

# Rollback to previous version
wrangler pages deployment rollback --project-name=poshpendant
```

### Custom Domain Setup

1. Update CNAME in DNS:
   ```
   poshpendant.yourdomain.com  CNAME  poshpendant.pages.dev
   ```

2. In Cloudflare dashboard:
   - Add domain under Pages settings
   - Wait for DNS propagation (5-10 min)

3. Enable Cloudflare nameservers:
   ```
   DNS → Nameservers → Use Cloudflare nameservers
   ```

### Troubleshooting

**Issue: Pages won't build**
- Check build command in `wrangler.toml`
- Ensure no `node_modules/.gitignore` blocks files

**Issue: Redirects not working**
- Verify `_redirects` file format
- Check rule ordering (first match wins)

**Issue: Analytics not showing**
- Confirm JavaScript loaded (`shared.js`)
- Check browser console for errors
- Verify Cloudflare Analytics enabled

### Support & Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Web Analytics Setup](https://support.cloudflare.com/hc/en-us/articles/4407730304521)

---

**Status:** Ready to deploy ✅
**Version:** 2.0 Enhanced
**Last Updated:** 2026-03-13
