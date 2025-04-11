import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

const ChangePassword = () => {
    // Estados para manejar los campos del formulario
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [email, setEmail] = useState('');

    // Función para mostrar alertas con SweetAlert
    const showAlert = (message, icon) => {
        Swal.fire({
            title: icon === 'error' ? '¡Error!' : 'Éxito',
            text: message,
            icon: icon,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'black',
        });
    };


    // Función para manejar el cambio de contraseña
    const handleChangePassword = async () => {
        // Validaciones de los campos
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return showAlert("Todos los campos son obligatorios.", "error");
        }

        // Validar que la nueva contraseña tiene más de 8 caracteres
        if (newPassword.length <= 8) {
            return showAlert("La nueva contraseña debe tener más de 8 caracteres.", "error");
        }

        // Verificar que la nueva contraseña y la confirmación coincidan
        if (newPassword !== confirmNewPassword) {
            return showAlert("La nueva contraseña y la confirmación no coinciden.", "error");
        }

        // Datos a enviar al backend
        const data = {
            email: JSON.parse(localStorage.getItem("profileInfo")).email, // Suponiendo que el email está guardado en localStorage
            password: currentPassword,
            newPassword: newPassword,
        };

        try {
            const response = await axios.put('http://localhost:8080/api/change-password', data, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`, // Suponiendo que usas un token de autenticación
                },
            });

            if (response.status === 200) {
                showAlert("🎉 Contraseña cambiada exitosamente.", "success");
                // Aquí puedes resetear los campos si lo deseas
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            }
        } catch (error) {
            console.error("Error al cambiar la contraseña:", error);
            showAlert("❌ Hubo un problema al cambiar la contraseña.", "error");
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stack spacing={4} sx={{ width: '100%', px: { xs: 2, md: 6 },  }}>
                <Card sx={{ px: 3, py: 2, width: '100%', background: '#F1F0EC', border: 'none' }}>
                    <Typography level="h5" sx={{ color: 'black', fontWeight: 500 }}>
                        Cambiar contraseña
                    </Typography>
                    
                    <Stack direction="row" spacing={3} sx={{ width: '100%', alignItems: 'center' }}>
                        <Box sx={{ flex: 1 }}>
                            <Input
                                size="md"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Contraseña actual"
                                sx={{ flexGrow: 1 }}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Input
                                size="md"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nueva contraseña"
                                sx={{ flexGrow: 1 }}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Input
                                size="md"
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                placeholder="Confirmar nueva contraseña"
                                sx={{ flexGrow: 1 }}
                            />
                        </Box>
                    </Stack>
                    <Button
                        variant="contained"
                        sx={{ width: '20%', background: '#896447', color: 'white', mx: 'auto' }}
                        onClick={handleChangePassword}
                    >
                        Cambiar contraseña
                    </Button>
                </Card>
            </Stack>
        </Box>
    );
};

export default ChangePassword;
