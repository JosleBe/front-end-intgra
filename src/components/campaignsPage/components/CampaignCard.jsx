import React, { useEffect, useState } from 'react';
import { Button, Typography } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import UserService from '../../../service/UserService';

const CampaignCard = ({ titulo, descripcion, imagen, categoria, cantidad, id, templateEntity, estado, recurso }) => {

    console.log("templateEntity", templateEntity)
    const [showActions, setShowActions] = useState(false); // Estado para manejar la visibilidad de los botones de acciones
    const navigate = useNavigate();
    const [estadoCampana, setEstadoCampana] = useState(estado);
    // Función para manejar el click en "Acciones"
    const toggleActions = (e) => {
        e.stopPropagation();  // Evita que el click dispare el onClick de la tarjeta
        setShowActions(prev => !prev);  // Alterna la visibilidad de los botones
    };
    useEffect(() => {
        console.log("isAdmin:", UserService.isAdmin());  // Verifica el valor

      }, [UserService.isAdmin]);

    // Acción de "Ver Historial"
    const verHistorial = (e) => {
        e.stopPropagation();  // Detener la propagación del clic
        navigate(`/record/${id}`, {
            state: {
                id: id,
                cantidad: cantidad,
                nombre: titulo,
                imagen: imagen,
                recurso: recurso
            }
        });
    };
    const handleChangeStatus = async (e) => {
        e.stopPropagation();  // Evita la propagación del evento si es necesario

        // Confirmar acción antes de proceder
        const confirmResult = await Swal.fire({
            title: '¿Cambiar estado de la campaña?',
            text: `¿Estás seguro de que deseas ${estadoCampana ? 'desactivar' : 'activar'} la campaña?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, cambiar estado',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: 'black',
            cancelButtonColor: 'gray',
        });

        if (!confirmResult.isConfirmed) return; // Si no confirma, no hacer nada

        try {
            const response = await axios.patch(
                `http://localhost:8080/api/campaign/${id}/status/${!estadoCampana}`,
                {}, // Asegúrate de que 'id' sea el id correcto de la campaña

                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`, // Token de autenticación
                    }
                }
            );

            if (response.status === 200) {
                // Si la respuesta es exitosa, actualizamos el estado local
                setEstadoCampana(!estadoCampana);

                Swal.fire({
                    title: 'Éxito',
                    text: `La campaña ha sido ${estadoCampana ? 'desactivada' : 'activada'} correctamente.`,
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                }).then(() => {
                    // Recargar la página después de la alerta
                    window.location.reload();
                })
            }
        } catch (error) {
            console.error('Error al actualizar el estado de la campaña:', error);

            Swal.fire({
                title: 'Error',
                text: 'Hubo un error al actualizar el estado de la campaña.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    };

    return (
        <>
        {templateEntity.codigo === "001" ? (
          <div className={`bg-white shadow-md rounded-lg overflow-hidden flex flex-col relative ${UserService.isAdmin() ? 'h-96' : 'h-80'}`}>
                {/* Imagen con categoría sobrepuesta */}
                <div className="relative w-full h-40">
                    <img
                        src={imagen}
                        alt={titulo}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded-md shadow-md">
                        {categoria}
                    </div>
                </div>
    
                {/* Contenido */}
                <div className="p-2 flex flex-col flex-grow overflow-hidden">
                    {/* Título */}
                    <h3  className="text-lg font-bold text-gray-900 text-center mb-2 line-clamp-2 ">
                        {titulo}
                    </h3>
    
                    {/* Descripción con altura fija y recorte de texto */}
                    {descripcion && (
                        <div className="text-gray-700 text-base text-center mb-2 h-16 text-ellipsis">
                            <p className="line-clamp-3">{descripcion}</p>
                        </div>
                    )}  
    
                    {UserService.isAdmin() === true && (
                        <div className="mt-2 flex justify-center">
                            <Button
                                size="sm"
                                className="rounded-full"
                                style={{ background: '#896447', color: 'white', fontSize: '14px' }}
                                onClick={toggleActions}
                            >
                                {showActions ? 'Ocultar acciones' : 'Acciones'}
                            </Button>
                        </div>
                    )}
    
                    {/* Condicionalmente mostrar botones de Editar y Ver Historial */}
                    {showActions && (
                        <div className="bg-gray-100 p-2 mt-2 gap-1 flex justify-between">
                            {/* Botón Finalizar Campaña */}
                            <Button
                                size="sm"
                                color="black"
                                className="rounded-full"
                                style={{
                                    background: 'gray',
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    transition: 'background-color 0.3s ease'
                                }}
                                onClick={handleChangeStatus}
                            >
                                {estadoCampana ? 'Finalizar campaña' : 'Reanudar campaña'}
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
        ) :
        templateEntity.codigo === "002" ? (
            <div className={`bg-white shadow-md rounded-lg overflow-hidden flex flex-col relative ${UserService.isAdmin() ? 'h-96' : 'h-80'}`}>
                {/* Imagen con overlay de degradado */}
                <div className="relative w-full h-40">
                    <img
                        src={imagen}
                        alt={titulo}
                        className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-black text-white text-xs font-semibold px-3 py-1 rounded-md shadow-md">
                        {categoria}
                    </div>
                </div>
    
                {/* Contenido */}
                <div className="p-2 flex flex-col flex-grow overflow-hidden">
                    {/* Título destacado */}
                    <h3 sty className="text-lg font-bold text-gray-900 text-center mb-2 bg-blue-100 px-4 py-1 rounded-lg text-ellipsis line-clamp-2  overflow-hidden shadow-sm ">
                        {titulo}
                    </h3>
    
                    {/* Descripción con diseño elegante */}
                    {descripcion && (
                        <div className="text-gray-700 text-sm text-center mb-2 h-16 overflow-hidden text-ellipsis">
                            <p className="line-clamp-3 text-gray-600 italic">{descripcion}</p>
                        </div>
                    )}
    
                    {UserService.isAdmin() === true && (
                        <div className="mt-4 flex justify-center">
                            <Button
                                size="sm"
                                className="rounded-full"
                                style={{ background: '#896447', color: 'white', fontSize: '14px' }}
                                onClick={toggleActions}
                            >
                                {showActions ? 'Ocultar acciones' : 'Acciones'}
                            </Button>
                        </div>
                    )}
    
                    {/* Condicionalmente mostrar botones de Editar y Ver Historial */}
                    {showActions && (
                        <div className="bg-gray-100 p-2 mt-2 gap-1 flex justify-between">
                            {/* Botón Finalizar Campaña */}
                            <Button
                                size="sm"
                                color="black"
                                className="rounded-full"
                                style={{
                                    background: 'gray',
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    transition: 'background-color 0.3s ease'
                                }}
                                onClick={handleChangeStatus}
                            >
                                {estadoCampana ? 'Finalizar campaña' : 'Reanudar campaña'}
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
        ) :
        templateEntity.code === "003" ? (
            <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-96"> {/* Altura fija de la card */}
                <div className="relative w-full h-40 bg-blue-400 rounded-t-lg">
                    <img src={imagen} alt={titulo} className="w-full h-full object-cover rounded-t-lg" />
                    <div className="absolute inset-0 flex justify-center items-center">
                        <Typography variant="h5" color="blue-gray" className="font-bold text-center text-white">
                            {titulo}
                        </Typography>
                    </div>
                </div>
                <div className="p-2 flex flex-col justify-between flex-grow overflow-hidden">
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
        ) : (<> </>)}
    </>
    
    );
};

export default CampaignCard;
