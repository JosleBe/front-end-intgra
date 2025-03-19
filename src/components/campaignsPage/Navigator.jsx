import Typography from '@mui/joy/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import { NavLink, useLocation } from 'react-router-dom';
import Box from '@mui/joy/Box';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React, { useState } from 'react'


const Navigator = () => {
      const [alignment, setAlignment] = useState("Campañas");
        const handleChange = (event, newAlignment) => {
            setAlignment(newAlignment)
        }
        
    const location = useLocation();
  return (
    <Box sx={{ px: { xs: 2, md: 6 } }}>
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Título Campañas */}
        <Box sx={{ flexShrink: 0 }}>
            <Box
                sx={{
                    position: 'sticky',
                    top: { sm: -100, md: -110 },
                    bgcolor: 'background.body',
                    zIndex: 9995,
                }}
            >
                <Box sx={{ px: { xs: 2, md: 6 } }}>
                    <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2, color: 'black' }}>
                        Campañas
                    </Typography>
                </Box>
            </Box>
        </Box>

        {/* Botones de navegación */}
        <Box sx={{ width: 'auto' }}>
            <ToggleButtonGroup
                value={alignment}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
                sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
            >
                <ToggleButton
                    value="web"
                    sx={{
                        bgcolor: location.pathname === '/campaigns' ? 'black' : 'transparent', // Fondo personalizado
                        color: location.pathname === '/campaigns' ? 'white' : 'black', // Texto con color personalizado
                        borderRadius: '20px', // Bordes redondeados
                        padding: '10px 20px', // Espaciado interno
                        fontSize: 16,
                        fontWeight: 500,
                        textTransform: 'none',
                        '&:hover': {
                            bgcolor: location.pathname === '/campaigns' ? 'black' : 'rgba(0, 0, 0, 0.1)', // Fondo más oscuro al hover
                            color: 'white', // Cambiar el color del texto al hacer hover
                        },
                        transition: 'all 0.3s ease', // Transición suave
                    }}
                >
                    <NavLink to="/campaigns" style={{ textDecoration: 'none' }}>
                        <Typography sx={{ color: location.pathname === '/campaigns' ? 'white' : 'black' }}>
                            Campañas
                        </Typography>
                    </NavLink>
                </ToggleButton>

                <ToggleButton
                    value="android"
                    sx={{
                        bgcolor: location.pathname === '/campaigns-register' ? 'black' : 'transparent', // Fondo personalizado
                        color: location.pathname === '/campaigns-register' ? 'white' : 'black', // Texto con color personalizado
                        borderRadius: '20px', // Bordes redondeados
                        padding: '10px 20px', // Espaciado interno
                        fontSize: 16,
                        fontWeight: 500,
                        textTransform: 'none',
                        '&:hover': {
                            bgcolor: location.pathname === '/campaigns-register' ? 'black' : 'rgba(0, 0, 0, 0.1)', // Fondo más oscuro al hover
                            color: 'white', // Cambiar el color del texto al hacer hover
                        },
                        transition: 'all 0.3s ease', // Transición suave
                    }}
                >
                    <NavLink to="/campaigns-register" style={{ textDecoration: 'none' }}>
                        <Typography  sx={{ color: location.pathname === '/campaigns-register' ? 'black' : 'black', }}>
                            Registrar campañas
                        </Typography>
                    </NavLink>
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    </Box>
    
</Box>
  )
}

export default Navigator
