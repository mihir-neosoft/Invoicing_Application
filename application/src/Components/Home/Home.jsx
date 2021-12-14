import React from 'react';
import { useNavigate } from 'react-router';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';


export default function Home() {
    const navigate = useNavigate();
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    textAlign: 'center',
                    backgroundImage: 'url(https://source.unsplash.com/random)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <Container sx={{ alignItems: 'center' }}>
                    <CssBaseline />
                    <Card sx={{ mt: 8, mb: 2, maxWidth: 'lg', backgroundColor: 'grey', opacity: [0.1, 0.1, 0.9], }}>
                        <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="lg">
                            <Typography variant="h2" component="h1" gutterBottom>
                                Invoicing Application
                            </Typography>
                            <Typography variant="h4" component="h2" gutterBottom>
                                {'Generate and send beautiful invoices, receipts, estimates, quotes, bills etc to your clients.'}
                            </Typography>
                            <Typography variant="h5" component="h2" gutterBottom>
                                {'specially designed for freelancers and small businesses.'}
                            </Typography>
                            <Typography variant="body1">{'Application created using MongoDB, Express, React & NodeJS.'}</Typography>
                            <Button onClick={()=>{navigate('/Register')}} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} size="large">
                                Get Started
                            </Button>
                        </Container>
                    </Card>
                </Container>
                <Box
                    component="footer"
                    sx={{
                        py: 3,
                        px: 2,
                        mt: 'auto',
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[200]
                                : theme.palette.grey[800],
                    }}
                >
                    <Container maxWidth="lg">
                        <Typography variant="body1">
                            {'Basic Invoicing Application.'}
                            {' © Mihir Adelkar.'}

                        </Typography>
                    </Container>
                </Box>
            </Box>
        </>
    )
}
