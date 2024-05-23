import { Inter } from 'next/font/google'
import "@/gss/index.css"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'My Projects',
  description: 'Contain all my programming projects referrences.',
}

export default function MyProjectsRootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
