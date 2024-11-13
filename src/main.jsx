import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material'
import { brown, orange, red } from '@mui/material/colors'

const lightTheme = createTheme({
  palette: {
      mode: 'light',
      background: {
          paper: brown[400]
      },
      primary: {
          main: brown[400]
      },
      secondary: {
          main: red[200]
      }   
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: 'white',
          borderColor: 'white'
        }
      }
    }
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ThemeProvider theme={lightTheme}>
      <App />
    </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
