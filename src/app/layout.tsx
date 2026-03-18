import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Memecoin Screener',
  description: 'Real-time memecoin analysis powered by Nansen AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#0a0a14', color: '#fff' }}>
        {children}
      </body>
    </html>
  )
}