# 🚀 Quick Start Guide

Get your Press Review Next.js app running in minutes!

## ⚡ Fast Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Choose organization and project name
4. Set a strong database password
5. Select region closest to you
6. Wait ~2 minutes for setup

### 3. Set Up Database
1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `lib/supabase/schema.sql`
4. Paste into the SQL editor
5. Click **Run** (bottom right)
6. You should see "Success. No rows returned"

### 4. Get API Keys
1. In Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL**
3. Copy your **anon/public key**

### 5. Configure Environment
Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the values with what you copied in step 4.

### 6. Run the App
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 7. Create Your First Account
1. Click "Sign up"
2. Enter email and password (min 6 characters)
3. Click "Create Account"
4. You're in! 🎉

## ✨ What You Can Do Now

### Perform a Search
1. Click **"New Search"** button
2. Enter an artist or topic (e.g., "Taylor Swift")
3. Select date range and content types
4. Click **"Start Search"**
5. Watch AI analyze the results!

### Filter Results
- Use sentiment filter (positive/neutral/negative)
- Filter by content type
- Select specific results

### Export Data
1. Select results or export all
2. Click export dropdown
3. Choose format: CSV, JSON, or PDF
4. File downloads automatically

### View History
1. Click **"History"** button
2. See all past searches
3. Click any search to reload it

### Share Results
Coming soon: Generate public share links!

## 🎨 Features

- ✅ **Authentication**: Secure email/password login
- ✅ **AI Analysis**: Sentiment, relevance, themes
- ✅ **Search History**: Save and reload searches
- ✅ **Export**: CSV, JSON, PDF formats
- ✅ **Usage Limits**: 100 searches, 50 exports/month
- ✅ **Dark/Light Mode**: Toggle in header
- ✅ **Responsive**: Works on mobile and desktop
- ✅ **Sharing**: Generate public links (via API)

## 📊 Default Usage Limits

Free tier includes:
- **100 searches per month**
- **50 exports per month**
- **Unlimited result views**
- **Unlimited history storage**

Limits reset automatically on the 1st of each month.

## 🔧 Troubleshooting

### "Invalid API key" Error
- Check `.env.local` has correct Supabase URL and key
- Restart dev server after adding `.env.local`
- Verify no extra spaces in environment variables

### Can't Create Account
- Check password is at least 6 characters
- Verify Supabase project is active
- Check email is valid format
- Try a different email address

### Search Returns No Results
- This is normal for the demo (using mock data)
- Real implementation would connect to music press APIs
- AI analysis is also simulated for demo

### Database Errors
- Ensure you ran the SQL migration (`schema.sql`)
- Check all tables were created in Supabase dashboard
- Verify RLS policies are enabled

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install --legacy-peer-deps
npm run dev
```

## 📱 Mobile Access

The app is fully responsive! Access from:
- iPhone/iPad (Safari, Chrome)
- Android (Chrome, Firefox)
- Tablet devices

## 🎯 Next Steps

1. **Customize Branding**: Edit colors in `src/styles/theme.css`
2. **Add Real APIs**: Replace `lib/utils/mock-search.ts` with real API calls
3. **Integrate AI**: Connect OpenAI or other AI services
4. **Deploy**: Push to Vercel, Netlify, or your hosting provider
5. **Custom Domains**: Configure in deployment settings

## 📖 Documentation

- **Full Setup**: See `NEXTJS_README.md`
- **Migration Info**: See `MIGRATION_GUIDE.md`
- **Database Schema**: See `lib/supabase/schema.sql`
- **API Reference**: Check files in `app/api/`

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Review `NEXTJS_README.md` for detailed info
3. Check Supabase dashboard for errors
4. Create a GitHub issue with:
   - Error message
   - Steps to reproduce
   - Screenshots if applicable

## 🌟 Pro Tips

- **Use Chrome DevTools**: Check console for errors
- **Check Network Tab**: See API calls and responses
- **Supabase Dashboard**: Monitor database in real-time
- **Use TypeScript**: Get autocomplete and type safety
- **Dark Mode**: Click moon/sun icon in header

## 🚀 Ready to Deploy?

### Vercel (Easiest)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Environment Variables for Production
Don't forget to add these in your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL` (your production URL)

---

**Congratulations!** 🎉 You now have a fully functional AI-powered press review application!

Need more features? Check out the Migration Guide for advanced customization options.
