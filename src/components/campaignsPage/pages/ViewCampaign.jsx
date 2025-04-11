import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import payIt from '../../../service/payIt'
import Mapa from '../../mapa/Mapa';
import CommentList from '../components/CommentList';
import axios from 'axios';
import { Progress, Typography, Button, MenuItem, Input, Select } from '@material-tailwind/react';
import { Modal } from '@mui/joy';
import Swal from 'sweetalert2';
import UserService from '../../../service/UserService';

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
        address,
        cant,
        arti
    } = location.state || {};
    const CANTIDAD = parseInt(cant.replace(/,/g, ''));
    console.log("Esta es la cantidad de los articulos:", cant)
    const { lat, lng } = locationmap;
    const [isProcessing, setIsProcessing] = useState(false);
    const [totalDonations, setTotalDonations] = useState(0);
    const [cantidad, setCantidadTotal] = useState(CANTIDAD);
    const [progress, setProgress] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [donationAmount, setDonationAmount] = useState();
    const [isDonor, setIsDonor] = useState(false);
    const [isBeneficiary, setIsBeneficiary] = useState(false);
    const [articulos, setArticulos] = useState(arti)
    const [isBeneficiarygeneral, setIsBeneficiarygeneral] = useState(false);
    const [isDonorgeneral, setIsDonorGeneral] = useState(false);
    const amounts = [1000, 500, 400, 350, 300, 260];
    const profile = JSON.parse(localStorage.getItem("profileInfo")) || {
        id: "guest",
        name: "Invitado",
        role: "guest",
        email: null
    };
    const [selectedArticulos, setSelectedArticulos] = useState({});
    const handleCheckDonorStatus = async () => {
        if (profile.role === "guest") return;
        try {
            const response = await axios.get(
                `http://localhost:8080/api/donations/check-donor`,
                {
                    params: {
                        campaignId: id,
                        donorId: profile.id
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            if (response.data.hasDonated) {
                setIsDonor(true);
            } else {
                setIsDonor(false);
            }
        } catch (error) {
            console.error('Error al verificar el estado del donador:', error);
        }
    };

    useEffect(() => {
        const fetchTotal = async () => {
            if (profile.role === "guest") return;
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

    const handleCantidadChange = (nombre, cantidad) => {
        setSelectedArticulos((prev) => ({
            ...prev,
            [nombre]: cantidad,
        }));
    };
    useEffect(() => {
        if (profile.role === "guest") return;
        handleCheckDonorStatus();
    }, []);

    const handleCheckRegistration = async () => {
        if (profile.role === "guest") return;
        try {
            const response = await axios.post(
                'http://localhost:8080/api/beneficiaries/check',
                null, // No se envían datos en el cuerpo de la solicitud
                {
                    params: {
                        campaignId: id,
                        beneficiaryId: profile.id
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (response.data) {
                setIsBeneficiary(true);
            } else {
                setIsBeneficiary(false);

            }
        } catch (error) {
            console.error('Error al comprobar registro:', error);
        }
    };

    const handleCheckRegistrationGeneral = async () => {
        if (profile.role === "guest") return;
        try {

            const response = await axios.post(
                `http://localhost:8080/api/beneficiaries/check/beneficiary/${profile.id}`, {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.data) {
                console.log("Ya eres beneficiario general")
                setIsBeneficiarygeneral(true);
            } else {
                console.log("Ya eres beneficiario general")
                setIsBeneficiarygeneral(false);

            }
        } catch (error) {
            console.error('Error al comprobar registro:', error);
        }
    };
    const handleCheckDonationGeneral = async () => {
        if (profile.role === "guest") return;
        try {

            const response = await axios.get(
                `http://localhost:8080/api/donations/check-donor/${profile.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.data) {
                console.log("Ya eres beneficiario general")
                setIsDonorGeneral(true);
            } else {
                console.log("Ya eres beneficiario general")
                setIsDonorGeneral(false);

            }
        } catch (error) {
            console.error('Error al comprobar registro:', error);
        }
    };


    useEffect(() => {
        if (profile.role === "guest") return;
        handleCheckRegistration(); handleCheckRegistrationGeneral(); handleCheckDonationGeneral();
    }, [])
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (profile.role === "guest") {

            Swal.fire({
                title: 'Inicia sesión para registrarte como beneficiario',
                text: 'Debes iniciar sesión para registrarte como beneficiario de esta campaña.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Iniciar sesión',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#4CAF50',
                cancelButtonColor: '#d33',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/';
                }
            });
            return;

        }

        const beneficiary = {
            campaignId: id,
            beneficiaryId: profile.id,
            email: profile.email,
            phone: profile.phone,
            name: profile.name,
        };

        Swal.fire({
            title: '¿Registrar beneficiario?',
            text: '¿Deseas registrarte como beneficiario de esta campaña?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, registrar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#4CAF50',
            cancelButtonColor: '#d33',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.post(
                        'http://localhost:8080/api/beneficiaries/save',
                        beneficiary,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                                'Content-Type': 'application/json',
                            }
                        }
                    );

                    console.log('✅ Beneficiario registrado:', response.data);

                    Swal.fire({
                        title: 'Registro exitoso',
                        text: 'Te has registrado correctamente como beneficiario.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                    }).then(() => {
                        window.location.reload();
                    });

                } catch (error) {
                    console.error('❌ Error al registrar beneficiario:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Ocurrió un error al registrar el beneficiario.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar',
                    });
                }
            }
        });
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };



    useEffect(() => {
        console.log("Total Donaciones:", totalDonations);

        if (cantidad && !isNaN(cantidad) && cantidad > 0) {

            const newProgress = (totalDonations / cantidad) * 100;
            setProgress(Math.min(newProgress, 100));
        }
    }, [totalDonations, cantidad]);
    useEffect(() => {
        console.log("Total Donaciones:", totalDonations);
        if (cantidad && !isNaN(cantidad) && cantidad > 0) {
            const newProgress = (totalDonations / cantidad) * 100;
            setProgress(Math.min(newProgress, 100));
        }
    }, [totalDonations, cantidad]);




    const getDay = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) {
            return "Fecha inválida";
        }
        return date.getDate();
    };
    const getMonthYear = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) {
            return "Fecha inválida";
        }
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('es-ES', options);
    };

    const handleDonationSubmit = async () => {
        setIsModalOpen(false);
        if (isProcessing) return;


        const confirmResult = await Swal.fire({
            title: '¿Confirmar donación?',
            text: recurso === "insumo"
                ? '¿Estás seguro de que deseas donar los artículos seleccionados?'
                : `¿Estás seguro de que deseas realizar una donación monetaria de $${donationAmount}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, donar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#4CAF50',
            cancelButtonColor: '#d33',
        });

        if (!confirmResult.isConfirmed) return;

        setIsProcessing(true);


        try {
            if (recurso === "insumo") {
                const donaciones = Object.entries(selectedArticulos)
                    .filter(([_, cantidad]) => cantidad > 0)
                    .map(([nombre, cantidad]) => ({ nombre, cantidad }));

                if (donaciones.length === 0) {
                    Swal.fire({
                        title: 'Atención',
                        text: 'Selecciona al menos un artículo para donar.',
                        icon: 'warning',
                        confirmButtonText: 'Aceptar',
                    });
                    return;
                }

                const response = await fetch('http://localhost:8080/api/pre-donation/pre-donate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        recurso: "insumo",
                        donaciones,
                        campaignId: id,
                        donorId: profile.id,
                        email: profile.email,
                        phone: profile.phone,
                        name: profile.name
                    })
                });

                if (!response.ok) throw new Error("Error al procesar la donación de insumos");

                const updatedData = await response.json();
                setArticulos(updatedData.articulos);
                setSelectedArticulos({});

                Swal.fire({
                    title: '¡Gracias!',
                    text: 'Donación de insumos realizada con éxito.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => window.location.reload());

            } else {
                const pago = {
                    idUsuario: profile.id,
                    amount: donationAmount,
                    currency_code: "USD",
                    idCampaig: id
                };

                const donate = await payIt.payTo(pago);
                console.log(donate);

                Swal.fire({
                    title: '¡Gracias!',
                    text: 'Donación monetaria realizada con éxito.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => window.location.reload());
            }

        } catch (error) {
            console.error("❌ Error en la donación:", error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error al realizar la donación. Intenta más tarde.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        } finally {
            setIsProcessing(false);
            setIsModalOpen(false);
        }
    };
    const handleOpenModalValidated = () => {
        if (profile.role === "guest") {

            Swal.fire({
                title: 'Inicia sesión para realizar una donación',
                text: 'Debes iniciar sesión para realizar donaciones',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Iniciar sesión',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#4CAF50',
                cancelButtonColor: '#d33',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/';
                }
            });
            return;
        }

        setIsModalOpen(true);
    };

    return (
        <div className="flex w-full h-full">
            <div className="flex-1 border-gray-300 p-6 space-y-4">
                <h2 className="text-3xl font-bold line-clamp-2 ">{titulo}</h2>

                <div className="flex mt-3 gap-4">
                    {/* Imagen */}
                    <div className="flex-1 flex flex-col items-center">
                        <img
                            src={imagen}
                            alt={titulo}
                            className="rounded-xl shadow-md w-full h-[150px] object-cover"
                        />
                        <p className="text-black mt-2 font-bold">Categoría: <span>{`${String(categoria).toUpperCase()}`}</span></p>
                        <p className="text-black mt-2 font-bold">Tipo: {`${String(recurso).toUpperCase()}`}</p>
                        <p className="text-gray-600 mt-2 font-bold text-center">Direccion: {address}</p>
                    </div>
                    <div className="flex-1">
                        <div style={{ height: 150, overflow: 'hidden', borderRadius: 10 }} className="rounded-xl shadow-md w-full bg-cover bg-center ">
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
                <h5 className='text-center' style={{ fontWeight: 'bold', color: 'black', fontSize: 18 }}>Descripcion</h5>
                <div className="bg-white p-4 rounded-xl shadow-md h-32 overflow-y-scroll">
                    <p className="text-gray-700">{descripcion}</p>
                </div>
                <div className="w-full">
                    <div className={`flex items-center justify-${recurso === "insumo" ? "center" : "end"} gap-4`}>
                        <div className="flex items-center justify-end gap-4">
                            <Typography color="blue-gray" variant="h6" className="flex items-center gap-2">
                                <span className="font-bold text-black">
                                    {recurso === "insumo" ? (
                                        <span style={{ color: "#efb810" }} className="text-2xl font-semibold">
                                            {totalDonations}
                                        </span>
                                    ) : (
                                        <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalDonations)}</span>
                                    )}
                                </span>
                                <span style={{ color: "#efb810" }} className="text-gray-600 text-xl">recaudados de</span>
                                <span className="font-bold text-gray-600">
                                    {recurso === "insumo" ? (
                                        <span className="text-lg text-black">{CANTIDAD} Artículos</span>
                                    ) : (
                                        <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(CANTIDAD)}</span>
                                    )}
                                </span>
                            </Typography>

                            {recurso === "insumo" && articulos?.some(articulo => articulo.cantidad > 0) && (
                                <div className="flex-1 text-sm font-semibold text-red-600">
                                    <p>¡Aún necesitamos más artículos para completar los recursos de esta campaña!   </p>
                                </div>
                            )}
                            {recurso === "insumo" && articulos?.every(articulo => articulo.cantidad === 0) && (
                                <div className="flex-1 text-sm font-semibold text-green-600">
                                    <p>¡Gracias por tu apoyo! Ya hemos completado los artículos necesarios para la campaña.</p>
                                </div>
                            )}
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

                {UserService.isAdmin() ? (

                    <></>
                ) : (isBeneficiary ? (
                    <p style={{ color: "#efb810", textDecoration: 'underline' }} className="text-center font-bold text-2xl">
                        Ya estás inscrito a esta campaña
                    </p>
                ) :
                    isDonorgeneral ? (
                        <div className="w-full flex gap-4 mt-3 h-10">
                            <button className="w-full bg-black text-white py-2 rounded-md" onClick={handleOpenModal}>
                                Realizar donación
                            </button>
                        </div>
                    ) :
                        isBeneficiarygeneral ? (
                            <button className="w-full bg-black text-white py-2 rounded-md" onClick={handleSubmit}>
                                Inscribirse a la campaña
                            </button>
                        ) : isDonor ? (
                            <div className="w-full flex gap-4 mt-3 h-10">
                                <button className="w-full bg-black text-white py-2 rounded-md" onClick={handleOpenModal}>
                                    Realizar donación
                                </button>
                            </div>
                        ) :
                            <div className='flex flex-row gap-2'>
                                <button className="w-full bg-black text-white py-2 rounded-md" onClick={handleSubmit}>
                                    Inscribirse a la campaña
                                </button>
                                <div className="w-full flex   h-10">
                                    <button className="w-full bg-black text-white py-2 rounded-md" onClick={handleOpenModalValidated}>
                                        Realizar donación
                                    </button>
                                </div>
                            </div>)




                }


            </div>
            <div className="flex-1 p-6 space-y-6 mt-5">
                <CommentList campaignId={id} />

            </div>
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backdropFilter: "blur(5px)",
                }}
            >
                <div className="p-6 bg-white rounded-xl shadow-xl w-[400px]">
                    <h2 className="text-xl font-bold text-center text-gray-700 mb-4">
                        Selecciona un monto para donar
                    </h2>

                    {/* Mostrar montos disponibles para donar */}
                    {recurso !== "insumo" && (
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {amounts.map((amount) => (
                                <Button
                                    key={amount}
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => setDonationAmount(amount)}
                                    className="w-full py-2"
                                    sx={{
                                        backgroundColor: "white",
                                        borderColor: donationAmount === amount ? "blue" : "gray",
                                        color: "black",
                                        "&:hover": {
                                            backgroundColor: "white",
                                        },
                                    }}
                                >
                                    ${amount}
                                </Button>
                            ))}
                        </div>
                    )}
                    {recurso === "insumo" && (
                        <div className="mb-4">
                            <h3 className="font-bold text-gray-700">Selecciona los artículos para donar</h3>
                            <div className="grid grid-cols-1 gap-4 mt-4">
                                {articulos?.map((articulo) => (
                                    <div key={articulo.nombre} className="flex items-start justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                        {/* Mostrar nombre del artículo */}
                                        <div className="flex flex-col space-y-2">
                                            <span className="text-lg font-semibold text-gray-800">{articulo.nombre}</span>
                                            {/* Mostrar la meta estática del artículo */}
                                            <span className="text-sm text-gray-600">Meta: {articulo.cantidad}</span>
                                        </div>

                                        {/* Campo para seleccionar cantidad a donar */}
                                        <div className="flex flex-col items-center space-y-2">
                                            <Input
                                                type="number"
                                                value={selectedArticulos[articulo.nombre] || ""}
                                                onChange={(e) => handleCantidadChange(articulo.nombre, Number(e.target.value))}
                                                className="w-20 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min={0}
                                                placeholder="Cantidad a donar"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {
                        recurso !== "insumo" &&
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="text-gray-700">$</span>
                            <div style={{ display: "flex", alignItems: "center" }}>

                            <Input
    fullWidth
    type="number"
    value={donationAmount}
    min="0"
    onChange={(e) => {
        const value = e.target.value;
        if (value === '' || (/^\d+(\.\d{0,2})?$/.test(value) && parseFloat(value) >= 0)) {
            setDonationAmount(value);
        }
    }}
    onKeyDown={(e) => {
        // Bloquear '-', '+', 'e' y 'E'
        if (['-', '+', 'e', 'E'].includes(e.key)) {
            e.preventDefault();
        }
    }}
    style={{ flex: 1 }}
/>
                                {recurso === "insumo" ? <span style={{ marginLeft: 8 }}>Articulos</span> : <span style={{ marginLeft: 8 }}>MXN</span>}
                            </div>
                        </div>
                    }
                    <div className="flex justify-between">
                        <Button variant="contained" color="error" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleDonationSubmit}>
                            Donar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Campaign;
