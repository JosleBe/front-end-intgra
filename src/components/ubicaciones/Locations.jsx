import React, { useEffect, useState } from "react";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import FormLabel from "@mui/joy/FormLabel";
import FormControl from "@mui/joy/FormControl";

import { Autocomplete, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Buscar from '../../assets/img/buscar_campa.jpg'
import { NavLink, useLocation } from "react-router-dom";
import Mapa from "../mapa/MapaInfo";


const Ubicaciones = () => {
  const [searchData, setSearchData] = useState({
    country: "México",
    state: "",
    city: "",
    street: "",
    number: "",
  });

  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [colonias, setColonias] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [selectedColonia, setSelectedColonia] = useState(null);
  const [showData, setShowData] = useState(false);
  const [alignment, setAlignment] = useState("Campañas");
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment)
  }

  const location = useLocation();
  useEffect(() => {
    fetch('http://localhost:3001/estados/1')
      .then(response => response.json())
      .then(data => setEstados(data))
      .catch(error => console.error('Error cargando estados:', error));
  }, []);

  useEffect(() => {
    if (selectedEstado) {
      fetch(`http://localhost:3001/municipios/${selectedEstado.id}`)
        .then(response => response.json())
        .then(data => setMunicipios(data))
        .catch(error => console.error('Error cargando municipios:', error));
    }
  }, [selectedEstado]);

  useEffect(() => {
    if (selectedMunicipio) {
      fetch(`http://localhost:3001/colonias/${selectedMunicipio.id}`)
        .then(response => response.json())
        .then(data => setColonias(data))
        .catch(error => console.error('Error cargando colonias:', error));
    }
  }, [selectedMunicipio]);

  const handleSearch = () => {
    setSearchData({
      ...searchData,
      state: selectedEstado?.nombre || "",
      city: selectedMunicipio?.nombre || "",
      street: `${selectedColonia?.nombre || ""} ${searchData.street}`.trim(),
    });
    setShowData(true);
  };

  return (
    <div>
      <Box sx={{ flex: 1, width: '100%' }}>
        <Box sx={{ px: { xs: 2, md: 6 } }}>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 1}}>
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
                    Ubicaciones
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
                      bgcolor: location.pathname === '/ubicaciones' ? 'black' : 'rgba(0, 0, 0, 0.1)', // Fondo más oscuro al hover
                      color: 'white', // Cambiar el color del texto al hacer hover
                    },
                    transition: 'all 0.3s ease', // Transición suave
                  }}
                >
                  <NavLink to="/campaigns" style={{ textDecoration: 'none' }}>
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
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", flexDirection: 'column', alignItems: 'center', }}>
        <Box sx={{ width: "100%", maxWidth: 1300, p: 2, height: 500 }}>
          <Box sx={{ display: "flex", gap: 3, background: '#FFF', p: 3, boxShadow: 3, borderRadius: "lg" }}>
            {/* Contenedor de los Inputs - Siempre ocupa el 50% */}
            <Box sx={{ width: "40%", minWidth: "400px", display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ bgcolor: "background.level3", p: 2, borderRadius: "sm", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                <Typography level="body2" sx={{ fontWeight: "bolder", fontSize: 18 }}>
                  Agregar nueva ubicación
                </Typography>
                <Typography level="body2" sx={{ fontSize: 14, color: "text.secondary" }}>
                  Ingresa el estado, municipio y colonia, e ingresa la calle y número. Verifica la ubicación en el mapa y regístrala si es correcta.
                </Typography>
              </Box>

              <FormControl fullWidth>
                <FormLabel>Estado</FormLabel>
                <Autocomplete
                  options={estados}
                  getOptionLabel={(option) => option.nombre}
                  value={selectedEstado}
                  onChange={(_, newValue) => setSelectedEstado(newValue)}
                  renderInput={(params) => <TextField {...params} variant="outlined" size="small" placeholder="Selecciona un estado" />}
                  sx={{
                    "& .MuiInputBase-root": { borderRadius: 2, boxShadow: 1 },
                    "& .MuiAutocomplete-popupIndicator": { display: "none" },
                  }}
                />
              </FormControl>

              {selectedEstado && (
                <FormControl fullWidth>
                  <FormLabel>Municipio</FormLabel>
                  <Autocomplete
                    options={municipios}
                    getOptionLabel={(option) => option.nombre}
                    value={selectedMunicipio}
                    onChange={(_, newValue) => setSelectedMunicipio(newValue)}
                    renderInput={(params) => <TextField {...params} variant="outlined" size="small" placeholder="Selecciona un municipio" />}
                    sx={{
                      "& .MuiInputBase-root": { borderRadius: 2, boxShadow: 1 },
                      "& .MuiAutocomplete-popupIndicator": { display: "none" },
                    }}
                  />
                </FormControl>
              )}

              {selectedMunicipio && (
                <FormControl fullWidth>
                  <FormLabel>Colonia</FormLabel>
                  <Autocomplete
                    options={colonias}
                    getOptionLabel={(option) => option.nombre}
                    value={selectedColonia}
                    onChange={(_, newValue) => setSelectedColonia(newValue)}
                    renderInput={(params) => <TextField {...params} variant="outlined" size="small" placeholder="Selecciona una colonia" />}
                    sx={{
                      "& .MuiInputBase-root": { borderRadius: 2, boxShadow: 1 },
                      "& .MuiAutocomplete-popupIndicator": { display: "none" },
                    }}
                  />
                </FormControl>
              )}

              <Stack direction="row" spacing={1}>
                <FormControl fullWidth>
                  <FormLabel>Calle/Número</FormLabel>
                  <TextField
                    size="small"
                    placeholder="Ej. calle 2 numero 43"
                    onChange={(e) => setSearchData({ ...searchData, street: e.target.value })}
                    sx={{
                      borderRadius: 2,
                      boxShadow: 1,
                    }}
                  />
                </FormControl>
              </Stack>

              <Button
                variant="solid"
                sx={{
                  backgroundColor: 'black',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  "&:hover": { backgroundColor: '#556b2f' },
                  transition: 'all 0.3s ease',
                }}
                onClick={handleSearch}
              >
                Buscar
              </Button>
            </Box>

            {/* Contenedor elegante para el Mapa o Imagen */}
            <Box
              sx={{
                width: "60%",
                minWidth: "400px",
                background: '#FFF',
                height: "440px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {showData ? (
                <Mapa searchData={searchData} />
              ) : (
                <div style={{ textAlign: "center" }}>
                  <Typography sx={{ fontWeight: "700", fontSize: "20px", marginBottom: 2, color: "#444" }}>
                    Encuentra nuevas ubicaciones
                  </Typography>
                  <img
                    src={Buscar}
                    alt="Buscar ubicación"
                    style={{
                      width: '50%',
                      height: 'auto',
                      margin: '0 auto',
                      objectFit: "contain", // Ajustar la imagen sin deformarla
                      borderRadius: "12px",
                    }}
                  />
                </div>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </div>

  );
};

export default Ubicaciones;
