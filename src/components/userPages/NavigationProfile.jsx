import Box from '@mui/joy/Box'
import Breadcrumbs from '@mui/joy/Breadcrumbs'
import React from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
const NavigationProfile = () => {
    const location = useLocation();
    return (
        <div>
 
                <Box sx={{ px: { xs: 2, md: 6 } }}>
                    <Breadcrumbs
                        size="sm"
                        aria-label="breadcrumbs"
                        separator={<ChevronRightRoundedIcon fontSize="sm" />}
                        sx={{ pl: 0 }}
                    >
                        <Link
                            to="/profile" // Cambia a la ruta de tu perfil si es necesario
                            sx={{
                                fontSize: 16, fontWeight: 500, color: location.pathname === '/profile' ? 'black' : 'gray', // Si la ruta es /profile, ponlo negro, si no, gris
                            }}
                        >
                            Mi perfil
                        </Link>
                        <Link
                            to="/edit-profile"  // Esta es la ruta de la página de edición de perfil
                            sx={{
                                fontSize: 16, fontWeight: 500, color: location.pathname === '/editProfile' ? 'black' : 'gray', // Si la ruta es /profile, ponlo negro, si no, gris
                            }}
                        >
                            Editar perfil
                        </Link>
                    </Breadcrumbs>
                </Box>

        </div>
    )
}

export default NavigationProfile
