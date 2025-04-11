import React, { useEffect, useState } from 'react';
import { Pagination, Table, Card, Tabs, Input, Button } from 'antd';
import { Box, Typography } from '@mui/joy';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './css/Record.css';
import { Progress } from '@material-tailwind/react';

const { TabPane } = Tabs;

const CampaignDetails = () => {
    const location = useLocation();
    const { id, cantidad, nombre, recurso } = location.state || {};
    const [donations, setDonations] = useState([]);
    const [progress, setProgress] = useState(0);
    const [donationsPage, setDonationsPage] = useState(1);
    const donationsPerPage = 3  ;
    const [participantsPage, setParticipantsPage] = useState(1);
    const participantsPerPage = 3;
    const [activeTab, setActiveTab] = useState('1');
    const [totalDonations, setTotalDonations] = useState(0);
    const CANTIDAD = parseInt(cantidad.replace(/,/g, ''));
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [searchText, setSearchText] = useState('');
      const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    const handleSearch = (e) => {
        setSearchText(e.target.value.toLowerCase());
    };

    const filteredDonations = donations.filter(donation => donation.email.toLowerCase().includes(searchText));
    const filteredBeneficiaries = beneficiaries.filter(beneficiary => beneficiary.email.toLowerCase().includes(searchText));
    useEffect(() => {
        console.log("Total Donaciones:", totalDonations);

        if (CANTIDAD && !isNaN(CANTIDAD) && CANTIDAD > 0) {

            const newProgress = (totalDonations / CANTIDAD) * 100;
            setProgress(Math.min(newProgress, 100));
        }
    }, [totalDonations, CANTIDAD]);

    const handleExpand = (record) => {
        setExpandedRowKeys(expandedRowKeys.includes(record.id) ? [] : [record.id]);
    };
    useEffect(() => {
        const fetchTotal = async () => {
            try {
                const url = recurso === "insumo"
                    ? `http://localhost:8080/api/donations/total-insumos/${id}`
                    : `http://localhost:8080/api/donations/campaign/${id}`;

                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });

                if (recurso === "insumo") {
                    setTotalDonations(response.data);
                } else {
                    const total = response.data.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);
                    setTotalDonations(total);
                }
            } catch (error) {
                console.error("Error al obtener las donaciones:", error);
            }
        };

        fetchTotal();
    }, [id, recurso]);
    useEffect(() => {
        const fetchBeneficiaries = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/beneficiaries/campaign/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setBeneficiaries(response.data);
            } catch (error) {
                console.error('Error al obtener las donaciones:', error);
            }
        };

        fetchBeneficiaries();
    }, [id]);


    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/donations/campaign/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setDonations(response.data);
                const donations = response.data;
                const total = donations.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);  // Sumar todas las donaciones
                setTotalDonations(total);
            } catch (error) {
                console.error('Error al obtener las donaciones:', error);
            }
        };
        fetchDonations();
    }, [id]);


    const donationsColumns = [
       
        { title: 'Donante', dataIndex: 'name', key: 'name' },
        { title: 'Correo', dataIndex: 'email', key: 'email' },
        { title: 'Teléfono', dataIndex: 'phone', key: 'phone' },
        {
            title: 'Cantidad',
            dataIndex: 'object',
            key: 'object',
            render: (_, record) => {
                // Si el recurso es "insumo", sumamos las cantidades de los artículos
                if (recurso === "insumo") {
                    const articulos = record.object?.articulos || [];
                    
                    // Si hay artículos, sumamos las cantidades de cada uno
                    if (articulos.length > 0) {
                        return articulos.reduce((total, articulo) => total + articulo.cantidad, 0); // Suma de las cantidades
                    }
                    return 0;  // Si no hay artículos, retorna 0
                }
    
                // Si el recurso no es "insumo" (asumimos que es "dinero"), mostramos el valor de 'amount'
                return record.amount || 0;  // Si 'amount' no existe, retorna 0
            },
        },
        { 
            title: 'Fecha de Donación', 
            dataIndex: 'donationDate', 
            key: 'donationDate', 
            render: (text) => new Date(text).toLocaleString() // Formato de la fecha
        },
        {
            key: 'actions',
            render: (_, record) => (
                recurso === "insumo" ? (
                    <Button style={{ color: 'black', fontWeight: 'revert' }} type="dashed" onClick={() => handleExpand(record)}>
                        Ver artículos
                    </Button>
                ) : null  // Si no es "insumo", no mostrar nada
            ),
        }
        
    ];
    const beneficiarieColumn = [
        {
            title: 'Donante',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Correo',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Teléfono',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Fecha de Donación',
            dataIndex: 'joinDate', // Mapeamos a `joinDate` del modelo Java
            key: 'joinDate',
            render: (text) => {
                if (!text) return '';
                return new Date(text).toLocaleString(); // Formato legible de fecha
            }
        },
    ];
    






    return (
        <div className='p-3'>
            <Box className="campaign-summary px-10 py-3 rounded-md shadow-md bg-white mb-1">
                <p level="h3" className="text-start text-black font-bold text-xl ">
                    {nombre}
                </p>
                <div className="flex justify-between items-start">
                    <div className="flex-1 flex flex-col gap-2">
                        <div className={`flex items-center justify-${recurso === "insumo" ? "center" : "end"} gap-4`}>
                            <div className="flex items-center justify-end gap-4">
                                <Typography color="blue-gray" variant="h6" className="flex items-center gap-2">
                                    <span className="font-bold text-black">
                                        {recurso === "insumo" ? (
                                            <span style={{ color: "#efb810" }} className="text-3xl font-semibold">
                                                {totalDonations}
                                            </span>
                                        ) : (
                                            <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalDonations)}</span>
                                        )}
                                    </span>
                                    <span style={{ color: "#efb810" }} className="text-gray-600 text-xl"> recaudados de </span>
                                    <span className="font-bold text-gray-600">
                                        {recurso === "insumo" ? (
                                            <span className="text-2xl text-black">{CANTIDAD} Artículos</span>
                                        ) : (
                                            <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(CANTIDAD)}</span>
                                        )}
                                    </span>
                                </Typography>

                            </div>

                        </div>

                        {recurso === "insumo" ? <div></div> : <div className="relative w-full bg-gray-300 h-7 rounded-md overflow-hidden ">
                            {/* Barra de progreso usando Material Tailwind Progress */}
                            <Progress value={progress} className="h-full rounded-md" labale={progress} />

                            {/* Texto de porcentaje */}
                            <div style={{ color: "#efb810" }} className="absolute inset-0 flex items-center justify-center font-bold">
                                {Math.min(progress, 100).toFixed(0)}% completado
                            </div>
                        </div>}

                    </div>
                    {/* Columna derecha: Donantes y Participantes */}
                    <div className="flex-1 flex flex-row justify-center items-center gap-6">
                        <div className='flex flex-row gap-2 justify-center align-middle'>
                            <div style={{ backgroundColor: '#AFCCD0' }} className="w-14 p-2 rounded-full m-0">
                                <p className="font-bold text-2xl text-center m-1">{donations.length}</p>
                            </div>
                            <div className='flex flex-col'>
                                <div style={{ borderTopRightRadius: 7, backgroundColor: '#AFCCD0' }} className='00 p-1 w-32'>
                                    <p className='text-center font-bold'>DONADORES</p>
                                </div>

                            </div>
                        </div>

                        <div className='flex flex-row gap-2 justify-center align-middle'>
                            <div style={{ backgroundColor: '#E0E2CB' }} className="w-14 p-2 rounded-full m-0">
                                <p className="font-bold text-2xl text-center m-1">{beneficiaries.length}</p>
                            </div>
                            <div className='flex flex-col'>
                                <div style={{ borderTopRightRadius: 7, backgroundColor: '#E0E2CB' }} className='p-1 w-32'>
                                    <p className='text-center font-bold'>BENEFICIARIOS</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </Box>


            <div className="campaign-details flex justify-start items-start mt-1">
                <div className="w-full h-80">
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        centered
                        tabBarStyle={{
                            fontSize: '12px',
                            fontWeight: 'bold',
                            backgroundColor: 'black',
                            borderRadius: '8px',
                            color: 'black',
                            width: 280,
                            margin: "5px auto 10px auto"
                        }}
                    >
                        <TabPane
                            tab={<span style={{ color: activeTab === '1' ? 'white' : 'gray', fontSize: 17 }}>Donaciones</span>}
                            key="1"
                        >
                            <Card
                                title={<h2 className="text-xl font-bold ">Historial de Donaciones</h2>}
                                className="shadow-lg"
                                bodyStyle={{ padding: '0px 20px 0px 20px', backgroundColor: '#fff' }}
                            >
                                <Input.Search
                                    placeholder="Buscar por correo"
                                    onChange={handleSearch}
                                    className="mb-3"

                                />
                                <Table
                                    dataSource={filteredDonations.slice((donationsPage - 1) * donationsPerPage, donationsPage * donationsPerPage)}
                                    columns={donationsColumns}
                                    pagination={false}
                                    rowKey="id"
                                    bordered
                                    className="mb-1"
                                    expandable={{
                                        expandedRowKeys,
                                        onExpand: (_, record) => handleExpand(record),
                                        expandedRowRender: (record) => (
                                            <ul className="space-y-3">
                                            {record.object?.articulos?.map((articulo, index) => (
                                              <li key={index} className="p-2 bg-white rounded-lg shadow-sm flex justify-between items-center">
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
                                    current={donationsPage}
                                    pageSize={donationsPerPage}
                                    onChange={setDonationsPage}
                                    total={filteredDonations.length}
                                    className="my-2"
                                />
                            </Card>
                        </TabPane>
                        <TabPane
                            tab={<span style={{ color: activeTab === '2' ? 'white' : 'gray', fontSize: 17 }}>Beneficiarios</span>}
                            key="2"
                        >
                            <Card
                                title={<h2 className="text-xl font-bold ">Beneficiarios</h2>}
                                className="shadow-lg"
                                bodyStyle={{ padding: '0px 20px 0px 20px', backgroundColor: '#fff' }}
                            >
                                <Input.Search
                                    placeholder="Buscar por correo"
                                    onChange={handleSearch}

                                />
                                <Table
                                    dataSource={filteredBeneficiaries.slice((participantsPage - 1) * participantsPerPage, participantsPage * participantsPerPage)}
                                    columns={beneficiarieColumn}
                                 
                                    pagination={{
                                        pageSize: 4, // Define el número de filas por página
                                        current: participantsPage,
                                        onChange: setParticipantsPage,
                                        total: filteredBeneficiaries.length,
                                        showSizeChanger: false, // Opcional: desactiva el cambio de tamaño de página
                                    }}
                                    rowKey="id"
                                    bordered
                                    className="mb-3 mt-3"
                                     size="small"
                                     style={{ fontSize: '12px', overflowX: 'auto' }}s
                                   
                                />
                                <Pagination
                                   current={participantsPage}
                                   pageSize={4} // Esto también asegura que el número máximo de filas por página sea 4
                                   onChange={setParticipantsPage}
                                   total={filteredBeneficiaries.length}
                                   className="my-2"
                                />
                            </Card>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default CampaignDetails;