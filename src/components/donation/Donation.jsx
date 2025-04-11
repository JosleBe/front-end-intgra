import { Progress } from '@material-tailwind/react';
import { Box, Typography } from '@mui/joy';
import { Pagination, Table, Card, Tabs, Input, Button } from 'antd';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';

const Donation = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [perPage] = useState(5);
    const [filteredDonations, setFilteredDonations] = useState([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [searchDonors, setSearchDonors] = useState('');

  
    const handleAcceptDonation = async (filteredDonations, id) => {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No se encontró un token de autenticación");
      
          // Enviar la donación al backend
          const donationResponse = await fetch("http://localhost:8080/api/donations/insumo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              donorId: filteredDonations.donorId,
              campaignId: filteredDonations.campaignId,
              email: filteredDonations.email,
              phone: filteredDonations.phone,
              name: filteredDonations.name,
              donaciones: filteredDonations.object?.articulos ?? [], // Siempre array
            }),
          });
      
          if (!donationResponse.ok) {
            const errorText = await donationResponse.text();
            throw new Error(`Error al registrar la donación: ${errorText}`);
          }
      
          // Eliminar la pre-donación
          const deleteResponse = await fetch(`http://localhost:8080/api/pre-donation/deleteById/${id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
      
          if (!deleteResponse.ok) {
            const errorText = await deleteResponse.text();
            throw new Error(`Error al eliminar la pre-donación: ${errorText}`);
          }
      
          // Éxito: mostrar mensaje y recargar
          Swal.fire({
            title: 'Donación aceptada',
            text: 'La donación fue registrada y la pre-donación eliminada correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            window.location.reload();
          });
      
        } catch (error) {
          console.error("❌ Error:", error);
          Swal.fire({
            title: 'Error',
            text: error.message || 'Ocurrió un error al procesar la donación.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      };

    const handleExpand = (record) => {
        setExpandedRowKeys(expandedRowKeys.includes(record.id) ? [] : [record.id]);
    };
    const donationsColumns = [

        { title: 'Donante', dataIndex: 'name', key: 'name' },
        { title: 'Correo', dataIndex: 'email', key: 'email' },
        { title: 'Teléfono', dataIndex: 'phone', key: 'phone' },
        {
            title: 'Cantidad',
            dataIndex: 'object',
            key: 'object',
            render: (_, record) => {
              // Extraer el arreglo de artículos dentro de 'object'
              const articulos = record.object?.articulos || [];
      
              // Si hay artículos, mostrar la cantidad del primer artículo o sumar las cantidades
              if (articulos.length > 0) {
                return articulos.reduce((total, articulo) => total + articulo.cantidad, 0);  // Suma las cantidades de todos los artículos
              }
              return 0;  // Si no hay artículos, retornamos 0
            },
          },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Button
                    type="default"
                    style={{ backgroundColor: 'black', color: 'white', borderColor: '#4CAF50' }}
                    onClick={() => handleAcceptDonation(record, record.id)}
                >
                    Aceptar
                </Button>
            )
        },
        {

            key: 'actions',
            render: (_, record) => (
                <Button style={{color: 'black', fontWeight: 'revert'}} type="dashed" onClick={() => handleExpand(record)}>
                    Ver artículos
                </Button>
            ),
        },
    ];
    // Simulando la consulta a la API
    useEffect(() => {
        const fetchDonations = async () => {
            setLoading(true);

            try {
                const response = await fetch('http://localhost:8080/api/pre-donation/pending', {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {  // Verificamos si la respuesta es correcta
                    throw new Error('Error al obtener las donaciones');
                }

                const data = await response.json();
                setFilteredDonations(data);

            } catch (error) {
                console.error("Error al obtener las donaciones:", error); // Mejor manejo de errores
            } finally {
                setLoading(false);  // Desactivamos el loading al finalizar
            }
        };

        fetchDonations();  // Ejecutamos la función asíncrona
    }, []);


    return (
        
        <div className='p-3'>
            <Box sx={{ px: { xs: 2, md: 6 } }}>
                <Typography level="h2" component="h1" sx={{ mb: 2, color: 'black' }}>
                    Donaciones
                </Typography>
            </Box>
            <div className='flex flex-row justify-between items-center p-1'>
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
                        <p className='font-medium text-sm'>Atiende las solicitudes de donaciones enviadas por los usuarios.</p>
                    </Typography>
                </Box>
                <div className='flex-1'>
                    <div style={{ backgroundColor: 'black' }} className="p-2 rounded-lg shadow-md flex items-center justify-center h-16 w-1/2 mx-auto">
                        <h1 className='text-white font-semibold'>Solitudes de donaciones: {filteredDonations.length}</h1>
                    </div>
                </div>
            </div>

            <div style={{ padding: '10px 10px 0px 10px', width: '100%' }} className="flex flex-col items-center justify-center">
                <div className="mb-4 ">
                    <Input
                        placeholder="Buscar por correo electrónico"
                        value={searchDonors}
                        onChange={(e) => setSearchDonors(e.target.value)}
                        style={{ width: '300px' }}
                    />
                </div>
                <Card title="Historial de Donaciones Pendientes" >

                    <Table
                        dataSource={filteredDonations.slice((page - 1) * perPage, page * perPage)}
                        columns={donationsColumns}
                        pagination={false}
                        rowKey="id"
                        bordered
                        scroll={{ y: 200 }}
                        loading={loading}
                        expandable={{
                            expandedRowKeys,
                            onExpand: (_, record) => handleExpand(record),
                            expandedRowRender: (record) => (
                                <ul className="space-y-3">
                                {record.object?.articulos?.map((articulo, index) => (
                                  <li key={index} className="p-3 bg-white rounded-lg shadow-md flex justify-between items-center">
                                    <div className="flex flex-col w-full">
                                      <p className="text-base font-semibold text-gray-800">{articulo.nombre}</p>
                                      <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-600">Cantidad:</span>
                                        <span className="font-medium text-black">{articulo.cantidad}</span>
                                      </div>
                                    </div>
                                    <div className="flex justify-end">
                                      {/* Aquí puedes agregar un ícono o botón si es necesario */}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ),
                        }}
                    />
                    <Pagination
                        current={page}
                        pageSize={perPage}
                        onChange={(page) => setPage(page)}
                        total={filteredDonations.length}
                        loading={loading}
                    />
                </Card>
            </div>
            
        </div>
    );
}

export default Donation
