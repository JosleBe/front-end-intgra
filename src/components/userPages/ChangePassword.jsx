import Box from '@mui/joy/Box'
import React from 'react'
import Button from '@mui/joy/Button'
import Card from '@mui/joy/Card'
import FormLabel from '@mui/joy/FormLabel'
import Input from '@mui/joy/Input'
import Stack from '@mui/joy/Stack'
import Typography from '@mui/joy/Typography'


const ChangePassword = () => {
    return (
        <Box sx={{ width: '100%' }}>
            <Stack spacing={4} sx={{ width: '100%', px: { xs: 2, md: 6 }, py: { xs: 1.5 } }}>
                <Card sx={{ px: 3, py: 2, width: '100%', background: '#F1F0EC',border:'none' }}>
                    <Typography level="h5" sx={{ color: 'black', fontWeight: 500 }}>
                        Cambiar contraseña
                    </Typography>
                    <Stack direction="row" spacing={3} sx={{ width: '100%', alignItems: 'center' }}>
                        <Box sx={{ flex: 1 }}>
                            <Input
                                size="md"
                                type="email"
                                placeholder="Contraseña actual"
                                sx={{ flexGrow: 1 }}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Input
                                size="md"
                                type="email"
                                placeholder="Nuevo contraseña"
                                sx={{ flexGrow: 1 }}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>

                            <Input
                                size="md"
                                type="email"
                                placeholder="Confirmar nueva contraseña"
                                sx={{ flexGrow: 1 }}
                            />
                        </Box>
                    </Stack>
                    <Button variant="contained" sx={{ width: '20%', background: '#896447', color: 'white', mx: 'auto' }}>
                        Cambiar contraseña
                    </Button>
                </Card>
            </Stack>
        </Box>
    )
}

export default ChangePassword
