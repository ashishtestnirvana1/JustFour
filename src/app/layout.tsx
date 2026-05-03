import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JustFour',
  description: 'Four things. This week. That\'s it.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', backgroundColor: '#F7F6F3' }}>
        {children}
      </body>
    </html>
  )
}
