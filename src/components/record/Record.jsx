
import { Box, FormControl, Input, Menu, MenuItem, Select, TextField } from '@mui/joy'
import Typography from "@mui/joy/Typography";
import React, { useEffect, useState } from 'react'
import CampaignService from '../../service/CampaignService'
import { Button } from '@material-tailwind/react';
import { Link, useNavigate } from 'react-router-dom';
const Record = () => {
    const navigate = useNavigate();
    const [campaigns, setCampaign] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState(''); // Almacena el filtro seleccionado
    const [anchorEl, setAnchorEl] = useState(null); // Controla la apertura del menú
    const [selectedRecurso, setSelectedRecurso] = useState('');
    const getAllCampaigns = async () => {
        try {
            const token = localStorage.getItem("token");
            const data = await CampaignService.getAllCampaigns(token);
            if (data) {
                setCampaign(data);
            }
        } catch (error) {
            console.log("Error al obtner las campañas", error);
        }
    }
    useEffect(() => {
        getAllCampaigns()
    }, [])
    // Filtrar campañas según el término de búsqueda y el filtro seleccionado
    const filteredCampaigns = campaigns.filter((campaign) => {
        if (!selectedFilter) return true; // Si no se ha seleccionado filtro, muestra todas las campañas
        const fieldValue = campaign[selectedFilter]?.toLowerCase() || ''; // Obtiene el valor del campo seleccionado
        return fieldValue.includes(searchTerm.toLowerCase() || selectedRecurso.toLowerCase()); // Filtra por el valor y el término de búsqueda
    });

    const handleClickButton = (event) => {
        setAnchorEl(event.currentTarget); // Abre el menú
    };

    const handleCloseMenu = () => {
        setAnchorEl(null); // Cierra el menú
    };

    const handleRecursoSelect = (recurso) => {
        setSelectedRecurso(recurso);
        setSearchTerm(''); // Resetear búsqueda al seleccionar un recurso
        setAnchorEl(null); // Cerrar el menú de recursos
    };
    const handleFilterSelect = (filter) => {
        setSelectedFilter(filter);
        setSelectedRecurso(''); // Resetear recurso cuando cambie el filtro
        setSearchTerm(''); // Resetear búsqueda al cambiar el filtro
        setAnchorEl(null); // Cerrar el menú
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Actualiza el término de búsqueda
    };

    return (
        <Box sx={{ px: { xs: 2, md: 6 } }}>

            <Box sx={{ flexShrink: 0 }}>
                <Box
                    sx={{
                        position: 'sticky',
                        top: 0,
                        bgcolor: 'background.body',
                        zIndex: 9995,
                    }}
                >
                    <Box sx={{ px: { xs: 2, md: 6 } }}>
                        <Typography level="h2" component="h1" sx={{ mb: 2, color: 'black' }}>
                            Historial
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        {/* Caja con el texto */}
                        <Box
                            sx={{
                                flex: 1,
                                bgcolor: "background.level3",
                                p: 2,
                                borderRadius: "sm",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <Typography level="body2" sx={{ fontSize: 14, color: "text.secondary" }}>
                                Consulta el historial de donaciones y participantes de esta campaña. Aquí podrás ver cada aporte realizado, junto con la información de quienes han contribuido.
                            </Typography>
                        </Box>


                        {/* Botón Filtrar por */}
                        <Box sx={{ display: 'flex', gap: 2, flex: 1, justifyContent: "center", height: '30px', alignItems: 'center', mt: 4 }}>
                            <Button
                                variant="outlined"
                                onClick={handleClickButton}
                                sx={{
                                    fontSize: '12px',

                                }}
                            >
                                Filtrar por
                            </Button>

                            {/* Menú desplegable */}
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleCloseMenu}
                            >
                                <MenuItem onClick={() => handleFilterSelect('nombre')}>Nombre</MenuItem>
                                <MenuItem onClick={() => handleFilterSelect('categoria')}>Categoría</MenuItem>
                                <MenuItem onClick={() => handleFilterSelect('recursoTipo')}>Recurso</MenuItem>
                            </Menu>

                            {/* Campo de búsqueda que se muestra cuando se selecciona un filtro */}


                            {selectedFilter === 'recursoTipo' && (
                                <FormControl variant="outlined" fullWidth sx={{ width: { xs: '80%', md: '350px' } }}>
                                 
                                    <Select
                                        value={selectedRecurso}
                                        label="Seleccionar Recurso"
                                        placeholder="Selecciona un recurso "
                                        vae
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                                padding: '8px 12px',
                                                fontSize: '14px',
                                                '& fieldset': {
                                                    borderWidth: 1,
                                                },
                                            },
                                        }}
                                    >
                                        
                                        <MenuItem onClick={() => handleRecursoSelect("Insumo")} value="insumos">Insumos</MenuItem>
                                        <MenuItem onClick={() => handleRecursoSelect("Monetario")} value="monetario">Monetario</MenuItem>
                                    </Select>
                                </FormControl>
                            )}


                            {selectedFilter !== "recursoTipo" && (
                                <Input
                                    label={`Buscar por ${selectedFilter}`}
                                    variant="outlined"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    placeholder={`Escribe ${selectedFilter}...`} // Cambia el placeholder dinámicamente
                                    sx={{
                                        width: { xs: '80%', md: '350px' },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                            padding: '8px 12px',  // Aumento leve en padding para un input más delgado
                                            fontSize: '14px',  // Fuente más pequeña para hacerlo más fino
                                            '& fieldset': {
                                                borderWidth: 1,  // Borde más fino
                                            },
                                        },
                                    }}
                                />
                            )}

                        </Box>
                    </Box>
                </Box>
            </Box>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
                {filteredCampaigns.map((campaign) => (
                <div
                key={campaign.id}
                onClick={() => navigate(`/record/${campaign.id}`, {
                    state: {
                        id: campaign.id,
                        cantidad: campaign.cantidad,
                        nombre: campaign.nombre,
                        imagen: campaign.image
                    }
                })} // Navega al componente pasando el id de la campaña
                className="bg-white border border-gray-300 rounded-xl shadow-md p-3 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 flex flex-col cursor-pointer"
            >
                        <div className="flex items-center gap-4">
                            {/* Imagen */}
                            <img
                                src={campaign.image}
                                alt={campaign.nombre}
                                className="w-20 h-20 object-cover rounded-lg border border-gray-300 dark:border-gray-600 flex-shrink-0"
                            />

                            {/* Contenedor de texto */}
                            <div className="flex-1 min-w-0">
                                <h5 className="text-base font-bold text-gray-900 dark:text-white truncate">
                                    {campaign.nombre}
                                </h5>

                                <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                    <p className="truncate"><span className="font-medium">Categoría:</span> {campaign.categoria}</p>
                                    <p className="truncate"><span className="font-medium">Recurso:</span> {campaign.recursoTipo}</p>
                                    <p className="truncate"><span className="font-medium">Cantidad:</span> {campaign.cantidad}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </Box>
    )
}

export default Record
