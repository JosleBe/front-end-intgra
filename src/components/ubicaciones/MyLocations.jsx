import { useState, useEffect } from "react";
import axios from "axios";
import BackMapa from "../../assets/img/mapa-back.png"
import Mapa from "../mapa/Mapa"; // Asegúrate de que el componente Mapa esté bien importado
import { Button, Modal, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { NavLink, useLocation } from "react-router-dom";
import Box from "@mui/joy/Box";

import Typography from "@mui/joy/Typography";
const MyUbications = () => {
  const [ubications, setUbications] = useState([]);
  const [alignment, setAlignment] = useState("Campañas");
  const [selectedCoordinates, setSelectedCoordinates] = useState({ lat: null, lng: null }); // Estado para guardar las coordenadas seleccionadas
  const location = useLocation();  // Hook para obtener la ubicación actual de la ruta
  const [openModal, setOpenModal] = useState(false);
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment)
  }
  useEffect(() => {
    const fetchUbications = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/location/getAll", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUbications(response.data);
      } catch (error) {
        console.error("Error al obtener las ubicaciones:", error);
      }
    };

    fetchUbications();
  }, []);
  // Función para abrir el modal y pasar las coordenadas
  const handleOpenModal = (lat, lng) => {
    setSelectedCoordinates({ lat, lng });
    setOpenModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div>
      <Box Icon sx={{ flex: 1, width: '100%' }}>
        <Box sx={{ px: { xs: 2, md: 6 } }}>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 1 }}>
            {/* Título Campañas */}
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
                    Tabla de Ubicaciones
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Botones de navegación */}
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
                    bgcolor: location.pathname === '/ubicaciones' ? 'black' : 'transparent', // Fondo personalizado
                    color: location.pathname === '/ubicaciones' ? 'white' : 'black', // Texto con color personalizado
                    borderRadius: '20px', // Bordes redondeados
                    padding: '10px 20px', // Espaciado interno
                    fontSize: 16,
                    fontWeight: 500,
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: location.pathname === '/ubicaciones' ? '#6f4f33' : 'rgba(0, 0, 0, 0.1)', // Fondo más oscuro al hover
                      color: 'white', // Cambiar el color del texto al hacer hover
                    },
                    transition: 'all 0.3s ease', // Transición suave
                  }}
                >
                  <NavLink to="/ubicaciones" style={{ textDecoration: 'none' }}>
                    <Typography sx={{ color: location.pathname === '/ubicaciones' ? 'white' : 'black' }}>
                      Registro de ubicaciones
                    </Typography>
                  </NavLink>
                </ToggleButton>

                <ToggleButton
                  value="android"
                  sx={{
                    bgcolor: location.pathname === '/ubicaciones-registrar' ? 'black' : 'transparent', // Fondo personalizado
                    color: location.pathname === '/ubicaciones-registrar' ? 'white' : 'black', // Texto con color personalizado
                    borderRadius: '20px', // Bordes redondeados
                    padding: '10px 20px', // Espaciado interno
                    fontSize: 16,
                    fontWeight: 500,
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: location.pathname === '/ubicaciones-registrar' ? 'black' : 'rgba(0, 0, 0, 0.1)', // Fondo más oscuro al hover
                      color: 'white', // Cambiar el color del texto al hacer hover
                    },
                    transition: 'all 0.3s ease', // Transición suave
                  }}
                >
                  <NavLink to="/ubicaciones-registrar" style={{ textDecoration: 'none' }}>
                    <Typography sx={{ color: location.pathname === '/ubicaciones-registrar' ? 'white' : 'black' }}>
                      Consulta de ubicaciones
                    </Typography>
                  </NavLink>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </Box>
      </Box>
      <div className="w-10/12 mx-auto mt-4">
        {/* Título */}
        <div className="flex justify-center items-center mb-4">
         
        </div>

        {/* Tabla de Ubicaciones */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-[500px] overflow-y-auto">
          <table className="w-full text-sm text-left rtl:text-right bg-black text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-3 text-center">Ubicación</th>
                <th scope="col" className="px-6 py-3 text-center">Estado</th>
                <th scope="col" className="px-6 py-3 text-center">Ciudad</th>
                <th scope="col" className="px-6 py-3 text-center">Colonia</th>
                <th scope="col" className="px-6 py-3 text-center">Coordenadas</th>
              </tr>
            </thead>
            <tbody>
              {ubications.length > 0 ? (
                ubications.map((ubic, index) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td
                      style={{
                        backgroundImage: `url(${BackMapa})`,
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        height: '90px',
                        width: '80%',
                        borderRadius: '12px',
                        padding: '10px',
                        margin: '10px',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',  // Cambia el cursor para indicar que es clickeable
                      }}
                      className="w-full h-32 p-3 text-center flex justify-center items-center"
                      onClick={() => handleOpenModal(ubic.coordinates.lat, ubic.coordinates.lng)}  // Abre el modal con las coordenadas
                    >
                      <div className="absolute inset-0 flex justify-center items-center z-10">
                        <div className="bg-black bg-opacity-50 p-2 rounded-lg shadow-lg text-white text-center">
                          <i className="fas fa-map-marker-alt mr-2 text-lg text-red-900 transition-all"></i>
                          <span className="text-sm">Ver mapa</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center text-gray-800 font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <i className="fas fa-flag text-black"></i> {ubic.state}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {ubic.city}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {ubic.address}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div style={{ background: '#F1F0EC' }} className="p-3 rounded-lg shadow-sm hover:bg-gray-200 transition-all">
                        <p className="text-sm mb-2 text-slate-700">
                          <span className="font-semibold text-black">Latitud:</span> {ubic.coordinates.lat}
                        </p>
                        <p className="text-sm text-slate-700">
                          <span className="font-semibold text-black">Longitud:</span> {ubic.coordinates.lng}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No hay ubicaciones registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg w-11/12 md:w-1/2">
          <Typography id="modal-title" variant="h6" component="h2">
            Mapa de Ubicación
          </Typography>
          <div id="modal-description" className="mt-4">
            <Mapa lat={selectedCoordinates.lat} lng={selectedCoordinates.lng} height={400}/>  {/* Muestra el mapa con las coordenadas */}
            <Button onClick={handleCloseModal} className="mt-4" fullWidth>
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>
    </div>

  );
};

export default MyUbications;
