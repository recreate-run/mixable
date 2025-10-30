# Supabase Setup for Mixable Waitlist

This guide will help you set up Supabase for storing waitlist emails.

## Prerequisites

1. Supabase account (free tier works great)
2. Waitlist table created in Supabase dashboard (you'll handle this)

## Environment Variables

The `.env` file is configured with Supabase credentials:

```env
VITE_SUPABASE_URL=https://gelkvdkqpqcxjskozkxr.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Development

### Test Locally

Start the development server:

```bash
bun install
bun --bun run start
```

Visit `http://localhost:3000/waitlist` and submit an email to test.

## Deploy

Deploy to your preferred platform:

#### Cloudflare Pages:
```bash
bun run build
# Follow Cloudflare Pages deployment instructions
```

#### Vercel:
```bash
vercel deploy
```

Make sure to add your environment variables in the platform's settings:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Database Management

### View Waitlist Entries

Via Supabase Dashboard:
1. Go to Table Editor
2. Select `waitlist` table

Via SQL Editor:
```sql
SELECT * FROM waitlist ORDER BY created_at DESC;
```

### Count Total Signups

```sql
SELECT COUNT(*) as total FROM waitlist;
```

### Export Emails

```sql
SELECT email, created_at FROM waitlist ORDER BY created_at DESC;
```

Or use the Supabase Dashboard export feature (Table Editor → Export → CSV)

### Query by Date

```sql
-- Signups from last 7 days
SELECT COUNT(*) as recent_signups
FROM waitlist
WHERE created_at > NOW() - INTERVAL '7 days';
```

## Production URLs

- **Demo**: `/` - The original demo with streaming
- **Waitlist**: `/waitlist` - Production waitlist page

## Security Notes

- All emails are stored in lowercase and trimmed
- Duplicate emails are prevented via UNIQUE constraint
- Row Level Security (RLS) is enabled for data protection
- Email validation is performed on client side
- The anon key is safe to expose (it's client-side)
- Service role key should NEVER be exposed to the client

## API Reference

### Client Usage

```typescript
import { supabase } from './lib/supabase'

// Insert email
const { error } = await supabase
  .from('waitlist')
  .insert({ email: 'user@example.com' })

// Query (requires authentication)
const { data } = await supabase
  .from('waitlist')
  .select('*')
```

## Troubleshooting

### "Failed to join waitlist"
- Check if the table exists
- Verify RLS policies are set correctly
- Ensure anon key is valid

### "This email is already on the waitlist"
- This is expected behavior for duplicate emails
- The UNIQUE constraint prevents duplicates

### Local development issues
- Make sure `.env` file exists
- Verify environment variables are loaded
- Check browser console for errors
