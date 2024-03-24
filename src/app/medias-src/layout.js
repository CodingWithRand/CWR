import { Inter } from 'next/font/google'
import "@/gss/index.css"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Medias Source',
  description: 'Contain all medias sources.',
}

export default function MediasSrcRootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
