# Press Review - Next.js 14 Application

A web application for automated analysis of music press reviews using AI-powered search and categorization to help music professionals track media coverage efficiently.

## 🚀 Features

- **Authentication**: Supabase-powered email/password authentication
- **AI-Powered Analysis**: Automated sentiment analysis, relevance scoring, and theme extraction
- **Search Management**: Save and revisit search history
- **Export Options**: Export results to CSV, JSON, or PDF formats
- **Sharing**: Generate shareable links for search results
- **Usage Limits**: Track monthly search and export quotas
- **Dark/Light Mode**: User-controlled theme switching
- **Responsive Design**: Optimized for desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Phosphor Icons
- **Type Safety**: TypeScript
- **Export Libraries**: jsPDF, PapaParse

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier works)
- Git

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd press-review
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

Note: We use `--legacy-peer-deps` due to React 19 compatibility with Next.js 14.

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be set up

#### Run Database Migrations

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `lib/supabase/schema.sql`
3. Run the SQL script to create all necessary tables, policies, and functions

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Find these values in your Supabase project settings under **API**.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
/workspace
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   │   ├── login/           # Login page
│   │   └── signup/          # Signup page
│   ├── api/                 # API routes
│   │   ├── analyze/         # AI analysis endpoint
│   │   ├── history/         # Search history management
│   │   ├── search/          # Search execution
│   │   ├── share/           # Sharing functionality
│   │   └── usage/           # Usage limits tracking
│   ├── dashboard/           # Main dashboard
│   ├── shared/[token]/      # Shared search view
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page (redirects)
├── lib/
│   ├── supabase/            # Supabase client configuration
│   │   ├── client.ts        # Browser client
│   │   ├── server.ts        # Server client
│   │   ├── middleware.ts    # Auth middleware helper
│   │   └── schema.sql       # Database schema
│   ├── types/               # TypeScript types
│   │   └── database.ts      # Database & app types
│   └── utils/               # Utility functions
│       ├── export.ts        # Export functionality
│       └── mock-search.ts   # Mock search/analysis
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── SearchDialog.tsx
│   │   ├── ResultCard.tsx
│   │   ├── SearchToolbar.tsx
│   │   ├── MetricDisplay.tsx
│   │   └── EmptyState.tsx
│   ├── hooks/              # Custom React hooks
│   └── styles/             # CSS files
├── middleware.ts           # Next.js middleware
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## 🗄️ Database Schema

### Tables

#### `profiles`
- Extends `auth.users` with additional user information
- Auto-created via trigger on user signup

#### `search_history`
- Stores all user searches with results
- Supports sharing via unique tokens
- Includes full search configuration and results

#### `usage_limits`
- Tracks monthly search and export quotas per user
- Default limits: 100 searches, 50 exports per month
- Auto-resets monthly

### Row Level Security (RLS)

All tables have RLS enabled to ensure users can only access their own data. Shared searches are accessible via share tokens.

## 🎨 Customization

### Theme Colors

Colors are defined in `src/styles/theme.css` using OKLCH color space:
- Primary: Deep indigo blue
- Secondary: Warm amber & Teal green
- Accent: Vibrant coral

### Usage Limits

Default limits can be adjusted in the database:
- Max searches per month: 100
- Max exports per month: 50

Update in `lib/supabase/schema.sql` before running migrations.

## 🔐 Authentication

The app uses Supabase Authentication with:
- Email/Password sign up and login
- Protected routes via middleware
- Session management with cookies
- Auto profile creation on signup

## 📤 Export Formats

### JSON
- Complete data export with all fields
- Includes analysis results

### CSV
- Flattened data structure
- Suitable for spreadsheet analysis

### PDF
- Formatted report with tables
- Includes title, date, and result count

## 🔗 Sharing

Users can generate shareable links for their searches:
- Public read-only access
- No authentication required
- Unique token-based URLs
- Can be revoked anytime

## 🚦 Usage Limits

Track and enforce usage limits:
- Monthly search quota
- Monthly export quota
- Auto-reset at month start
- API returns 429 status when limits exceeded

## 🧪 Development

### Mock Data

The app uses mock data for search results and AI analysis. Replace `lib/utils/mock-search.ts` with real API calls to:
- Music press APIs (e.g., Pitchfork, Rolling Stone)
- AI analysis services (e.g., OpenAI GPT)

### Adding Real AI

To integrate real AI analysis:

1. Add OpenAI API key to `.env.local`:
```env
OPENAI_API_KEY=your_openai_api_key
```

2. Update `lib/utils/mock-search.ts` to call OpenAI API
3. Modify `analyzeResult` function to use GPT-4 or similar

## 🐛 Troubleshooting

### React Version Conflicts

If you encounter React version errors, use:
```bash
npm install --legacy-peer-deps
```

### Supabase Connection Issues

- Verify your Supabase URL and keys in `.env.local`
- Check that RLS policies are properly set up
- Ensure database tables exist

### Build Errors

```bash
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run build
```

## 📝 Environment Variables

Required variables in `.env.local`:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000  # For share links
OPENAI_API_KEY=your_openai_key             # If using real AI
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Docker

Ensure environment variables are configured on your platform.

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

See LICENSE file for details.

## 🆘 Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with details
3. Provide error messages and context

---

Built with Next.js 14, Supabase, and ❤️
