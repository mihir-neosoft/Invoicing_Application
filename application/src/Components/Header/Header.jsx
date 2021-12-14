import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';
import { AppBar, Box, Toolbar, Typography, IconButton, MenuItem, Menu, Avatar, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function Header() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const dispatch = useDispatch()
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('profile')))
    }, [location])

    const logout = () => {
        dispatch({ type: 'LOGOUT' })
        setUser(null);
        navigate('/')
    }

    useEffect(() => {
        const token = user?.token
        //If token expires, logout the user
        if (token) {
            const decodedToken = decode(token)
            if (decodedToken.exp * 1000 < new Date().getTime()) logout()
        }
        // eslint-disable-next-line
    }, [location, user]);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const openLink = (link) => {
        navigate(`/${link}`)
        setAnchorEl(false);
    }

    if (!user) return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color='default'>
                <Toolbar>
                    <Typography onClick={() => { navigate('/') }} variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Invoicing Application
                    </Typography>
                    <Button onClick={() => navigate('/Login')} color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
        </Box>
    )
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color='default'>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography onClick={() => { navigate('/') }} variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Invoicing App
                    </Typography>
                    {user && (
                        <div>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <Avatar style={{ backgroundColor: '#1976D2' }}>{user?.result?.name?.charAt(0)}</Avatar>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => openLink('')}>{(user?.result?.name)?.split(" ")[0]}</MenuItem>
                                <MenuItem onClick={() => openLink('settings')}>Settings</MenuItem>
                                <MenuItem onClick={() => logout()} >Logout</MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
