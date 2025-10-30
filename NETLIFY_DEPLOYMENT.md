# Deploying Mixable Waitlist to Netlify

This guide walks you through deploying the Mixable waitlist page to Netlify as a React SPA.

## Prerequisites

- A Netlify account (free tier works fine)
- GitHub/GitLab/Bitbucket repository with your code pushed
- Supabase project already set up (see `SUPABASE_SETUP.md`)

## Quick Deploy

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "Add new site" > "Import an existing project"
   - Connect your Git provider (GitHub, GitLab, or Bitbucket)
   - Select the `mixable` repository

2. **Configure Build Settings**

   Netlify should auto-detect the configuration from `netlify.toml`:

   - **Build command**: `bun run build` (or `npm run build`)
   - **Publish directory**: `dist`
   - **Node version**: 20 or higher

3. **Set Environment Variables**

   In Netlify Dashboard > Site settings > Environment variables, add:

   ```
   VITE_SUPABASE_URL=https://zkkcbicpsqjmticgfumr.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
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
   - Publish directory: `dist`

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

- **Build settings**: Uses Bun/npm to build, publishes `dist` directory
- **SPA routing**: Redirects all routes to `index.html` for client-side routing
- **Security headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Cache headers**: Long-term caching for static assets in `/assets/*`

## Project Structure

```
dist/
├── assets/              # JS/CSS bundles with content hashes
├── index.html           # Entry HTML file
├── favicon.ico          # Favicon
├── logo192.png          # App icon
├── logo512.png          # App icon
└── manifest.json        # PWA manifest
```

## Routes Available

After deployment, these routes will be available:

- `/` - Landing page (redirects to `/waitlist` in production)
- `/waitlist` - Main waitlist page for email collection
- `/build` - Demo build page (for testing)

## Production Behavior

In production (`import.meta.env.PROD === true`):
- The landing page (`/`) automatically redirects to `/waitlist`
- This ensures users land on the waitlist page
- Set in `src/routes/index.tsx:11`

## Testing the Build Locally

Before deploying, test the production build locally:

```bash
# Build for production
bun run build

# Preview the production build
bun run serve
```

Then visit `http://localhost:4173` to test the production build.

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
- Check the publish directory is `dist`
- Clear Netlify cache and redeploy

### Build Takes Too Long

- Netlify free tier has a 15-minute build timeout
- This project should build in ~2 seconds
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

## Next Steps

After successful deployment:

1. Test the live site thoroughly
2. Share the waitlist URL with your target audience
3. Monitor email submissions in Supabase
4. Set up email notifications for new signups (see `SUPABASE_SETUP.md`)
5. Consider setting up analytics (Plausible, Fathom, or Netlify Analytics)

## Technical Details

This project is built with:

- **React 19** - Modern React with concurrent features
- **TanStack Router** - Type-safe routing
- **Vite 7** - Lightning-fast build tool
- **Tailwind CSS v4** - Utility-first CSS
- **Supabase** - PostgreSQL database
- **TypeScript** - Type safety

The build outputs a standard React SPA that works perfectly on Netlify with client-side routing and production optimizations.

Happy deploying!
