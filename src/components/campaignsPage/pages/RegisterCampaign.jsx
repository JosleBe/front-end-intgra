import React, { useEffect, useState } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { NavLink } from 'react-router-dom';
import { FormControl, FormLabel, Stack } from '@mui/material';
import { Button, Input, List, message, Modal, Radio } from 'antd';
import ImagePlantilla from '../../../assets/img/voluntarios.jpg';
import TextArea from 'antd/es/input/TextArea';
import Plantillas from '../components/Templates';
import { Carousel, IconButton } from '@material-tailwind/react';
import { DeleteOutlined, DollarOutlined, PlusOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { ChevronLeft, ChevronRight } from 'lucide-react';

import axios from 'axios';
import Alert from '../components/Alert';
import Swal from 'sweetalert2';
const RegisterCampaign = () => {

    const [alignment, setAlignment] = useState();
    const [image, setImage] = useState(ImagePlantilla);  
    const [categoria, setCategoria] = useState(null);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [meta, setMeta] = useState('');
    const [lugar, setLugar] = useState('');
    const [location, setLocation] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [recursoTipo, setRecursoTipo] = useState(null);
    const [cantidad, setCantidad] = useState("");
    const [articulos, setArticulos] = useState([]);
    const [articulo, setArticulo] = useState('');
    const [articuloCantidad, setArticuloCantidad] = useState('');
    const [plantillaSeleccionada, setPlantillaSeleccionada] = useState(null);
    const [estado, setEstado] = useState(true);
    const [error, setError] = useState("");
    const showModal = () => setIsModalOpen(true);
    const showModal2 = () => setIsModalOpen2(true);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [objeto, setObjeto] = useState({});
    const img = [
        "/img-camp/img-1.png",
        "/img-camp/img-2.png",
        "/img-camp/img-3.png",
        "/img-camp/img-4.png",
        "/img-camp/img-5.png",
        "/img-camp/img-6.png",
        "img-camp/img-7.png",
        "/img-camp/img-8.png",
        "/img-camp/img-9.png",
    ]
    const handleArticuloCantidadChange = (e) => {
        const value = e.target.value;
        if (!isNaN(value) && Number(value) > 0) {
            setArticuloCantidad(value);
            setError(null);
        } else {
            setError("La cantidad debe ser un número mayor a 0");
        }
    };

    const categorias = ['Educación Local', 'Alimentación y Vivienda', 'Emergencias Locales', 'Donaciones en Especie ', 'Donaciones Monetarias'];
    const handleCantidadChange = (e) => {
        const value = formatCantidad(e.target.value);
        setCantidad(value);
        setError(value ? "" : "Ingrese una cantidad válida");
    };
    const handleEliminarArticulo = (index) => {
        const updatedArticulos = articulos.filter((_, i) => i !== index);
        setArticulos(updatedArticulos);
        setCantidad(updatedArticulos.reduce((acc, item) => acc + item.cantidad, 0));
    };


    const handleAgregarArticulo = () => {
        if (articulo.trim() !== '' && articuloCantidad.trim() !== '' && Number(articuloCantidad) > 0) {
            const updatedArticulos = [...articulos, { nombre: articulo.trim(), cantidad: Number(articuloCantidad) }];
            setArticulos(updatedArticulos);
            setCantidad(updatedArticulos.reduce((acc, item) => acc + item.cantidad, 0));
            setArticulo('');
            setArticuloCantidad('');
            setError(null);
        } else {
            setError("Ingrese un nombre válido y una cantidad positiva");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ nombre, descripcion, fechaInicio, fechaFin, meta, lugar });
    };

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/location/getAll", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,

                    },
                })
                setLocation(response.data);
            } catch (error) {
                console.log("Error al obtener las ubicaciones", error);
            }
        }
        fetchLocations();
    }, [])
    console.log(error)
    const showAlert = (message, icon) => {
        Swal.fire({
            title: icon === 'error' ? '¡Error!' : 'Éxito',
            text: message,
            icon: icon,
            confirmButtonText: 'Aceptar',
        });
    };
    const handleRegister = async () => {
        console.log("Iniciando registro...");
    
        // Validaciones con SweetAlert
        if (!nombre.trim()) return showAlert("El nombre de la campaña es obligatorio.", "error");
        if (!descripcion.trim()) return showAlert("La descripción no puede estar vacía.", "error");
        if (!fechaInicio || !fechaFin) return showAlert("Las fechas de inicio y fin son obligatorias.", "error");
    
        const fechaInicioDate = new Date(fechaInicio);
        const fechaFinDate = new Date(fechaFin);
        if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
            return showAlert("Las fechas deben ser válidas.", "error");
        }
        if (fechaInicioDate >= fechaFinDate) {
            return showAlert("La fecha de inicio debe ser menor que la fecha de fin.", "error");
        }
    
        if (!image) return showAlert("La imagen es obligatoria.", "error");
        if (!categoria) return showAlert("Debe seleccionar una categoría.", "error");
        if (!plantillaSeleccionada) return showAlert("Debe seleccionar una plantilla.", "error");
        if (!recursoTipo) return showAlert("Debe seleccionar un recurso.", "error");
        if (!selectedLocation || !selectedLocation.address) return showAlert("Debe seleccionar una ubicación en el mapa.", "error");
    
        // Objeto de datos a enviar
        const data = {
            nombre,
            descripcion,
            fechaInicio,
            fechaFin,
            meta: Number(meta),
            lugar,
            location: selectedLocation,
            recursoTipo,
            cantidad,
            plantillaSeleccionada,
            categoria,
            image,
            objeto,
            estado
        };
    
        console.log("Datos a enviar:", data);
    
        try {
            const response = await axios.post("http://localhost:8080/api/campaign/register", data, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
    
            console.log("Respuesta del servidor:", response);
    
            if (response.status === 201) {
                showAlert("🎉 Campaña registrada correctamente.", "success");
    
                // Resetear los campos
                setNombre("");
                setDescripcion("");
                setFechaInicio("");
                setFechaFin("");
                setMeta("");
                setLugar("");
                setSelectedLocation(null);
                setRecursoTipo(null);
                setCantidad("");
                setPlantillaSeleccionada(null);
                setImage(ImagePlantilla);
                setCategoria("");
            }
        } catch (error) {
            console.error("Error al registrar la campaña:", error);
            showAlert("❌ Hubo un problema al registrar la campaña.", "error");
        }
    };



    const handleCancel = () => {
        setIsModalOpen(false);
        setCantidad("");
        setMeta("");
        setRecursoTipo(null);
        setError("");
        setArticulos([]);
    };
    const formatCantidad = (value) => {
        if (recursoTipo === "monetario") {

            return value
                .replace(/[^0-9.]/g, "") // Solo permite números y puntos
                .replace(/(\..*)\./g, "$1") // Evita más de un punto decimal
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Agrega comas de separación
        }
        return value.replace(/\D/g, ""); // Solo permite números enteros para insumos
    };

    const handleConfirmar = () => {

        console.log({ tipo: recursoTipo, cantidad, articulos });
        handleConfirm(recursoTipo, cantidad, articulos);
        handleCancel();
    };

    const handleConfirm = (tipo, cantidad, articulos) => {
        if (!tipo || (tipo === "monetario" && (!cantidad || Number(cantidad) <= 0))) return;

        setMeta(`${cantidad} ${tipo === "insumo" ? "📦 artículos" : "💲"}`);
        setObjeto({ tipo, cantidad, articulos });
        setIsModalOpen(false);
        setError("");
        message.success("Recurso guardado correctamente");

        console.log({ tipo, cantidad, articulos, totalArticulos }); // Para depuración
    };

    const handleCancel2 = () => {
        setIsModalOpen2(false);
        setSelectedLocation("");
        setError("");

    }
    const handleConfirm2 = () => {
        setIsModalOpen2(false);
        console.log(selectedLocation)
    }
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
    
        if (!file) return;
    
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
    
        if (!validImageTypes.includes(file.type)) {
            Swal.fire({
                icon: 'error',
                title: 'Archivo no válido',
                text: 'Solo se permiten imágenes en formato JPG, PNG, GIF, SVG o WEBP.'
            });
            return;
        }
    
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Image = reader.result;
            setImage(base64Image);  // Guarda la imagen en base64 en el estado
            console.log(base64Image);  // Puedes quitar esto si ya no necesitas verlo en consola
        };
        reader.readAsDataURL(file); // Convierte el archivo en base64
    };
    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    const handleImageClick = (selectedImage) => {
        setImage(selectedImage);  // Actualiza la imagen seleccionada
    };


    return (
        <div>
            <Box sx={{ flex: 1, width: '100%', position: 'sticky', top: 0, zIndex: 9999, bgcolor: 'background.body' }}>
                <Box sx={{ px: { xs: 2, md: 6 } }}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 1 }}>
                        <Box sx={{ flexShrink: 0 }}>
                            <Box
                                sx={{
                                    position: 'sticky',
                                    top: { sm: -100, md: -110 },
                                    bgcolor: 'background.body',
                                    zIndex: 9995,
                                }}
                            >
                                <Box sx={{ px: { xs: 2, md: 6 } }}>
                                    <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2, color: 'black' }}>
                                        Registrar campañas
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ width: 'auto' }}>
                            <ToggleButtonGroup
                                value={alignment}
                                exclusive
                                onChange={handleChange}
                                aria-label="Platform"
                                sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                            >
                                <ToggleButton
                                    value="web"
                                    sx={{
                                        bgcolor: location.pathname === '/campaigns' ? 'black' : 'transparent',
                                        color: location.pathname === '/campaigns' ? 'white' : '#896447',
                                        borderRadius: '20px',
                                        padding: '10px 20px',
                                        fontSize: 16,
                                        fontWeight: 500,
                                        textTransform: 'none',
                                        '&:hover': {
                                            bgcolor: location.pathname === '/campaigns' ? 'black' : 'rgba(0, 0, 0, 0.1)',
                                            color: 'white',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    <NavLink to="/campaigns" style={{ textDecoration: 'none' }}>
                                        <Typography sx={{ color: location.pathname === '/campaigns' ? 'white' : 'black' }}>
                                            Campañas
                                        </Typography>
                                    </NavLink>
                                </ToggleButton>

                                <ToggleButton
                                    value="android"
                                    sx={{
                                        bgcolor: location.pathname === '/campaigns-register' ? 'black' : 'black',
                                        color: location.pathname === '/campaigns-register' ? 'white' : 'white',
                                        borderRadius: '20px',
                                        padding: '10px 20px',
                                        fontSize: 16,
                                        fontWeight: 500,
                                        textTransform: 'none',
                                        '&:hover': {
                                            bgcolor: location.pathname === '/campaigns-register' ? 'black' : 'rgba(0, 0, 0, 0.1)',
                                            color: 'white',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    <NavLink to="/campaigns-register" style={{ textDecoration: 'none' }}>
                                        <Typography sx={{ color: location.pathname === '/campaigns-register' ? 'black' : 'white' }}>
                                            Registrar campañas
                                        </Typography>
                                    </NavLink>
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Stack className="flex flex-row w-full p-6 space-x-3">
                <div className="w-96 h-2/4 bg-white p-6 shadow-lg rounded-xl">
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg
                                        className="w-5 h-6  text-gray-500"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                        />
                                    </svg>
                                    <p className=" text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                     accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </div>

                        <FormControl fullWidth>
                            <FormLabel>Nombre de la campaña</FormLabel>
                            <Input
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                
                            />
                        </FormControl>

                        <FormControl fullWidth>
                            <FormLabel>Descripción</FormLabel>
                            <TextArea
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                className="h- resize-none"
                            />
                        </FormControl>

                        <div className="flex space-x-4">
                            <FormControl className="flex-1">
                                <FormLabel>Fecha inicio</FormLabel>
                                <Input
                                    type="date"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                />
                            </FormControl>
                            <FormControl className="flex-1">
                                <FormLabel>Fecha finalización</FormLabel>
                                <Input
                                    type="date"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                />
                            </FormControl>
                        </div>

                        <div className="flex space-x-4">
                            <FormControl className="flex-1">

                                <Input
                                    type="button"
                                    style={{ backgroundColor: 'gray', color: 'white', fontWeight: 'bold', fontSize: 15 }}
                                    onClick={showModal}
                                    value={"Recurso"}

                                />
                            </FormControl>
                            <FormControl className="flex-1">
                                <Input
                                    type="button"
                                    onClick={showModal2}
                                    style={{ backgroundColor: 'gray', color: 'white', fontWeight: 'bold', fontSize: 15 }}
                                    value="Ubicacion"
                                />
                            </FormControl>
                        </div>
                        <div className="flex space-x-4">
                            <FormControl className="flex-1">
                                <FormLabel>Meta ingresada</FormLabel>
                                <Input type="text" value={meta} readOnly />
                            </FormControl>
                        </div>
                        <div className='flex space-x-4'>

                            <FormControl className="flex-1">
                                <FormLabel>Ubicación seleccionada</FormLabel>
                                <Input type="text" value={selectedLocation?.address || ''} readOnly />
                            </FormControl>


                        </div>
                        <Alert message={alertMessage} type={alertType} onClose={() => setAlertMessage("")} />

                        <Button
                            style={{ backgroundColor: 'black', color: 'white', fontWeight: 'bold', fontSize: 18 }}
                            type="button"
                            variant="contained"
                            className="w-full h-10"
                            onClick={handleRegister}
                        >
                            Registrar
                        </Button>
                    </form>
                </div>

                {/* Vista previa en tiempo real */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: -2 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', gap: '20px' }}>
                        {/* Carrusel de imágenes */}
                        <div className="flex-1 grid h grid-cols-1 gap-4 sm:h-44 xl:h-44 w-full 2xl:h-56 rounded-2xl overflow-hidden">
                            <h2 style={{ fontSize: 19, fontWeight: 'bold' }} className="text-center w-full  -mb-10">Selecciona o carga una imágen</h2>


                            <Carousel
                                className="carousel"
                                prevArrow={({ handlePrev }) => (
                                    <IconButton
                                        variant="text"
                                        color="black" // Cambia el color aquí
                                        onClick={handlePrev}
                                        className="!absolute left-2 top-1/2 transform -translate-y-1/2 "
                                    >
                                        <ChevronLeft size={35} />
                                    </IconButton>

                                )}

                                nextArrow={({ handleNext }) => (
                                    <IconButton
                                        variant="text"
                                        color="black" // Cambia el color aquí
                                        onClick={handleNext}
                                        className="!absolute right-2 top-1/2 transform -translate-y-1/2"
                                    >
                                        <ChevronRight size={35} />
                                    </IconButton>
                                )}

                            >
                                {img.map((imgSrc, index) => (
                                    <div
                                        key={index}
                                        style={{ borderRadius: 2 }}
                                        className={`w-full rounded-2xl h-40 ${image === imgSrc ? "scale-75" : ""}  transition-all duration-300`}
                                    >
                                        <img
                                            className="w-full h-full object-cover rounded-2xl"
                                            src={imgSrc}
                                            alt={`Imagen ${index}`}
                                            onClick={() => handleImageClick(imgSrc)}
                                        />
                                    </div>
                                ))}
                            </Carousel>

                        </div>

                        {/* Selección de categorías */}
                        <div className="flex-1 m">
                            <h2 style={{ fontSize: 19, fontWeight: 'bold' }} className="text-center w-full mb-4">Selecciona una categoría</h2>
                            <div className="flex flex-wrap justify-center mt-6 items-start gap-2">
                                {categorias.reduce((acc, cate, index) => {
                                    if (index % 2 === 0) {
                                        acc.push(categorias.slice(index, index + 2)); // Agrupar dos elementos
                                    }
                                    return acc;
                                }, []).map((pair, index) => (
                                    <div key={index} className="flex gap-2">
                                        {pair.map((cate) => (
                                            <Button
                                                key={cate}
                                                onClick={() => setCategoria(cate)}
                                                style={{
                                                    backgroundColor: categoria === cate ? 'black' : 'transparent',
                                                    color: categoria === cate ? 'white' : 'black',
                                                    borderRadius: '20px',
                                                    padding: '10px 20px',
                                                    fontSize: 17,
                                                    transition: 'all 0.3s ease',
                                                }}
                                            >
                                                {cate}
                                            </Button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <h2 style={{ fontSize: 19, fontWeight: 'bold' }} className="text-center w-full mb-1">Selecciona una plantilla</h2>
                    {/* Vista previa de la plantilla seleccionada */}
                    <div className="flex justify-center items-center -mt-3 w-full">
                        <Plantillas
                            categoria={categoria}
                            titulo={nombre}
                            descripcion={descripcion}
                            imagen={image}
                            onSeleccionar={setPlantillaSeleccionada}
                        />
                    </div>
                </div>
                <Modal
                    title="Seleccionar tipo de recurso"
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={null}
                    centered
                >
                    <div className="flex justify-center gap-4">
                        <Radio.Group
                            onChange={(e) => setRecursoTipo(e.target.value)}
                            value={recursoTipo}
                            className="flex gap-4"
                        >
                            <Radio.Button
                                value="insumo"
                                className="flex items-center gap-2 p-2"
                                disabled={recursoTipo === "monetario"} // Deshabilita si ya eligió "monetario"
                            >
                                <ShoppingCartOutlined className="text-lg" /> Insumo
                            </Radio.Button>

                            <Radio.Button
                                value="monetario"
                                className="flex items-center gap-2 p-2"
                                disabled={recursoTipo === "insumo"} // Deshabilita si ya eligió "insumo"
                            >
                                <DollarOutlined className="text-lg" /> Monetario
                            </Radio.Button>
                        </Radio.Group>
                    </div>

                    {recursoTipo && recursoTipo === "monetario" && (
                        <div style={{ marginTop: 20 }}>
                            <label style={{ fontWeight: "bold", fontSize: "14px", display: "block" }}>
                                Cantidad en pesos
                            </label>
                            <Input
                                type="text"
                                value={cantidad}
                                onChange={handleCantidadChange}
                                placeholder={recursoTipo === "insumo" ? "Ejemplo: 50" : "Ejemplo: 10,000.00"}
                                style={{ marginTop: 5, fontWeight: "bold", fontSize: "16px" }}
                            />
                            {error && (
                                <div className="text-red-500 flex items-center gap-2 mt-1">
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {recursoTipo === "insumo" && (
                        <div style={{ marginTop: 20 }}>
                            <label style={{ fontWeight: "bold", fontSize: "14px", display: "block" }}>
                                Lista de artículos requeridos
                            </label>
                            <div className="flex gap-2 mt-2">
                                <Input
                                    type="text"
                                    value={articulo}
                                    onChange={(e) => setArticulo(e.target.value)}
                                    placeholder="Ejemplo: Lápices, Papel..."
                                />
                                <Input
                                    type="number"
                                    value={articuloCantidad}
                                    onChange={handleArticuloCantidadChange}
                                    placeholder="Cantidad"
                                    style={{ width: '80px' }}
                                />
                                <Button style={{backgroundColor: '#b0b0b0', color: 'white'}} type="dashed" icon={<PlusOutlined />} onClick={handleAgregarArticulo}>
                                    Agregar
                                </Button>
                            </div>
                            <List
                                bordered
                                dataSource={articulos}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        {`${item.nombre} - Cantidad: ${item.cantidad}`}
                                        <Button type="link" icon={<DeleteOutlined />} onClick={() => handleEliminarArticulo(index)}>
                                            Eliminar
                                        </Button>
                                    </List.Item>
                                )}
                                className="mt-2"
                            />
                            <p className="mt-2 font-bold">Total de artículos: {cantidad}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-5">
                        <Button type="link" onClick={handleCancel} style={{ color: "black" }}>
                            Cancelar
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleConfirmar}
                            disabled={!recursoTipo || (recursoTipo === "monetario" && (!cantidad || Number(cantidad) <= 0))}
                            style={{ backgroundColor: "black", color: "white" }}
                        >
                            Confirmar
                        </Button>
                    </div>
                </Modal>
                <Modal
                    title="Seleccionar ubicación"
                    open={isModalOpen2}
                    onCancel={handleCancel2}
                    footer={null}
                    centered
                >
                    <List
                        dataSource={location}
                        renderItem={(location) => (
                            <List.Item
                                onClick={() => setSelectedLocation(location)}
                                className={`p-2 cursor-pointer ${selectedLocation === location ? 'bg-gray-200' : ''}`}
                            >
                                {location.city}, {location.state} - {location.address}
                            </List.Item>
                        )}
                    />
                    <div className="flex justify-end gap-2 mt-5">
                        <Button type='link' onClick={handleCancel2} style={{ color: 'black' }}>
                            Cancelar
                        </Button>
                        <Button
                            type="primary"
                            color="default"
                            onClick={handleConfirm2}
                            disabled={!selectedLocation}
                            style={{ backgroundColor: 'black', color: 'white' }}
                        >
                            Confirmar
                        </Button>
                    </div>
                </Modal>
            </Stack>
        </div>
    );
};

export default RegisterCampaign;
