import { Inter } from 'next/font/google'
import "@/gss/index.css"
import { Global } from '@/glient/global'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Setting Dashboard',
  description: 'For the user to update their settings.',
}

export default function SettingsRootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Global>
          {children}
        </Global>
      </body>
    </html>
  )
}
