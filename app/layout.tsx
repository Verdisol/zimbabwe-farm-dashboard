import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zimbabwe Farm Dashboard',
  description: 'Climate-smart agriculture dashboard for smallholder farmers in Zimbabwe',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
