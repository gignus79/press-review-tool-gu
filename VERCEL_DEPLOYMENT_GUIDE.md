# Press Review Tool - Vercel Deployment Guide

## Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) using your GitHub account
3. **Supabase Project**: Set up your Supabase database (see SUPABASE_SETUP.md)

## Environment Variables Setup

You'll need to configure these environment variables in Vercel:

### Required Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For future AI integrations
OPENAI_API_KEY=your_openai_api_key
```

### Getting Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **anon/public key**

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your `package.json` has the correct build scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 2. Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

#### Option B: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your account
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy "press-review-tool"? → Y
# - Which scope? → Select your account
# - Link to existing project? → N
# - What's your project's name? → press-review-tool
# - In which directory is your code located? → ./
```

### 3. Configure Environment Variables

#### Via Vercel Dashboard:

1. Go to your project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase project URL
   - Environment: Production, Preview, Development

#### Via Vercel CLI:

```bash
# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Optionally add for preview/development
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
```

### 4. Supabase Database Setup

Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable Row Level Security
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_searches ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own search history" ON search_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own search history" ON search_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own usage limits" ON usage_limits
    FOR ALL USING (auth.uid() = user_id);

-- Insert default usage limits for new users
CREATE OR REPLACE FUNCTION create_user_limits()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO usage_limits (user_id, max_searches, max_exports)
    VALUES (NEW.id, 100, 50);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE create_user_limits();
```

### 5. Domain Configuration (Optional)

1. **Custom Domain**: Go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS settings as instructed

### 6. Post-Deployment Verification

1. **Test Authentication**: Verify login/signup works
2. **Test Search**: Perform a search and check results
3. **Test Export**: Try exporting results as PDF/CSV/JSON
4. **Test Link Clicking**: Verify external links open correctly
5. **Check Database**: Verify data is being saved to Supabase

## Build Configuration

The project includes a `next.config.js` with optimal settings:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimized for production
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
  }
}

module.exports = nextConfig
```

## Troubleshooting

### Common Issues

1. **Build Errors**:
   ```bash
   # Check TypeScript errors
   npm run type-check
   
   # Fix linting issues
   npm run lint -- --fix
   ```

2. **Environment Variables Not Loading**:
   - Ensure variables start with `NEXT_PUBLIC_` for client-side access
   - Redeploy after adding new environment variables

3. **Supabase Connection Issues**:
   - Verify URLs don't have trailing slashes
   - Check that anon key is correct
   - Ensure RLS policies are properly configured

4. **Build Size Optimization**:
   ```javascript
   // In next.config.js
   webpack: (config) => {
     config.optimization.splitChunks = {
       chunks: 'all',
       cacheGroups: {
         vendor: {
           test: /[\\/]node_modules[\\/]/,
           name: 'vendors',
           priority: 10,
           enforce: true,
         },
       },
     }
     return config
   }
   ```

### Performance Tips

1. **Reduce Bundle Size**:
   - Use dynamic imports for heavy components
   - Optimize images with Next.js Image component
   - Enable compression in next.config.js

2. **Database Optimization**:
   - Add indexes on frequently queried columns
   - Use connection pooling for production
   - Set appropriate cache headers

3. **Monitoring**:
   - Enable Vercel Analytics
   - Set up error tracking (e.g., Sentry)
   - Monitor Core Web Vitals

## Security Checklist

- [ ] Environment variables properly configured
- [ ] Row Level Security enabled on all tables
- [ ] Auth policies correctly implemented
- [ ] API routes protected with authentication
- [ ] CORS properly configured
- [ ] Content Security Policy headers set

## Post-Launch

1. **Analytics**: Enable Vercel Analytics or Google Analytics
2. **Monitoring**: Set up uptime monitoring
3. **Backups**: Configure Supabase backups
4. **Updates**: Set up CI/CD for automated deployments

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Created by MediaMatter - Giorgio Lovecchio**

For support, please contact: [your-email@example.com]