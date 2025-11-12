# Supabase Setup Guide

Complete guide for setting up Supabase for the Press Review application.

## 📋 Prerequisites

- A Supabase account (free tier is sufficient)
- Basic understanding of SQL

## 🆕 Create New Project

### Step 1: Sign Up / Log In
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub, Google, or email

### Step 2: Create Organization (First Time)
1. Enter organization name (e.g., "My Company")
2. Click "Create organization"

### Step 3: Create Project
1. Click "New project"
2. Fill in details:
   - **Name**: press-review (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free (for development)
3. Click "Create new project"
4. Wait 2-3 minutes for provisioning

## 🗄️ Set Up Database

### Step 1: Open SQL Editor
1. In left sidebar, click **SQL Editor**
2. Click **New query**

### Step 2: Run Migration
1. Open `lib/supabase/schema.sql` in your code editor
2. Copy the entire file contents
3. Paste into Supabase SQL Editor
4. Click **Run** button (bottom right corner)
5. Wait for "Success. No rows returned" message

### Step 3: Verify Tables Created
1. In left sidebar, click **Table Editor**
2. You should see three tables:
   - `profiles`
   - `search_history`
   - `usage_limits`

## 🔑 Get API Credentials

### Step 1: Navigate to Settings
1. Click **Settings** (gear icon) in left sidebar
2. Click **API** in the settings menu

### Step 2: Copy Credentials
You'll need two values:

**Project URL**
```
https://xxxxx.supabase.co
```
Copy the entire URL

**anon/public key**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
Copy the long key under "Project API keys" → "anon public"

⚠️ **Important**: 
- Never commit these to Git
- Keep them secret
- The anon key is safe for client-side use (it's restricted by RLS policies)

## 🔐 Configure Authentication

### Email Provider (Default)
Already enabled! Users can sign up with email/password.

### Optional: Email Templates
Customize verification and password reset emails:

1. Go to **Authentication** → **Email Templates**
2. Edit templates:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password

### Optional: OAuth Providers
Enable social login:

1. Go to **Authentication** → **Providers**
2. Enable providers (Google, GitHub, etc.)
3. Add OAuth credentials from provider
4. Update app code to use OAuth

## 🛡️ Security Configuration

### Row Level Security (RLS)
Already configured in the migration! But let's verify:

1. Go to **Authentication** → **Policies**
2. Check each table has policies:

**profiles**
- ✅ Users can view own profile
- ✅ Users can update own profile

**search_history**
- ✅ Users can view own searches
- ✅ Users can view shared searches
- ✅ Users can insert own searches
- ✅ Users can update own searches
- ✅ Users can delete own searches

**usage_limits**
- ✅ Users can view own limits
- ✅ Users can update own limits

### API Keys Security

#### Public (anon) Key
- ✅ Safe to use in client-side code
- ✅ Protected by RLS policies
- ✅ Can be exposed in frontend

#### Service Role Key
- ⚠️ **Never** use in client-side code
- ⚠️ Bypasses RLS policies
- ⚠️ Only for server-side admin tasks
- ℹ️ Not needed for this app

## 🔄 Database Triggers

The migration created automatic triggers:

### New User Handler
When a user signs up:
1. Creates profile in `profiles` table
2. Creates initial usage limits in `usage_limits` table
3. Sets default limits (100 searches, 50 exports/month)

Verify it's working:
1. Go to **Database** → **Functions**
2. You should see `handle_new_user()`

## 📊 View Data

### Using Table Editor
1. Click **Table Editor**
2. Select a table
3. View, edit, or delete rows
4. Add filters and search

### Using SQL Editor
```sql
-- View all profiles
SELECT * FROM profiles;

-- View all search history
SELECT * FROM search_history;

-- View usage limits
SELECT * FROM usage_limits;

-- Count users
SELECT COUNT(*) FROM profiles;
```

## 🧪 Test the Setup

### Test 1: Create Account
1. In your app, go to `/signup`
2. Create a test account
3. Check Supabase **Table Editor** → **profiles**
4. Verify profile was created

### Test 2: Usage Limits
1. In **Table Editor** → **usage_limits**
2. Verify user has default limits:
   - `searches_this_month`: 0
   - `exports_this_month`: 0
   - `max_searches`: 100
   - `max_exports`: 50

### Test 3: Search History
1. Perform a search in your app
2. In **Table Editor** → **search_history**
3. Verify search was saved with:
   - User ID
   - Query
   - Config (JSONB)
   - Results (JSONB)

## 🚨 Troubleshooting

### "New query cannot be empty"
- Make sure you copied the entire `schema.sql` file
- Check there are no syntax errors

### "Permission denied for schema public"
- This shouldn't happen with default setup
- Contact Supabase support if it persists

### Tables Not Visible
- Refresh the page
- Check you're viewing the `public` schema
- Run the migration again

### Users Can See Other Users' Data
- Check RLS policies are enabled
- Go to **Table Editor** → select table → click **RLS**
- Should show "RLS enabled" with green checkmark

### Trigger Not Working
```sql
-- Check trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Check function exists
SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
```

## 📈 Monitor Usage

### Database Size
1. Go to **Settings** → **Database**
2. View **Database size** chart
3. Free tier includes 500MB

### API Requests
1. Go to **Settings** → **API**
2. View request statistics
3. Free tier includes 50,000 monthly active users

### Storage
1. Go to **Storage**
2. View storage usage
3. Free tier includes 1GB

## 🔄 Reset Database (Development Only)

⚠️ **Warning**: This deletes all data!

```sql
-- Drop all tables
DROP TABLE IF EXISTS usage_limits CASCADE;
DROP TABLE IF EXISTS search_history CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS reset_monthly_limits() CASCADE;

-- Re-run the migration from schema.sql
```

## 🚀 Production Checklist

Before deploying to production:

- [ ] Change database password
- [ ] Enable email verification
- [ ] Customize email templates
- [ ] Set up custom domain
- [ ] Configure backup schedule
- [ ] Enable database backups
- [ ] Set up monitoring alerts
- [ ] Review RLS policies
- [ ] Test all user flows
- [ ] Load test the database

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

## 🆘 Get Help

If you encounter issues:

1. **Supabase Discord**: Active community support
2. **GitHub Discussions**: Supabase repository
3. **Documentation**: Comprehensive guides
4. **Support Email**: For paid plans

---

Your Supabase database is now ready! Return to the Quick Start Guide to continue setup.
