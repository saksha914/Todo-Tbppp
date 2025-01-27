import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: 'linear-gradient(135deg, #FFFAF0, #FFF2E5)',
      paper: '#FFFFFF',
      card: 'rgba(255, 255, 255, 0.9)', // Slightly translucent for depth
    },
    primary: {
      main: '#8A3FFC', // A vibrant purple
    },
    secondary: {
      main: '#F26D21', // A modern orange accent
    },
    error: {
      main: '#E63946', // Slightly brighter red
    },
    text: {
      primary: '#1A1A1A', // Deep black for strong contrast
      secondary: '#4F4F4F', // Softer gray for secondary text
    },
  },
  shape: {
    borderRadius: 12, // Slightly more rounded for a modern feel
  },
  typography: {
    fontFamily: `'Poppins', 'Roboto', sans-serif`, // Trendy sans-serif fonts
    button: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backgroundImage: 'linear-gradient(135deg, #FFFFFF, #F8F8F8)',
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(138, 138, 138, 0.2)',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
          backgroundImage: 'linear-gradient(90deg, #8A3FFC, #E63946)',
          color: '#FFFFFF',
          '&:hover': {
            backgroundImage: 'linear-gradient(90deg, #E63946, #8A3FFC)',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#8A3FFC',
          '&.Mui-checked': {
            color: '#F26D21',
          },
          borderRadius: 4,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(90deg, #8A3FFC, #F26D21)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(138, 138, 138, 0.2)',
        },
      },
    },
  },
})

export default theme
