# Deploying Mixable Waitlist to Netlify

This guide walks you through deploying the Mixable waitlist page to Netlify.

## Important Note About TanStack Start

**TanStack Start is an SSR framework designed for Cloudflare Workers.** It requires a server runtime and doesn't generate static HTML files by default like frameworks such as Next.js or Gatsby.

### Recommended Deployment Options (in order of preference):

1. **Cloudflare Workers (Recommended)** - Use the existing `npm run deploy` command
2. **Netlify with Netlify Functions** - Requires custom configuration (explained below)
3. **Static Deployment** - Requires creating a custom index.html (simplest but limited)

This guide focuses on **Option 3** (static deployment) which works well for the waitlist page since it's primarily client-side with Supabase handling the backend.

## Prerequisites

- A Netlify account (free tier works fine)
- GitHub/GitLab/Bitbucket repository with your code pushed
- Supabase project already set up (see `SUPABASE_SETUP.md`)

## For Quick Static Deployment

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "Add new site" > "Import an existing project"
   - Connect your Git provider (GitHub, GitLab, or Bitbucket)
   - Select the `lovable-clone` repository

2. **Configure Build Settings**

   Netlify should auto-detect the configuration from `netlify.toml`, but verify:

   - **Build command**: `bun run build` (or `npm run build` if using npm)
   - **Publish directory**: `dist/client`
   - **Node version**: 20 or higher

3. **Set Environment Variables**

   In Netlify Dashboard > Site settings > Environment variables, add:

   ```
   VITE_SUPABASE_URL=https://zkkcbicpsqjmticgfumr.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   **IMPORTANT**:
   - Never commit these values to Git
   - Get these from your Supabase project settings
   - Variables MUST be prefixed with `VITE_` to be accessible in the client

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your site
   - You'll get a URL like `https://random-name.netlify.app`

5. **Configure Custom Domain (Optional)**
   - Go to Site settings > Domain management
   - Add your custom domain
   - Follow Netlify's DNS configuration instructions

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   # or
   bun add -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Site**
   ```bash
   netlify init
   ```

   Follow the prompts:
   - Create & configure a new site
   - Choose your team
   - Site name (optional)
   - Build command: `bun run build`
   - Publish directory: `dist/client`

