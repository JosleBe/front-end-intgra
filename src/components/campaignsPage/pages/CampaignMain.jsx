import React, { useEffect, useRef, useState } from 'react'
import { format } from 'date-fns';
import CampaignService from '../../../service/CampaignService'
import { Button, Typography } from '@material-tailwind/react';
import Navigator from '../components/Navigator';
import { useNavigate, useSearchParams } from 'react-router-dom';
import donationService from '../../../service/payIt';
import { Box, FormControl, Input, Menu, MenuItem, Select, TextField } from '@mui/joy'
import CampaignCard from '../components/CampaignCard';
import axios from 'axios';
import Loader from '../components/Loadder';
import Swal from 'sweetalert2';
import UserService from '../../../service/UserService';

const CampaignMain = () => {
    const [loading, setLoading] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [searchParams] = useSearchParams();
    const status = searchParams.get('status');
    const transactionId = searchParams.get('transactionId');
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const alertShownRef = useRef(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState(''); // Almacena el filtro seleccionado
    const [anchorEl, setAnchorEl] = useState(null); // Controla la apertura del menú
    const [selectedRecurso, setSelectedRecurso] = useState('');
    const [showActions, setShowActions] = useState(false);
    const [isInactive, setIsInactive] = useState(false);
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
        console.log(filter)
        setSelectedFilter(filter);
        setSelectedRecurso(''); // Resetear recurso cuando cambie el filtro
        setSearchTerm(''); // Resetear búsqueda al cambiar el filtro
        setAnchorEl(null); // Cerrar el menú
        if (filter === 'campanasInactivas') {
            setIsInactive(true);
        } else if (filter === 'campanasActivas') {
            setIsInactive(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Actualiza el término de búsqueda
        console.log(e.target.value)
    };
    const filteredCampaigns = campaigns.filter((campaign) => {
        // Si no se ha seleccionado ningún filtro ni término de búsqueda, mostrar todas las campañas activas por defecto
        if (!selectedFilter && !searchTerm && !selectedRecurso) {
            return isInactive ? !campaign.estado : campaign.estado;  // Si isInactive es true, solo se muestran las inactivas
        }

        // Filtrar por estado de la campaña (activa o inactiva)
        if (isInactive) {
            // Solo mostrar campañas inactivas
            if (!campaign.estado) {
                // Realiza la búsqueda solo si hay un término de búsqueda
                if (selectedFilter === 'nombre') {
                    return campaign.nombre.toLowerCase().includes(searchTerm.toLowerCase());
                } else if (selectedFilter === 'categoria') {
                    return campaign.categoria.toLowerCase().includes(searchTerm.toLowerCase());
                } else if (selectedFilter === 'recursoTipo' && selectedRecurso) {
                    return campaign.recursoTipo.toLowerCase() === selectedRecurso.toLowerCase();  // Usamos selectedRecurso aquí
                }
                return true;  // Si no hay término de búsqueda, mostramos todas las inactivas
            }
            return false;  // No mostrar campañas activas si estamos filtrando inactivas
        }

        if (!isInactive) {
            // Solo mostrar campañas activas
            if (campaign.estado) {
                // Realiza la búsqueda solo si hay un término de búsqueda
                if (selectedFilter === 'nombre') {
                    return campaign.nombre.toLowerCase().includes(searchTerm.toLowerCase());
                } else if (selectedFilter === 'categoria') {
                    return campaign.categoria.toLowerCase().includes(searchTerm.toLowerCase());
                } else if (selectedFilter === 'recursoTipo' && selectedRecurso) {
                    return campaign.recursoTipo.toLowerCase() === selectedRecurso.toLowerCase();  // Usamos selectedRecurso aquí
                }
                return true;  // Si no hay término de búsqueda, mostramos todas las activas
            }
            return false;  // No mostrar campañas inactivas si estamos filtrando activas
        }

        // Si no hay filtro específico, buscar solo dentro del campo seleccionado
        const fieldValue = campaign[selectedFilter]?.toLowerCase() || '';
        return fieldValue.includes(searchTerm.toLowerCase() || selectedRecurso.toLowerCase());
    });



    const orderedCampaigns = filteredCampaigns.reverse(); // Ordenar campañas de más reciente a más antigua


    const fecthTranscation = async (id) => {
        if (id) {
            try {
                const data = await donationService.fetchTransactionDetails(id);
                if (data) {
                    const details = {
                        campaignId: data.custom_id,
                        amount: data.amount.value,
                        create_time: data.create_time
                    }
                    await donationService.registerDonation(details)
                }
            } catch (error) {
                console.log("Error al obtener datos sobre la transaccion", error);
            }
        }
    }
    useEffect(() => {
        if (status && !alertShownRef.current) {
            alertShownRef.current = true;

            if (status === 'success') {
                Swal.fire({
                    title: '¡Pago exitoso!',
                    text: `Gracias por su aportación`,
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                    ,
                    confirmButtonColor: 'black',
                }).then(() => {
                    fecthTranscation(transactionId);
                    navigate('/campaigns', { replace: true });
                });

            } else if (status === 'error') {
                Swal.fire({
                    title: 'Error en el pago',
                    text: 'Hubo un error al procesar el pago.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: 'black',
                }).then(() => {
                    navigate('/campaigns', { replace: true });
                });

            } else if (status === 'canceled') {
                Swal.fire({
                    title: 'Pago cancelado',
                    text: 'Has cancelado el proceso de pago.',
                    icon: 'info',
                    confirmButtonText: 'Aceptar'
                    ,
                    confirmButtonColor: 'black',
                }).then(() => {
                    navigate('/campaigns', { replace: true });
                });
            }
        }
    }, [status, transactionId, navigate]);
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const data = await CampaignService.getAllCampaigns();
                setCampaigns(data);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener las campañas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
        fetchProfileInfo();
    }, []);
    let hasReloaded = false;
    const fetchProfileInfo = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await UserService.getYourProfile(token);

            // Almacenar la respuesta en localStorage para evitar futuras llamadas innecesarias
            localStorage.setItem('profileInfo', JSON.stringify(response.user));

            // Si aún no se ha recargado, recargar la página


        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };

    console.log(campaigns.objeto)
    const plantillas = [
        {
            nombre: "Moderna Azul",
            codigo: "001",
            categoria: "Moderna",
            componente: ({ titulo, descripcion, imagen, categoria, cantidad, id }) => {
                // Estado para controlar si se muestran los botones "Editar" y "Ver Historial"


                // Función para manejar el click en "Acciones"
                const toggleActions = (e) => {
                    e.stopPropagation();  // Evita que el click dispare el onClick de la tarjeta
                    setShowActions(prev => !prev);  // Alterna la visibilidad de los botones
                };

                // Acción de "Finalizar campaña"
                const finalizarCampana = (e) => {
                    e.stopPropagation();  // Evita que el click dispare el onClick de la tarjeta
                    // Lógica para finalizar la campaña (por ejemplo, actualizar el estado o redirigir)
                    console.log(`Campaña ${titulo} finalizada.`);
                };

                // Acción de "Ver Historial"
                const verHistorial = (e) => {
                    e.stopPropagation();  // Detener la propagación del clic
                    // Aquí iría la lógica para redirigir al historial
                    navigate(`/record/${id}`, {
                        state: {
                            id: id,
                            cantidad: cantidad,
                            nombre: titulo,
                            imagen: imagen
                        }
                    });
                };

                return (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col relative">

                        {/* Etiqueta de Categoría */}
                        <div className="absolute top-44 left-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-full transform rotate-0 z-10">
                            {`Categoría: ${categoria}`}
                        </div>

                        {/* Titulo de la campaña */}
                        <div className="bg-black text-white text-center py-2" style={{ minHeight: '50px', overflow: 'auto' }}>
                            <Typography variant="h5" className="font-bold text-ellipsis w-full">
                                {titulo}
                            </Typography>
                        </div>

                        {/* Imagen */}
                        <div className="relative w-full h-40">
                            <img src={imagen} alt={titulo} className="w-full h-full object-cover" />
                        </div>

                        {/* Descripción */}
                        <div className="p-2 flex flex-col justify-between flex-grow">
                            {descripcion && (
                                <div className="w-full" style={{ maxHeight: '4rem', overflowY: 'auto' }}>
                                    <p color="gray" style={{ width: 255, wordWrap: "break-word" }}>
                                        {descripcion}
                                    </p>
                                </div>
                            )}

                            {/* Botón Acciones */}
                            <div className="mt-4 flex justify-center">
                                <Button
                                    size="sm"
                                    color="primary"
                                    className="rounded-full"
                                    style={{ background: '#007bff', color: 'white', fontSize: '14px' }}
                                    onClick={toggleActions}
                                >
                                    {showActions ? 'Ocultar acciones' : 'Acciones'}
                                </Button>
                            </div>

                            {/* Condicionalmente mostrar botones de Editar y Ver Historial */}
                            {showActions && (
                                <div className="bg-gray-100 p-2 mt-2 gap-1 flex justify-between">
                                    {/* Botón Finalizar Campaña */}
                                    <Button
                                        size="sm"
                                        color="black"
                                        className="rounded-full"
                                        style={{
                                            background: 'black',
                                            color: 'white',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            border: 'none',
                                            transition: 'background-color 0.3s ease'
                                        }}
                                        onClick={finalizarCampana}
                                    >
                                        Finalizar campaña
                                    </Button>

                                    {/* Botón Ver Historial */}
                                    <Button
                                        size="sm"
                                        color="black"
                                        className="rounded-full"
                                        style={{
                                            background: 'black',
                                            color: 'white',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            border: 'none',
                                            transition: 'background-color 0.3s ease'
                                        }}
                                        onClick={verHistorial}
                                    >
                                        Ver Historial
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            },
        }

        ,
        {
            nombre: "Moderna Azul",
            categoria: "Moderna",
            codigo: "002",
            componente: ({ titulo, descripcion, imagen, categoria }) => (
                <div className=" bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
                    <div className="relative w-full h-40 ">
                        <img src={imagen} alt={titulo} className="w-full h-full object-cover rounded-t-lg" />
                        <div className="absolute inset-0 flex justify-center items-center">
                            <Typography variant="h5" color="blue-gray" className="font-bold text-center text-white">
                                {titulo}
                            </Typography>
                        </div>
                    </div>
                    <div className="p-2 flex flex-col justify-between flex-grow">
                        {descripcion && (
                            <div className="w-full" style={{ maxHeight: '4rem', overflowY: 'auto' }}>
                                <p style={{ wordWrap: "break-word", color: 'gray' }}>
                                    {descripcion}
                                </p>
                            </div>
                        )}
                        <div className="w-full text-center mt-4 mb-2">
                            <Typography variant="h6" className="font-bold text-nowrap h-6 p-1 bg-black text-white text-xs rounded-full">
                                {categoria}
                            </Typography>
                        </div>
                        <div className="mt-4 flex justify-center">
                            <Button size="sm" color="blue-gray" className="rounded-full">
                                Ver Más
                            </Button>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            nombre: "Moderna Azul",
            categoria: "Moderna",
            codigo: "003",
            componente: ({ titulo, descripcion, imagen, categoria }) => (
                <div className=" bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
                    <div className="relative w-full h-40 bg-blue-400 rounded-t-lg">
                        <img src={imagen} alt={titulo} className="w-full h-full object-cover rounded-t-lg" />
                        <div className="absolute inset-0 flex justify-center items-center">
                            <Typography variant="h5" color="blue-gray" className="font-bold text-center text-white">
                                {titulo}
                            </Typography>
                        </div>
                    </div>
                    <div className="p-2 flex flex-col justify-between flex-grow">
                        {descripcion && (
                            <div className="w-full" style={{ maxHeight: '4rem', overflowY: 'auto' }}>
                                <p style={{ wordWrap: "break-word", color: 'gray' }}>
                                    {descripcion}
                                </p>
                            </div>
                        )}
                        <div className="w-full text-center mt-4 mb-2">
                            <Typography variant="h6" className="font-bold text-nowrap h-6 p-1 bg-black text-white text-xs rounded-full">
                                {categoria}
                            </Typography>
                        </div>
                        <div className="mt-4 flex justify-center">
                            <Button size="sm" color="blue-gray" className="rounded-full">
                                Ver Más
                            </Button>
                        </div>
                    </div>
                </div>
            ),
        },
    ];
    return (
        <div>
            <Box sx={{ flex: 1, width: '100%' }}>
                <div className="sticky top-0 z-50 bg-white w-full py-2 shadow-transparent" style={{ background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)' }}>
                    <Box
                        sx={{
                            position: 'sticky',
                            zIndex: 9995,  // Asegura que el componente esté encima de otros elementos
                            bgcolor: 'background.body',  // Asegura que el fondo sea consistente
                        }}
                    >

                        <Navigator />

                    </Box>
                    <div className="flex flex-row justify-between items-center px-4 ">
                        {/* Primer Box (con el texto de la consulta y edición) */}
                        <Box
                            sx={{
                                bgcolor: "background.level3",
                                p: 2,
                                borderRadius: "sm",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',


                            }}
                        >
                            <Typography level="body2" sx={{ fontWeight: "bolder", fontSize: 14 }}>
                                <p className='font-medium text-sm'>Consulta, edita o finaliza tus campañas desde aquí. Puedes ver el historial de cada campaña y realizar acciones específicas.</p>
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                borderRadius: 'sm',

                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Box sx={{ display: 'flex', flex: 1, justifyContent: "center", gap: 2, alignItems: 'center' }}>
                                <Button
                                    variant="filled"
                                    onClick={handleClickButton}
                                    sx={{
                                        fontSize: '12px',
                                    }}
                                >
                                    Filtrar por
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleCloseMenu}
                                >
                                    <MenuItem
                                        onClick={() => handleFilterSelect('nombre')}
                                        sx={{
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            padding: '10px 15px',
                                            '&:hover': {
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                            },
                                        }}
                                    >
                                        Nombre
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleFilterSelect('categoria')}
                                        sx={{
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            padding: '10px 15px',
                                            '&:hover': {
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                            },
                                        }}
                                    >
                                        Categoría
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleFilterSelect('recursoTipo')}
                                        sx={{
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            padding: '10px 15px',
                                            textAlign: 'center',
                                            '&:hover': {
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                            },
                                        }}
                                    >
                                        Recurso
                                    </MenuItem>
                                    { UserService.isAdmin() && // Verifica si el usuario es administrador
                                        <MenuItem
                                            onClick={() => handleFilterSelect(isInactive ? 'campanasActivas' : 'campanasInactivas')} // Cambia el filtro entre activos e inactivos
                                            sx={{
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                padding: '10px 15px',
                                                textAlign: 'center',
                                                '&:hover': {
                                                    backgroundColor: '#007bff',
                                                    color: 'white',
                                                },
                                            }}
                                        >
                                            {isInactive ? 'Campañas Activas' : 'Campañas finalizadas'} {/* Cambia el texto según el estado */}
                                        </MenuItem>
                                    }


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
                    </div>

                </div>
                {loading ? (
                    <Loader />) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', padding: 2 }}>
                        {orderedCampaigns.map((campana) => {
                            { console.log(campana.nombre) }
                            const plantilla = plantillas.find(p => p.codigo === campana.templateEntity?.codigo);
                            if (plantilla) {
                                // Formatear las fechas
                                const formattedStartDate = format(new Date(campana.fechaInicio), 'MMMM yyyy dd');
                                const formattedEndDate = format(new Date(campana.fechaFin), 'MMMM yyyy dd');
                                console.log(formattedStartDate)
                                return (
                                    <Box
                                        key={campana.id}
                                        sx={{
                                            width: '300px',
                                            cursor: 'pointer',
                                            '&:hover': { backgroundColor: '#f0f0f0' },
                                            padding: 2,
                                            borderRadius: 2,
                                            boxShadow: 2,
                                        }}

                                        onClick={() =>
                                            navigate('/view-campaign', {
                                                state: {
                                                    titulo: campana.nombre,
                                                    descripcion: campana.descripcion,
                                                    imagen: campana.image,
                                                    categoria: campana.categoria,
                                                    recurso: campana.recursoTipo,
                                                    startDate: formattedStartDate,
                                                    endDate: formattedEndDate,  // Pasamos las fechas formateadas
                                                    locationmap: campana.location.coordinates,
                                                    address: campana.location.address,
                                                    id: campana.id,
                                                    cant: campana.objeto.cantidad,
                                                    arti: campana.objeto.articulos

                                                },
                                            })
                                        }
                                    >
                                        <CampaignCard
                                            key={campana.id}
                                            titulo={campana.nombre}
                                            descripcion={campana.descripcion}
                                            imagen={campana.image}
                                            categoria={campana.categoria}
                                            cantidad={campana.objeto.cantidad}
                                            id={campana.id}
                                            templateEntity={campana.templateEntity}
                                            estado={campana.estado}
                                            recurso={campana.recursoTipo}
                                        />
                                    </Box>
                                );
                            }
                            return null;
                        })}
                    </Box>
                )}
            </Box >


        </div >

    )
}

export default CampaignMain
