import React from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';
import App from './App.jsx';
import { ThemeProvider } from '@material-tailwind/react';
import { AuthProvider } from './layouts/AuthProvider.jsx';


createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ThemeProvider>
    </React.StrictMode>
);