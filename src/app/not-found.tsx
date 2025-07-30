import { Container, Typography, Box, Button } from '@mui/material'
import Link from '../components/navigation/link'
import { calcViewportHeight } from '../lib/dom/viewport'

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: calcViewportHeight(100),
          textAlign: 'center'
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Sorry, the page you're looking for doesn't exist.
        </Typography>
        <Link href="/">
          <Button variant="contained" color="primary">
            Go Home
          </Button>
        </Link>
      </Box>
    </Container>
  )
}