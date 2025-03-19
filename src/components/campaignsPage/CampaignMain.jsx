import React, { useEffect, useState } from 'react'

import Box from '@mui/joy/Box';
import axios from 'axios';
import { Button, Typography } from '@material-tailwind/react';
import Navigator from './Navigator';
const CampaignMain = () => {

    const [campaigns, setCampaigns] = useState([]);
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/campaign',
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }

                ); // URL de tu API
                setCampaigns(response.data.data); // Suponiendo que tu respuesta contiene las campañas en 'data'
                console.log(response.data.data)
            } catch (error) {
                console.error('Error al obtener las campañas', error);
            }
        };
        fetchCampaigns();
    }, []);
    const plantillas = [
        {
            nombre: "Moderna Azul",
            codigo: "001",
            categoria: "Moderna",
            componente: ({ titulo, descripcion, imagen, categoria }) => (
                <div className=" bg-white shadow-md rounded-lg overflow-hidden flex flex-col relative">
                    <div className="absolute top-44 left-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-full transform rotate-0 z-10">
                        {`Categoría: ${categoria}`}
                    </div>
                    <div className="bg-black text-white text-center py-2" style={{ minHeight: '50px', overflow: 'auto' }}>
                        <Typography variant="h5" className="font-bold text-ellipsis w-full">
                            {titulo}
                        </Typography>
                    </div>
                    <div className="relative w-full h-40">
                        <img src={imagen} alt={titulo} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2 flex flex-col justify-between flex-grow">
                        {descripcion && (
                            <div className="w-full" style={{ maxHeight: '4rem', overflowY: 'auto' }}>
                                <p color="gray" style={{ width: 255, wordWrap: "break-word" }}>
                                    {descripcion}
                                </p>
                            </div>
                        )}
                        <div className="mt-4 flex justify-center">
                            <Button size="sm" color="black" style={{ background: 'black', color: 'black' }} className="rounded-full">
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
                <Navigator />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {campaigns.map((campana) => {

                        const plantilla = plantillas.find(p => p.codigo === campana.templateEntity?.codigo);
                        if (plantilla) {
                            console.log("hola")
                            return (
                                <Box key={campana.id} sx={{ width: '300px' }}>
                                    {plantilla.componente({
                                        titulo: campana.nombre,
                                        descripcion: campana.descripcion,
                                        imagen: campana.image,
                                        categoria: campana.categoria,
                                    })}
                                </Box>
                            );
                        }
                        return null;
                    })}
                </Box>
            </Box>


        </div>
    )
}

export default CampaignMain
