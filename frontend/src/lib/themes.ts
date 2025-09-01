import { createTheme } from '@mui/material';
const commonColors = {
  primary: {
    main: '#7C4DFF' // Violeta
  },
  secondary: {
    main: '#FF4081' // Rosa
  },
  success: {
    main: '#4CAF50' // Verde
  },
  warning: {
    main: '#FFC107' // Amarillo
  },
  error: {
    main: '#F44336' // Rojo
  },
  info: {
    main: '#2196F3' // Azul
  }
};

export const themeDark = createTheme({
  palette: {
    mode: 'dark',
    ...commonColors,
    background: {
      default: '#121212',
      paper: '#1E1E1E'
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0BEC5'
    }
  }
});

export const themeLight = createTheme({
  palette: {
    mode: 'light',
    ...commonColors,
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#212121',
      secondary: '#757575'
    }
  }
});
