import React, { useState } from "react";
import { Typography, Button } from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Lista de todas las campañas sin categorizar
const plantillas = [
    {
        nombre: "Moderna Azul",
        codigo: "001",
        categoria: "Moderna",
        componente: ({ titulo, descripcion, imagen, categoria}) => (
            <div className=" bg-white shadow-md rounded-lg overflow-hidden flex flex-col relative">
                {/* Categoría sobre la imagen */}
                <div className="absolute top-44 left-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-full transform rotate-0 z-10">
                    {`Categoría: ${categoria}`}
                </div>

                {/* Titulo en el fondo negro */}
                <div className="bg-black text-white text-center py-2" style={{ minHeight: '50px', overflow: 'auto' }}>
                    <Typography
                        variant="h5"
                        className="font-bold text-ellipsis w-full"
                        style={{
                            whiteSpace: 'normal', // Permite que el texto se ajuste a múltiples líneas
                            textOverflow: 'ellipsis', // Muestra '...' si el texto es demasiado largo
                            overflow: 'hidden', // Oculta el texto que excede el contenedor
                            maxHeight: '3rem', overflowY: 'auto'
                        }}
                    >
                        {titulo}
                    </Typography>
                </div>

                {/* Imagen */}
                <div className="relative w-full h-40">
                    <img
                        src={imagen}
                        alt={titulo}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Descripción y Botón */}
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
                {/* Contenedor de la imagen */}
                <div className="relative w-full h-40 ">
                    <img
                        src={imagen}
                        alt={titulo}
                        className="w-full h-full object-cover rounded-t-lg"
                    />
                    {/* Título centrado sobre la imagen */}
                    <div className="absolute inset-0 flex justify-center items-center">
                        <Typography
                            variant="h5"
                            color="blue-gray"
                            className="font-bold text-center text-white"
                            style={{
                                whiteSpace: 'normal', // Permitir que el texto se ajuste y se mueva a la siguiente línea
                                textOverflow: 'ellipsis',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente para mayor legibilidad
                                padding: '0.5rem',
                                borderRadius: '0.25rem',
                                width: '90%', // Mantener el ancho del contenedor
                                wordWrap: 'break-word', // Asegurarse de que las palabras largas se rompan
                                overflow: 'hidden', // Ocultar el desbordamiento
                                display: 'block',
                                maxHeight: '4rem',
                                overflowY: 'auto'
                            }}
                        >
                            {titulo}
                        </Typography>
                    </div>
                </div>

                {/* Descripción */}
                <div className="p-2 flex flex-col justify-between flex-grow">
                    {descripcion && (
                        <div className="w-full" style={{ maxHeight: '4rem', overflowY: 'auto' }}>
                            <p style={{ wordWrap: "break-word", color: 'gray' }}>
                                {descripcion}
                            </p>
                        </div>
                    )}

                    {/* Categoría creativa (debajo de la descripción) */}
                    <div className="w-full text-center mt-4 mb-2">
                        <Typography
                            variant="h6"
                            className="font-bold text-nowrap h-6 p-1    bg-black text-white text-xs rounded-full transform rotate-0 z-10 "
                            style={{
                                fontStyle: 'inherit', // Estilo cursiva para un toque distintivo
                                fontSize: 18

                            }}
                        >
                           {categoria}
                        </Typography>
                    </div>

                    {/* Botón "Leer más" */}
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
                {/* Contenedor de la imagen */}
                <div className="relative w-full h-40 bg-blue-400 rounded-t-lg">
                    <img
                        src={imagen}
                        alt={titulo}
                        className="w-full h-full object-cover rounded-t-lg"
                    />
                    {/* Título centrado sobre la imagen */}
                    <div className="absolute inset-0 flex justify-center items-center">
                        <Typography
                            variant="h5"
                            color="blue-gray"
                            className="font-bold text-center text-white"
                            style={{
                                whiteSpace: 'normal', // Permitir que el texto se ajuste y se mueva a la siguiente línea
                                textOverflow: 'ellipsis',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente para mayor legibilidad
                                padding: '0.5rem',
                                borderRadius: '0.25rem',
                                width: '90%', // Mantener el ancho del contenedor
                                wordWrap: 'break-word', // Asegurarse de que las palabras largas se rompan
                                overflow: 'hidden', // Ocultar el desbordamiento
                                display: 'block',
                                maxHeight: '4rem',
                                overflowY: 'auto'
                            }}
                        >
                            {titulo}
                        </Typography>
                    </div>
                </div>

                {/* Descripción */}
                <div className="p-2 flex flex-col justify-between flex-grow">
                    {descripcion && (
                        <div className="w-full" style={{ maxHeight: '4rem', overflowY: 'auto' }}>
                            <p style={{ wordWrap: "break-word", color: 'gray' }}>
                                {descripcion}
                            </p>
                        </div>
                    )}

                    {/* Categoría creativa (debajo de la descripción) */}
                    <div className="w-full text-center mt-4 mb-2">
                        <Typography
                            variant="h6"
                            className="font-bold text-nowrap h-6 p-1    bg-black text-white text-xs rounded-full transform rotate-0 z-10 "
                            style={{
                                fontStyle: 'inherit', // Estilo cursiva para un toque distintivo
                                fontSize: 18

                            }}
                        >
                                {categoria}
                        </Typography>
                    </div>

                    {/* Botón "Leer más" */}
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
        codigo: "004",
        componente: ({ titulo, descripcion, imagen, categoria }) => (
            <div className=" bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
                {/* Contenedor de la imagen */}
                <div className="relative w-full h-40 bg-blue-400 rounded-t-lg">
                    <img
                        src={imagen}
                        alt={titulo}
                        className="w-full h-full object-cover rounded-t-lg"
                    />
                    {/* Título centrado sobre la imagen */}
                    <div className="absolute inset-0 flex justify-center items-center">
                        <Typography
                            variant="h5"
                            color="blue-gray"
                            className="font-bold text-center text-white"
                            style={{
                                whiteSpace: 'normal', // Permitir que el texto se ajuste y se mueva a la siguiente línea
                                textOverflow: 'ellipsis',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente para mayor legibilidad
                                padding: '0.5rem',
                                borderRadius: '0.25rem',
                                width: '90%', // Mantener el ancho del contenedor
                                wordWrap: 'break-word', // Asegurarse de que las palabras largas se rompan
                                overflow: 'hidden', // Ocultar el desbordamiento
                                display: 'block',
                                maxHeight: '4rem',
                                overflowY: 'auto'
                            }}
                        >
                            {titulo}
                        </Typography>
                    </div>
                </div>

                {/* Descripción */}
                <div className="p-2 flex flex-col justify-between flex-grow">
                    {descripcion && (
                        <div className="w-full" style={{ maxHeight: '4rem', overflowY: 'auto' }}>
                            <p style={{ wordWrap: "break-word", color: 'gray' }}>
                                {descripcion}
                            </p>
                        </div>
                    )}

                    {/* Categoría creativa (debajo de la descripción) */}
                    <div className="w-full text-center mt-4 mb-2">
                        <Typography
                            variant="h6"
                            className="font-bold text-nowrap h-6 p-1    bg-black text-white text-xs rounded-full transform rotate-0 z-10 "
                            style={{
                                fontStyle: 'inherit', // Estilo cursiva para un toque distintivo
                                fontSize: 18

                            }}
                        >
                                    {categoria}
                        </Typography>
                    </div>

                    {/* Botón "Leer más" */}
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
const ITEMS_POR_PAGINA = 2;

export default function Plantillas({ titulo, descripcion, imagen, categoria, onSeleccionar }) {
    const [pagina, setPagina] = useState(0);
    const [direccion, setDireccion] = useState(1); // 1: derecha, -1: izquierda
    const [seleccionada, setSeleccionada] = useState(null);

    const totalPaginas = Math.ceil(plantillas.length / ITEMS_POR_PAGINA);

    const handleNext = () => {
        setDireccion(1);
        setPagina((prev) => (prev + 1) % totalPaginas);
    };

    const handlePrev = () => {
        setDireccion(-1);
        setPagina((prev) => (prev - 1 + totalPaginas) % totalPaginas);
    };

    const plantillasVisibles = plantillas.slice(
        pagina * ITEMS_POR_PAGINA,
        (pagina + 1) * ITEMS_POR_PAGINA
    );
    const handleSeleccionar = (index) => {
        setSeleccionada(index);  // Mantiene la selección local
        onSeleccionar(plantillasVisibles[index]); // ✅ Guarda la plantilla en el estado global
    };

    return (
        <div className="relative flex items-center justify-center w-full">
            {/* Botón de flecha izquierda */}
            <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black p-3 rounded-full shadow-lg z-10"
            >
                <ChevronLeftIcon className="w-6 h-6 text-white" />
            </button>

            {/* Contenedor de las plantillas visibles con animación */}
            <div className="overflow-hidden w-[650px] h-[400px] flex justify-center items-center relative">
                <AnimatePresence initial={false} custom={direccion}>
                    <motion.div
                        key={pagina}
                        initial={{ x: direccion * 500, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -direccion * 500, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="absolute flex gap-4"
                    >
                        {plantillasVisibles.map((plantilla, index) => (
                            <div key={index} className={`w-[290px]  mx-4 cursor-pointer transition-all duration-300 ease-in-out transform ${
                                seleccionada === index ? "scale-95  border-4 border-gray-500 rounded-xl " : "scale-100" // Aumenta el tamaño cuando está seleccionada
                            }`} 
                                onClick={() => handleSeleccionar(index)}> {/* Agregué mx-4 para separar las plantillas */}
                                {plantilla.componente({ titulo, descripcion, imagen, categoria })}
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>


            {/* Botón de flecha derecha */}
            <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black p-3 rounded-full shadow-lg z-10"
            >
                <ChevronRightIcon className="w-6 h-6 text-white" />
            </button>
        </div>
    );
}