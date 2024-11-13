import { AppBar, Box, Button, Toolbar } from '@mui/material';
import { signOut } from 'firebase/auth';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';

const Navbar = () => {

    const navigate = useNavigate();

    const handleSignout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            // Handl erorr
            console.log(error)
        }
    }

    return (
        <AppBar style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Toolbar>
                <Box display="flex" alignItems="flex-end">
                    <Button onClick={handleSignout} variant="outlined" style={{ color: 'white', border: '1px solid white' }}>Signout</Button>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar