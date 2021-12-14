import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'react-simple-snackbar';
import { useDispatch } from 'react-redux';
// MUI
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// dispatch
import { signup } from '../../Actions/userActions';

export default function Register() {
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
    
    const regForname = RegExp("^[a-zA-Z]+$");
    const regForemail = RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.com$");
    const regForpassword = RegExp("^[a-zA-Z0-9@*!&%$]{8,15}");
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case "firstName":
                setVerror({ ...verror, [name]: regForname.test(value) ? "" : 'Enter a Valid First Name' })
                break;
            case "lastName":
                setVerror({ ...verror, [name]: regForname.test(value) ? "" : 'Enter a Valid Last Name' })
                break;
            case "email":
                setVerror({ ...verror, [name]: regForemail.test(value) ? "" : 'Enter a Valid Email' })
                break;
            case "password":
                setVerror({ ...verror, [name]: regForpassword.test(value) ? "" : 'Enter a Valid Password(8 char)' })
                break;
            case "confirmPassword":
                setVerror({ ...verror, [name]: formData.password === value ? "" : 'Password Not Matched)' })
                break;
            default: break;
        }
        setFormData({ ...formData, [name]: value });
    }
    const handleValidate = (errors) => {
        let validate = (errors.firstName === "" && errors.lastName === "" && errors.email === "" && errors.password === "" && errors.confirmPassword === "") ? true : false;
        return validate;
    }
    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (handleValidate(verror)) {
            if (formData.firstName !== "" && formData.lastName !== "" && formData.email !== "" && formData.password !== "" && formData.confirmPassword !== "") {
                console.log(formData);
                dispatch(signup(formData, openSnackbar));
                // navigate('/Login');
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
                    <Box component="form" noValidate onSubmit={handleFormSubmit} sx={{ mt: 3 }} >
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    error={verror.firstName === "" ? false : true}
                                    helperText={verror.firstName}
                                    onChange={handleInputChange}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    error={verror.lastName === "" ? false : true}
                                    helperText={verror.lastName}
                                    onChange={handleInputChange}
                                    autoComplete="family-name"
                                />
                            </Grid>
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
                                    autoComplete="new-password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    id="confirmPassword"
                                    error={verror.confirmPassword === "" ? false : true}
                                    helperText={verror.confirmPassword}
                                    onChange={handleInputChange}
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
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link onClick={() => { navigate('/Login') }} variant="body2">
                                    Already have an account? Login
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}