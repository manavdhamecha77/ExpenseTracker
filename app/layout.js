import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import SessionProviderWrapper from '@/components/SessionProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Toaster } from '@/components/ui/toaster'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Oddo Hackathon App',
  description: 'A professional hackathon-ready Next.js application with authentication',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper session={session}>
          <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="pt-16 flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
