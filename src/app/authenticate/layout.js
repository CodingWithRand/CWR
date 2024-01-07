import { Inter } from 'next/font/google'
import '@/gss/index.css'
import { Global } from '@/glient/global'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Authenticate Action Handler Page',
  description: 'Handling actions such as verify email, password reset, etc.',
}

export default function AuthenticateActionHandlerRootLayout({ children }) {
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