4. **Set Environment Variables**
   ```bash
   netlify env:set VITE_SUPABASE_URL "https://zkkcbicpsqjmticgfumr.supabase.co"
   netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key-here"
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Build Configuration

The `netlify.toml` file configures:

- **Build settings**: Uses Bun/npm to build, publishes `dist/client`
- **SPA routing**: Redirects all routes to `index.html` for client-side routing
- **Security headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Cache headers**: Long-term caching for static assets in `/assets/*`

## Project Structure

```
dist/
├── client/              # Static client build (published to Netlify)
│   ├── assets/          # JS/CSS bundles with content hashes
│   ├── index.html       # Entry HTML file
│   └── *.js             # JavaScript chunks
└── server/              # Server-side code (not used in Netlify deployment)
```

## Routes Available

After deployment, these routes will be available:

- `/` - Landing page (redirects to `/waitlist` in production)
- `/waitlist` - Main waitlist page for email collection
- `/build` - Demo build page (for testing)
- `/demo/*` - Demo pages

## Production Behavior

In production (`import.meta.env.PROD === true`):
- The landing page (`/`) automatically redirects to `/waitlist`
- This ensures users land on the waitlist page
- Set in `src/routes/index.tsx:48`

## Creating the Static Entry Point

TanStack Start doesn't generate an `index.html` file automatically. You need to create one manually:

**Option A: Automated Script (Recommended)**

Create a post-build script to generate index.html:

1. Create `scripts/generate-index.js`:
```javascript
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const distClient = 'dist/client';
const assets = readdirSync(join(distClient, 'assets'));

// Find the main JS and CSS files
const mainJs = assets.find(f => f.startsWith('main-') && f.endsWith('.js'));
const stylesCs = assets.find(f => f.startsWith('styles-') && f.endsWith('.css'));

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Mixable - Build production-ready software with multimodal AI">
    <title>Mixable - AI-Powered Development</title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/logo192.png">
    <link rel="manifest" href="/manifest.json">
    ${stylesCs ? `<link rel="stylesheet" href="/assets/${stylesCs}">` : ''}
</head>
<body>
    <div id="root"></div>
    ${mainJs ? `<script type="module" src="/assets/${mainJs}"></script>` : ''}
</body>
</html>`;

writeFileSync(join(distClient, 'index.html'), html);
console.log('✓ Generated index.html');
```

2. Update `package.json`:
```json
"scripts": {
  "build": "vite build && node scripts/generate-index.js",
  "build:netlify": "vite build && node scripts/generate-index.js"
}
```

**Option B: Manual Creation**

An `index.html` file has been created at `dist/client/index.html`, but you'll need to update the asset filenames after each build since they include content hashes.

## Testing the Build Locally

Before deploying, test the production build locally:

```bash
# Build for production
bun run build

# Preview the production build
bun run serve
```

Then visit `http://localhost:4173` to test the production build.

**Note:** If you see a blank page or errors, check the browser console for missing asset references in the index.html file.

## Troubleshooting

### Build Fails with "Cannot find module"

Make sure all dependencies are installed:
```bash
bun install
# or
npm install
```

### Environment Variables Not Working

- Ensure variables are prefixed with `VITE_`
- Check they're set in Netlify Dashboard > Site settings > Environment variables
- Redeploy after setting environment variables

### Supabase Connection Errors

- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check Supabase project is active and accessible
- Review `SUPABASE_SETUP.md` for database configuration

### 404 Errors on Routes

- Verify the redirect rule in `netlify.toml` is present
- Check the publish directory is `dist/client` (not just `dist`)
- Clear Netlify cache and redeploy

### Build Takes Too Long

- Netlify free tier has a 15-minute build timeout
- This project should build in 2-3 minutes typically
- Check for dependency installation issues

## Post-Deployment Checklist

- [ ] Site loads successfully at the Netlify URL
- [ ] `/waitlist` page renders correctly
- [ ] Email submission works (check Supabase database)
- [ ] Duplicate email error handling works
- [ ] All styles and assets load correctly
- [ ] Mobile responsiveness works
- [ ] Navigation between routes works
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate is active (Netlify provides this automatically)

## Updating the Site

After pushing changes to your Git repository:

1. **Automatic Deploys** (if configured):
   - Netlify will automatically build and deploy on push to main branch

2. **Manual Deploys**:
   ```bash
   netlify deploy --prod
   ```

## Monitoring

- **Deploy Status**: Netlify Dashboard > Deploys
- **Build Logs**: Click on any deploy to see full logs
- **Analytics**: Netlify Dashboard > Analytics (paid feature)
- **Email Submissions**: Check your Supabase dashboard

## Support

- **Netlify Docs**: https://docs.netlify.com/
- **Netlify Community**: https://answers.netlify.com/
- **Supabase Docs**: https://supabase.com/docs

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xyz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGc...` |

**Note**: Never use `SUPABASE_SERVICE_ROLE_KEY` in client-side code. It should only be used in server-side code or for administrative tasks.

## Cost Considerations

- **Netlify Free Tier**:
  - 100 GB bandwidth/month
  - 300 build minutes/month
  - Unlimited sites
  - HTTPS included
  - Perfect for waitlist pages

- **Supabase Free Tier**:
  - 500 MB database space
  - 50,000 monthly active users
  - 1 GB file storage
  - Sufficient for thousands of waitlist signups

## Alternative: Deploy to Cloudflare Workers (Recommended)

Since TanStack Start is designed for Cloudflare Workers, this is the **simplest and most reliable** deployment method:

### Why Cloudflare Workers?

- ✓ Zero configuration needed (already set up)
- ✓ Full SSR support out of the box
- ✓ Better performance with edge computing
- ✓ Free tier includes 100,000 requests/day
- ✓ No need to create custom index.html

### Cloudflare Deployment Steps

1. **Install Wrangler** (if not already installed):
   ```bash
   bun add -g wrangler
   # or
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Set Environment Variables**:

   Create a `.env` file (already exists) with:
   ```env
   VITE_SUPABASE_URL=https://zkkcbicpsqjmticgfumr.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Deploy**:
   ```bash
   bun run deploy
   # or
   npm run deploy
   ```

5. **Access Your Site**:
   - Your site will be available at `https://mixable.workers.dev`
   - Or configure a custom domain in the Cloudflare dashboard

### Cloudflare vs Netlify Comparison

| Feature | Cloudflare Workers | Netlify Static |
|---------|-------------------|----------------|
| Setup Complexity | ✓ Very Simple | Requires custom config |
| SSR Support | ✓ Full Support | Limited |
| Framework Compatibility | ✓ Native | Workarounds needed |
| Free Tier | 100k requests/day | 100 GB bandwidth |
| Edge Performance | ✓ Excellent | Good |
| Build Time | Fast | Fast |

**Recommendation:** Use Cloudflare Workers for production deployment unless you specifically need Netlify features like Netlify Forms or Identity.

## Next Steps

After successful deployment:

1. Test the live site thoroughly
2. Share the waitlist URL with your target audience
3. Monitor email submissions in Supabase
4. Set up email notifications for new signups (see `SUPABASE_SETUP.md`)
5. Consider setting up analytics (Plausible, Fathom, or Cloudflare Analytics)

## Quick Start Summary

**For Cloudflare (Recommended):**
```bash
bun run build && bun run deploy
```

**For Netlify:**
```bash
# 1. Create the generate-index.js script (see above)
# 2. Update package.json build command
# 3. Deploy via Netlify Dashboard or CLI
netlify deploy --prod
```

Happy deploying!
