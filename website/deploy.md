---
title: Deploy Your Site
---

Deploy your Flux site to any platform that hosts static files.

## Build Your Site

Create the production build:

```bash
npm run build
```

This generates a `_site/` folder containing your optimized website files.

## Deployment Platforms

### Netlify

1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `_site`
5. Deploy

Netlify handles builds and deployments automatically.

### Vercel

1. Connect your GitHub repository
2. Vercel detects the static site configuration
3. Builds and deploys on each commit

### Cloudflare Pages

1. Connect your Git repository
2. Build command: `npm run build`
3. Output directory: `_site`
4. Deploy to global CDN

### GitHub Pages

1. Enable GitHub Pages in repository settings
2. Choose deployment source (branch or GitHub Actions)
3. Configure build workflow if using GitHub Actions

### Your Own Server

Copy the `_site/` folder to your web server:

```bash
npm run build
rsync -av _site/ user@yourserver.com:/var/www/html/
```

## Automated Deployments

Most platforms deploy automatically when you push to your main branch.

For custom deployment workflows, use GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy Site
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
      # Add deployment steps
```

## Custom Domains

1. Configure custom domain in platform settings
2. Update DNS records to point to hosting provider
3. Enable HTTPS (usually automatic)

## Testing Before Deployment

Test your production build locally:

```bash
npm run build
npm run preview
```

This serves your built site locally to catch issues before deployment.

## Troubleshooting

**Broken assets**: Check that asset paths are correct and files exist in the build output.

**404 errors**: Verify routing configuration and that all pages are properly built.

**Build failures**: Ensure all dependencies are in `package.json` and the build runs locally.

## Summary

Flux generates static files that deploy anywhere. Choose a platform, configure the build settings, and deploy your site.
