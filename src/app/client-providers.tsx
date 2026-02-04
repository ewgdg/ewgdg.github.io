'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import PersistedLayout from '@/components/layouts/persisted-layout'

// Create MUI theme
const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    // primary: {
    //   main: '#cc1f41',
    // },
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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PersistedLayout>
          {children}
        </PersistedLayout>
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
