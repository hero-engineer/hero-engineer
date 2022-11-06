import { PropsWithChildren } from 'react'

type RootLayoutProps = PropsWithChildren<never>

function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
