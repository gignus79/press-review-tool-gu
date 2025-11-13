import type { Metadata } from 'next'
// Temporarily disabled due to network restrictions in build environment
// import { Plus_Jakarta_Sans } from 'next/font/google'
import '@/src/index.css'
import { Toaster } from '@/src/components/ui/sonner'

// const plusJakartaSans = Plus_Jakarta_Sans({ 
//   subsets: ['latin'],
//   variable: '--font-sans',
//   fallback: ['system-ui', 'arial'],
//   display: 'swap',
// })

export const metadata: Metadata = {
  title: 'Press Review - AI-Powered Music Press Analysis',
  description: 'Automated analysis of music press reviews using AI-powered search and categorization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
