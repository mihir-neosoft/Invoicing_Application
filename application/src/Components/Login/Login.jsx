import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'react-simple-snackbar';
import { useDispatch } from 'react-redux';
// MUI
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// dispatch
import { signin } from '../../Actions/userActions';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import Link from '@mui/material/Link';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Container from '@mui/material/Container';
// import Paper from '@mui/material/Paper';



export default function Login() {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', profilePicture: '', bio: '' });
    const [verror, setVerror] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', profilePicture: '', bio: '' });

    const navigate = useNavigate();
    const [openSnackbar] = useSnackbar();
    const dispatch = useDispatch();

    const user = JSON.parse(localStorage.getItem('profile'));
    useEffect(() => {
        if (user) {
            console.log(user);
            navigate('/Dashboard');
        }
        // eslint-disable-next-line
    }, [user])

    const regForemail = RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.com$");
    const regForpassword = RegExp("^[a-zA-Z0-9@*!&%$]{8,15}");
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case "email":
                setVerror({ ...verror, [name]: regForemail.test(value) ? "" : 'Enter a Valid Email' })
                break;
            case "password":
                setVerror({ ...verror, [name]: regForpassword.test(value) ? "" : 'Enter a Valid Password(8 char)' })
                break;
            default: break;
        }
        setFormData({ ...formData, [name]: value });
    }
    const handleValidate = (errors) => {
        let validate = (errors.email === "" && errors.password === "") ? true : false;
        return validate;
    }
    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (handleValidate(verror)) {
            if (formData.email !== "" && formData.password !== "") {
                console.log(formData);
                dispatch(signin(formData, openSnackbar));
                // navigate('/Dashboard');
            } else { alert("Please Fill All Fields"); }
        } else { alert("Please Enter Valid Details"); }
    }

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Paper sx={{ p: 4, m: 4 }} elevation={2}>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}

                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleFormSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    error={verror.email === "" ? false : true}
                                    helperText={verror.email}
                                    onChange={handleInputChange}
                                    type="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    error={verror.password === "" ? false : true}
                                    helperText={verror.password}
                                    onChange={handleInputChange}
                                    autoComplete="password"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link onClick={() => { navigate('/Register') }} variant="body2">
                                    {"Don't have an account? Register"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}