import { Inter, Poppins, Playfair_Display } from 'next/font/google'
import { getServerSession } from 'next-auth'
import SessionProviderWrapper from '@/components/SessionProvider'
import { Toaster } from '@/components/ui/toaster'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import ConditionalLayout from '@/components/ConditionalLayout'
import '@/styles/globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata = {
  title: 'ExpenseFlow - Simplify Your Expense Management',
  description: 'Automate expense claims, customize approval flows, and gain full financial transparency with ExpenseFlow.',
  keywords: 'expense management, expense tracking, reimbursement, approval workflow, OCR receipts',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <SessionProviderWrapper session={session}>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <Toaster />
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
