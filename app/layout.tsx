import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hivemind Experiments Viewer',
  description: 'View and explore your favorite experiments from Hivemind',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
