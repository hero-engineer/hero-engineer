import '../styles/globals.css'

import { PropsWithChildren } from 'react'
import { EcuMaster } from 'ecu-client'

type RootLayoutProps = PropsWithChildren<never>

function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head />
      <body>
        <EcuMaster mode="development">
          {children}
        </EcuMaster>
      </body>
    </html>
  )
}

export default RootLayout
