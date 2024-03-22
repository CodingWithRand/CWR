import { Inter } from 'next/font/google'
import "@/gss/index.css"
import { Global } from '@/glient/global'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CodingWithRand\'s Index Page',
  description: 'My personal index page. It\'s all about me.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ overflow: 'hidden' }}>
      <body className={inter.className}>
        <Global>
          {children}
        </Global>
      </body>
    </html>
  )
}
