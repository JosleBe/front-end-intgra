import React, { useState, useEffect } from 'react';
import UserService from '../../service/UserService.js';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Typography from '@mui/joy/Typography';
import { Navigate, NavLink } from 'react-router-dom';
import Card from '@mui/joy/Card';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useLocation } from 'react-router-dom';
import ChangePassword from './ChangePassword.jsx';
import { useNavigate } from "react-router-dom";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState({});
    const [token, setToken] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [alignment, setAlignment] = useState("Mi perfil");
    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment)
    }
    useEffect(() => {
        const token = localStorage.getItem("token");
        setToken(token);
        // Intentamos obtener el perfil desde localStorage
        const storedProfile = JSON.parse(localStorage.getItem('profileInfo'));

        if (storedProfile) {
            // Si el perfil está en el localStorage, lo usamos
            setProfileInfo(storedProfile);

        } else {
            // Si no está en el localStorage, hacemos la llamada a la API
            fetchProfileInfo();
        }
    }, []);

    const fetchProfileInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            setToken(token);
            const response = await UserService.getYourProfile(token);

            // Almacenar la respuesta en localStorage para evitar futuras llamadas innecesarias
            localStorage.setItem('profileInfo', JSON.stringify(response.user));
            setProfileInfo(response.user);
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };
    return (
        <>
            {token !== " " && token !== null ? (
                <Box sx={{ flex: 1, width: '100%' }}>
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
                                            Mi perfil
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
                                            bgcolor: location.pathname === '/profile' ? '#896447' : 'transparent', // Fondo personalizado
                                            color: location.pathname === '/profile' ? 'white' : '#896447', // Texto con color personalizado
                                            borderRadius: '20px', // Bordes redondeados
                                            padding: '10px 20px', // Espaciado interno
                                            fontSize: 16,
                                            fontWeight: 500,
                                            textTransform: 'none',
                                            
                                            '&:hover': {
                                                bgcolor: location.pathname === '/profile' ? '#6f4f33' : 'rgba(0, 0, 0, 0.1)', // Fondo más oscuro al hover
                                                color: 'white', // Cambiar el color del texto al hacer hover
                                            },
                                            transition: 'all 0.3s ease', // Transición suave
                                        }}
                                    >
                                        <NavLink to="/profile" style={{ textDecoration: 'none' }}>
                                            <Typography sx={{ color: location.pathname === '/profile' ? 'white' : '#896447' }}>
                                                Mi perfil
                                            </Typography>
                                        </NavLink>
                                    </ToggleButton>

                                    <ToggleButton
                                        value="android"
                                        sx={{
                                            bgcolor: location.pathname === '/editProfile' ? '#896447' : 'transparent', // Fondo personalizado
                                            color: location.pathname === '/editProfile' ? 'white' : '#896447', // Texto con color personalizado
                                            borderRadius: '20px', // Bordes redondeados
                                            padding: '10px 20px', // Espaciado interno
                                            fontSize: 16,
                                            fontWeight: 500,
                                            textTransform: 'none',
                                            '&:hover': {
                                                bgcolor: location.pathname === '/editProfile' ? '#6f4f33' : 'rgba(0, 0, 0, 0.1)', // Fondo más oscuro al hover
                                                color: 'white', // Cambiar el color del texto al hacer hover
                                            },
                                            transition: 'all 0.3s ease', // Transición suave
                                        }}
                                    >
                                        <NavLink to="/editProfile" style={{ textDecoration: 'none' }}>
                                            <Typography sx={{ color: location.pathname === '/editProfile' ? 'white' : '#896447' }}>
                                                Editar perfil
                                            </Typography>
                                        </NavLink>
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                        </Box>
                    </Box>

                    <Stack
                        direction="row"
                        spacing={4}
                        sx={{ display: 'flex', maxWidth: '100%', mx: 'auto', px: { xs: 3, md: 6 }, border: 'none',  py: { xs: 2, md: 3 } }}
                    >
                        {/* Formulario */}
                        <Card sx={{ p: 3, flex: 1, border: 'none', width: 400, background: '#F1F0EC'}}>
                            <Stack
                                direction="row"
                                spacing={3}
                                sx={{ display: { xs: 'none', md: 'flex' }, my: 1 }}
                            >
                                <Stack direction="column" spacing={1}>
                                    <AspectRatio
                                        ratio="1"
                                        maxHeight={300}
                                        sx={{ flex: 1, minWidth: 160, borderRadius: '100%' }}
                                    >
                                        <img
                                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                                            srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
                                            loading="lazy"
                                            alt=""
                                        />
                                    </AspectRatio>
                                    <IconButton
                                        aria-label="upload new picture"
                                        size="sm"
                                        variant="outlined"
                                        color="neutral"
                                        sx={{
                                            bgcolor: 'background.body',
                                            position: 'absolute',
                                            zIndex: 2,
                                            borderRadius: '50%',
                                            left: 100,
                                            top: 170,
                                            boxShadow: 'sm',
                                        }}
                                    >
                                        <EditRoundedIcon />
                                    </IconButton>
                                </Stack>
                                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                                    <Stack spacing={1}>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl
                                            sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                                        >
                                            <Input size="sm" placeholder="First name" value={profileInfo.name} readOnly={true} />
                                            <Input size="sm" placeholder="Last name" value={profileInfo.lastName} sx={{ flexGrow: 1 }} readOnly={true} />
                                        </FormControl>
                                    </Stack>
                                    <Stack direction="row" spacing={2}>
                                        <FormControl>
                                            <FormLabel>Role</FormLabel>
                                            <Input size="sm" defaultValue="UI Developer" value={profileInfo.role} readOnly={true} />
                                        </FormControl>
                                        <FormControl sx={{ flexGrow: 1 }}>
                                            <FormLabel>Correo electronico</FormLabel>
                                            <Input
                                                size="sm"
                                                type="email"
                                                startDecorator={<EmailRoundedIcon />}
                                                placeholder="email"
                                                defaultValue="siriwatk@test.com"
                                                value={profileInfo.email}
                                                readOnly={true}
                                                sx={{ flexGrow: 1 }}
                                            />
                                        </FormControl>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                <FormControl sx={{ flexGrow: 1 }}>
                                    <FormLabel>Teléfono</FormLabel>
                                    <Input size="md" type="tel" placeholder="Número de teléfono" value={profileInfo.phone} readOnly={true} />
                                </FormControl>
                                <FormControl sx={{ flexGrow: 1 }}>
                                    <FormLabel>Dirección</FormLabel>
                                    <Input size="md" placeholder="Dirección" value={profileInfo.direccion} readOnly={true} />
                                </FormControl>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                <FormControl sx={{ flexGrow: 1 }}>
                                    <FormLabel>Fecha de nacimiento</FormLabel>
                                    <Input type="date" name="" id="" value={profileInfo.fechaNacimiento} readOnly={true} />
                                </FormControl>
                                <FormControl sx={{ flexGrow: 1 }}>
                                    <FormLabel>Sexo</FormLabel>
                                    <Select size="md" defaultValue={profileInfo.sexo} value={profileInfo.sexo} readOnly={true}>
                                        <Option value="">Opcional</Option>
                                        <Option value="male">Masculino</Option>
                                        <Option value="female">Femenino</Option>
                                        <Option value="other">Otro</Option>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </Card>
                    </Stack>
                    <ChangePassword />
                </Box>
            ) : (
                <Navigate to={"/pageError"} />
            )}
        </>
    );
}

export default ProfilePage;
