'use client'

import { useEffect } from 'react'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { HelmetProvider } from 'react-helmet-async'
import PersistedLayout from '@/components/layouts/PersistedLayout'

// Create MUI theme
const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#cc1f41',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
})

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppRouterCacheProvider>
      <HelmetProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <PersistedLayout>
            {children}
          </PersistedLayout>
        </ThemeProvider>
      </HelmetProvider>
    </AppRouterCacheProvider>
  )
}