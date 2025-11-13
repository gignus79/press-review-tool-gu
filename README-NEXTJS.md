# 🎵 Press Review Tool - Next.js Application

An AI-powered music press analysis tool built with **Next.js 14**, **Supabase**, and **React 18**. This application helps music industry professionals analyze press coverage, track sentiment, and generate insights from music reviews and articles.

## ✨ Features

- **🔍 Advanced Search**: Search across multiple music press sources with filters
- **🤖 AI Analysis**: Automated sentiment analysis and relevance scoring
- **📊 Analytics Dashboard**: Visual metrics and trend analysis
- **🔐 Authentication**: Secure user management with Supabase Auth
- **📤 Export Options**: JSON, CSV, and PDF export capabilities
- **🔗 Sharing**: Generate shareable links for searches and results
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for database and auth)

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Environment Setup
Create `.env.local` with your Supabase credentials:
```env
NODE_ENV=development
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key  # Optional
```

### 3. Database Setup
Run the SQL schema from `lib/supabase/schema.sql` in your Supabase dashboard.

### 4. Start Development
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API routes
│   └── dashboard/         # Main dashboard
├── lib/                   # Utility libraries
│   ├── supabase/         # Database client & schemas
│   └── utils/            # Helper functions
├── src/                  # React components & hooks
│   ├── components/       # Reusable UI components
│   └── hooks/           # Custom React hooks
└── middleware.ts         # Next.js middleware for auth
```

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📚 Documentation

- **[Next.js Setup Guide](NEXTJS_README.md)** - Detailed Next.js configuration
- **[Supabase Setup Guide](SUPABASE_SETUP.md)** - Database and authentication setup
- **[Migration Guide](MIGRATION_GUIDE.md)** - From Vite to Next.js migration
- **[Project Summary](PROJECT_SUMMARY.md)** - Complete feature overview

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel
```

### Environment Variables for Production
Make sure to set these in your deployment platform:
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_key
OPENAI_API_KEY=your_openai_key
```

## 🔧 Development Notes

- Uses React 18 for better compatibility with the ecosystem
- Custom `useKV` hook replaces GitHub Spark hooks for Next.js compatibility
- Supabase handles authentication, database, and real-time features
- Tailwind CSS with custom theme configuration
- TypeScript with strict mode for better development experience

## 📝 License

MIT License - see LICENSE file for details.

---

Built with ❤️ using Next.js 14, Supabase, and React 18