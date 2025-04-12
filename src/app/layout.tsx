import { Inter } from 'next/font/google'
import ThemeRegistry from '../components/ThemeRegistry'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Restaurant App',
  description: 'Order your favorite food online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  )
}
