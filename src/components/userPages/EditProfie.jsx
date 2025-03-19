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
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import { NavLink } from 'react-router-dom';
import Link from '@mui/joy/Link';
import Card from '@mui/joy/Card';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useLocation } from 'react-router-dom';
import Button from '@mui/joy/Button';
import { Modal } from "antd";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const EditProfie = () => {
    const location = useLocation();
    const [bgColor, setBgColor] = useState('white');
    const [profileInfo, setProfileInfo] = useState({});
    const [originalProfile, setOriginalProfile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
     const [alignment, setAlignment] = useState("Editar perfil");
        const handleChange = (event, newAlignment) => {
            setAlignment(newAlignment)
        }
    useEffect(() => {
        // Intentamos obtener el perfil desde localStorage
        const storedProfile = JSON.parse(localStorage.getItem('profileInfo'));
        if (storedProfile) {
            // Si el perfil está en el localStorage, lo usamos
            setProfileInfo(storedProfile);
        } else {
    
            fetchProfileInfo();
        }
    }, []);
    const handleMouseEnter = () => {

        setBgColor('#896447');
    };

    const handleMouseLeave = () => {
        // Volver al color original cuando el mouse sale del botón
        setBgColor('white');
    };
    const fetchProfileInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await UserService.getYourProfile(token);
            setProfileInfo(response.user);
            setOriginalProfile(response.user);
            console.log(response.user);
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };

    const showModal = () => {
        setIsModalOpen(true);
      };
    
      const handleOk = async () => {
        try {
          const token = localStorage.getItem('token');
          // Llamada a la API para actualizar
          await UserService.updateUser(profileInfo.id, profileInfo, token ); 
    
          // Después de guardar, recuperamos los datos más recientes del perfil desde la base de datos
          const response = await UserService.getYourProfile(token);
          setProfileInfo(response.user); // Actualizamos el estado con los datos más recientes
    
          // Actualizamos el perfil en localStorage
          localStorage.setItem('profileInfo', JSON.stringify(response.user));
    
          setTimeout(() => {
            setIsModalConfirmOpen(true)
          }, 500 );
          setIsModalConfirmOpen(false)
       
          setIsModalOpen(false); // Cerramos el modal después de actualizar
        } catch (error) {
          console.error('Error updating profile:', error);
          alert('Hubo un error al actualizar el perfil');
          setIsModalOpen(false); // Cerramos el modal si ocurre un error
        }
      };
      const handleConfirmOk = () => {
        setIsModalConfirmOpen(false); // Cerramos el modal de confirmación
      };
    
      const handleConfirmCancel = () => {
        setIsModalConfirmOpen(false); // Cerramos el modal de confirmación
      };
    
      const handleCancel = () => {
        setIsModalOpen(false); // Cerramos el modal sin hacer nada
      };
    
    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setProfileInfo({ ...profileInfo, [name]: value })
    }
    const handleReset = () => {
        if (originalProfile) {
            setProfileInfo(originalProfile);
        }
    };

    return (
        <div>
           
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
                                        Editar perfil
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
                <Stack spacing={4} sx={{ display: 'flex', maxWidth: '100%', mx: 'auto', px: { xs: 2, md: 6 }, py: { xs: 2, md: 3 }, border: 'none' }}>
                    <Card sx={{ p: 3, flexGrow: 1, border: 'none', boxShadow: 'sm', borderRadius: 'md' }}>
                        <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex', border: 'none' }, my: 1 }}>
                            <Stack direction="column" spacing={1}>
                                <AspectRatio ratio="1" maxHeight={200} sx={{ flex: 1, minWidth: 160, borderRadius: '100%' }}>
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
                                    <FormLabel>Editar nombre</FormLabel>
                                    <FormControl sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}>
                                        <Input size="md" placeholder="First name" value={profileInfo.name} name='name' onChange={handleUpdateChange} />
                                        <Input size="md" placeholder="Last name" value={profileInfo.lastName} sx={{ flexGrow: 1 }} name='lastName' onChange={handleUpdateChange} />
                                    </FormControl>
                                </Stack>
                                <Stack direction="row" spacing={2}>
                                    <FormControl>
                                        <FormLabel>Role</FormLabel>
                                        <Input size="md" name='role' value={profileInfo.role} onChange={handleUpdateChange} />
                                    </FormControl>
                                    <FormControl sx={{ flexGrow: 1 }}>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            size="md"
                                            type="email"
                                            startDecorator={<EmailRoundedIcon />}
                                            placeholder="email"
                                            name='email'
                                            value={profileInfo.email}
                                            sx={{ flexGrow: 1 }}
                                            onChange={handleUpdateChange}
                                        />
                                    </FormControl>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <FormControl sx={{ flexGrow: 1 }}>
                                <FormLabel>Teléfono</FormLabel>
                                <Input size="md" type="tel" name='phone' placeholder="Número de teléfono" value={profileInfo.phone} onChange={handleUpdateChange} />
                            </FormControl>
                            <FormControl sx={{ flexGrow: 1 }}>
                                <FormLabel>Dirección</FormLabel>
                                <Input size="md" placeholder="Dirección" name='direccion' value={profileInfo.direccion} onChange={handleUpdateChange} />
                            </FormControl>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <FormControl sx={{ flexGrow: 1 }}>
                                <FormLabel>Fecha de nacimiento</FormLabel>
                                <Input type="date" name="fechaNacimiento" id="" value={profileInfo.fechaNacimiento} onChange={handleUpdateChange} />

                            </FormControl>
                            <FormControl sx={{ flexGrow: 1 }}>
                                <FormLabel>Sexo</FormLabel>
                                <Select size="md" name='sexo' defaultValue={profileInfo.sexo} onChange={handleUpdateChange}>
                                    <Option value="">Opcional</Option>
                                    <Option value="male">Masculino</Option>
                                    <Option value="female">Femenino</Option>
                                    <Option value="other">Otro</Option>
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                            <Button
                                variant="outlined"
                                className="btn-actualizar"
                                style={{
                                    border: '2px solid #896447',
                                    color: 'black',
                                    background: bgColor,
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={handleMouseEnter}  // Al pasar el mouse
                                onMouseLeave={handleMouseLeave}
                                onClick={showModal}  // Al salir el mouse
                            >
                                Actualizar
                            </Button>
                            <Button style={{ background: 'black', cursor: 'pointer' }} onClick={handleReset}>Limpiar</Button>
                        </Stack>
                    </Card>
                </Stack>
                <Modal
                    title="Confirmar cambios"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <p>¿Estás seguro de que deseas guardar los cambios en tu perfil?</p>
                </Modal>
                <Modal
                    title="Actualización exitosa"
                    open={isModalConfirmOpen}
                    onOk={handleConfirmOk}
                    onCancel={handleConfirmCancel}
                >
                </Modal>
            </Box>
        </div>
    );  
};

export default EditProfie;
