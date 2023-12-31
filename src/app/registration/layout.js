import { Inter } from 'next/font/google'
// import './globals.css'
import { Global } from '../global/global'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Registration Landing Page',
  description: 'Authenticate user & Creating account here.',
}

export default function RegistrationPageRootLayout({ children }) {
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
