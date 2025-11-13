#!/bin/bash

echo "🔍 Next.js Project Configuration Check"
echo "======================================"

echo ""
echo "📦 Package.json check:"
if grep -q "next dev" package.json; then
    echo "✅ Next.js dev script found"
else
    echo "❌ Next.js dev script missing"
fi

if grep -q "next build" package.json; then
    echo "✅ Next.js build script found"
else
    echo "❌ Next.js build script missing"
fi

echo ""
echo "🔧 Configuration files:"
if [ -f "next.config.js" ]; then
    echo "✅ next.config.js exists"
else
    echo "❌ next.config.js missing"
fi

if [ -f "middleware.ts" ]; then
    echo "✅ middleware.ts exists"
else
    echo "❌ middleware.ts missing"
fi

if [ -f ".eslintrc.json" ]; then
    echo "✅ ESLint config exists"
else
    echo "❌ ESLint config missing"
fi

echo ""
echo "🌍 Environment:"
if [ -f ".env.local" ]; then
    echo "✅ .env.local exists"
else
    echo "❌ .env.local missing"
fi

echo ""
echo "📁 Directory structure:"
if [ -d "app" ]; then
    echo "✅ app/ directory exists (Next.js App Router)"
else
    echo "❌ app/ directory missing"
fi

if [ -d "lib" ]; then
    echo "✅ lib/ directory exists"
else
    echo "❌ lib/ directory missing"
fi

echo ""
echo "🔍 Checking for common issues:"
if grep -r "import.meta.env" src/ 2>/dev/null; then
    echo "⚠️  Found Vite-style imports that should be updated to Next.js style"
else
    echo "✅ No Vite-style environment imports found"
fi

if grep -r "@github/spark/hooks" src/ 2>/dev/null; then
    echo "⚠️  Found GitHub Spark hooks that might need replacement"
else
    echo "✅ No GitHub Spark hooks found in src/"
fi

echo ""
echo "Configuration check complete! 🎉"