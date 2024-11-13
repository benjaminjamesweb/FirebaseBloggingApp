import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import { Box, Button, Typography } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import Alert from '../components/Alert';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorCode } from '../utils';

const SignupPage = () => {

    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const [alertConfig, setAlertConfig] = useState({});
    const navigate = useNavigate();

    const handleSignup = async () => {
        
        try {
            const { user } = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
            setAlertConfig({...alertConfig, message:'Succesfully Signed up', color: 'success', isOpen: true })

            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (error) {
            const message = getErrorCode(error.code);
            setAlertConfig({...alertConfig, message, color: 'error', isOpen: true })
        }
    }

    return (
        <Box display="flex" flexDirection="column" gap="12px" border="1px solid black" padding="40px" borderRadius="12px">
            <Typography variant="h3">Sign up</Typography>
            <TextField
                required
                id="email"
                label="Email"
                defaultValue=""
                placeholder='Enter your email'
                type='email'
                value={credentials.email}
                onChange={(e) => setCredentials({
                    ...credentials,
                    email: e.target.value
                })}
            />
            <TextField
                required
                id="password"
                label="Password"
                defaultValue=""
                placeholder='Enter your Password'
                type='password'
                value={credentials.password}
                onChange={(e) => setCredentials({
                    ...credentials,
                    password: e.target.value
                })}
            />
            <Button onClick={handleSignup} variant="contained" color="secondary">Sign up</Button>
            <Alert alertConfig={alertConfig} />
            <Link to="/">Already have an account? Signin</Link>
        </Box>
    )
}

export default SignupPage