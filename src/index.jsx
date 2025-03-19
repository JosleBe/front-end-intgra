import React from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';
import App from './App.jsx';
import {  ThemeProvider } from '@material-tailwind/react';


createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </React.StrictMode>
);