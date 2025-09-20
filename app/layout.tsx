import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chainguard Custom Packages',
  description: 'Certificate management for container images',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-chainguard-dark to-chainguard-darker min-h-screen">
        {children}
      </body>
    </html>
  )
}