import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Mapa from '../../mapa/Mapa';
import CommentList from '../components/CommentList';

const Campaign = () => {
    
    const location = useLocation();
    const {
        titulo,
        descripcion,
        imagen,
        categoria,
        recurso,
        startDate,
        endDate,
        locationmap,
        id,
        address
    } = location.state || {};

    const { lat, lng } = locationmap;
  
    // Función para formatear las fechas al formato deseado
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    };

    // Función para obtener el día de la fecha
    const getDay = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) {
            return "Fecha inválida"; // Si la fecha no es válida
        }
        return date.getDate();
    };

    // Función para obtener el mes/año de la fecha
    const getMonthYear = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) {
            return "Fecha inválida"; // Si la fecha no es válida
        }
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('es-ES', options);
    };

    return (
        <div className="flex w-full h-full">
            {/* Columna Izquierda */}
            <div className="flex-1 border-gray-300 p-6 space-y-4">
                <h2 className="text-3xl font-bold">{titulo}</h2>

                <div className="flex mt-3 gap-4">
                    {/* Imagen */}
                    <div className="flex-1 flex flex-col items-center">
                        <img src={imagen} alt={titulo} className="rounded-xl shadow-md w-full h-47 object-cover" />
                        <p className="text-black mt-2 font-bold">Categoría: <span>{`${String(categoria).toUpperCase()}`}</span></p>
                        <p className="text-black mt-2 font-bold">Tipo: {`${String(recurso).toUpperCase()}`}</p>
                        <p className="text-gray-600 mt-2 font-bold text-center">Direccion: {address}</p>
                    </div>

                    {/* Información */}
                    <div className="flex-1">
                        <div style={{height: 150, overflow:'hidden', borderRadius: 10}}className="rounded-xl shadow-md w-full bg-cover bg-center ">
                          <Mapa lat={lat} lng={lng} height={150} />
                         
                        </div>
                       
                        <div className="mt-3 space-y-3 flex flex-col">
                            <div className='flex flex-row gap-2 justify-center align-middle'>
                                <div style={{ backgroundColor: '#AFCCD0' }} className="w-14 p-2 rounded-full m-0">
                                    <p className="font-bold text-xl text-center m-1">{getDay(startDate)}</p>
                                </div>
                                <div className='flex flex-col'>
                                    <div style={{ borderTopRightRadius: 7, backgroundColor: '#AFCCD0' }} className='00 p-1 w-32'>
                                        <p className='text-center font-semibold'>{getMonthYear(startDate)}</p>
                                    </div>
                                    <p className='text-center'>Fecha inicio</p>
                                </div>
                            </div>

                            <div className='flex flex-row gap-2 justify-center align-middle'>
                                <div style={{ backgroundColor: '#E0E2CB' }} className="w-14 p-2 rounded-full m-0">
                                    <p className="font-bold text-xl text-center m-1">{getDay(endDate)}</p>
                                </div>
                                <div className='flex flex-col'>
                                    <div style={{ borderTopRightRadius: 7, backgroundColor: '#E0E2CB' }} className='p-1 w-32'>
                                        <p className='text-center font-semibold'>{getMonthYear(endDate)}</p>
                                    </div>
                                    <p className='text-center'>Fecha fin</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Descripción */}
                <h5 className='text-center' style={{ fontWeight: 'bold', color: 'black', fontSize: 18 }}>Descripcion</h5>
                <div className="bg-white p-4 rounded-xl shadow-md h-32 overflow-y-scroll">
                    <p className="text-gray-700">{descripcion}</p>
                </div>

                {/* Barra de progreso */}
                <div className="w-full bg-brown-500 h-11 text-white text-center font-bold py-2 rounded-md">Barra de progreso 100%</div>

                {/* Botones */}
                <div className="w-full flex gap-4 mt-3 h-12 ">
                    <button className="w-full bg-black text-white py-2 rounded-md">Suscribirse a la campaña</button>
                    <button className="w-full bg-black text-white py-2 rounded-md">Realizar donación</button>
                </div>
            </div>

            {/* Columna Derecha */}
            <div className="flex-1 p-6 space-y-6 mt-5">
                {/* Sección de comentarios */}
                <CommentList campaignId={id} />
              
            </div>
        </div>
    );
};

export default Campaign;
