---
title: Deploy Your Site
---

# Get Your Site Live!

Ready to show your creation to the world? Deploying a Flux site is super easy because it builds to plain old static files that work anywhere!

## Build Your Site

First, let's create the production version:

```bash
npm run build
```

This creates a `_site/` folder with all your optimized, ready-to-deploy files. That's it – your entire website in one neat folder!

## Deployment Options

Since Flux generates static files, you can deploy pretty much anywhere. Here are the popular choices:

### Netlify (Recommended for Beginners)

Super simple! Just:

1. Push your code to GitHub/GitLab
2. Connect your repo to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `_site`
5. Deploy!

Netlify handles everything – builds, deploys, even gives you a nice URL.

### Vercel (Great for React Devs)

Similar to Netlify:

1. Connect your GitHub repo
2. Vercel auto-detects it's a static site
3. Builds and deploys automatically
4. Boom! Live site.

### Cloudflare Pages (Fast & Global)

Lightning-fast global CDN:

1. Connect your Git repo
2. Build command: `npm run build`
3. Output directory: `_site`
4. Deploy worldwide instantly

### GitHub Pages (Free & Simple)

Perfect if your code's already on GitHub:

1. Enable GitHub Pages in your repo settings
2. Set it to deploy from a branch
3. Use GitHub Actions to build and deploy

### Your Own Server

Got your own server? Just copy the `_site/` folder contents to your web root:

```bash
# Build locally
npm run build

# Copy to your server (however you usually do it)
rsync -av _site/ user@yourserver.com:/var/www/html/
```

## Automated Deployments

Want automatic deployments when you push code? Most platforms support this out of the box:

**For Git-based deployments**, just push to your main branch and watch the magic happen!

**For manual deployments**, you can set up GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm install
      - run: npm run build
      - name: Deploy to your server
        # Add your deployment steps here
```

## Custom Domains

Most platforms make custom domains super easy:

1. Add your domain in the platform's settings
2. Update your DNS to point to their servers
3. Enable HTTPS (usually automatic)
4. You're live!

## Tips for a Smooth Deploy

**Check your links**: Make sure all internal links use relative paths or start with `/`

**Test locally first**: Run `npm run build && npm run preview` to test your production build

**Mind your assets**: Images and files in `public/` get copied as-is, while `assets/` get processed and hashed

**Environment matters**: Some features might work differently in production vs development

## Troubleshooting

**Site looks broken?** Check your asset paths – they might be different in production.

**404 errors?** Make sure your hosting platform is configured for Single Page Applications if needed.

**Build fails?** Check that all your dependencies are listed in `package.json`, not just installed locally.

## That's It!

Deploying with Flux is intentionally simple. Build once, deploy anywhere – that's the beauty of static sites!

Need help with a specific platform? The docs for Netlify, Vercel, and others are fantastic and usually have step-by-step guides for static sites.

Now go forth and ship!
