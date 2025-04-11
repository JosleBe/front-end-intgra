import React, { useState, useEffect } from "react";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import axios from "axios";
import Swal from 'sweetalert2';
const API_KEY = "AIzaSyDZhoJFtRUBaI9v9YmSYIJ_pMWHGHj2RH0";

const Mapa = ({ searchData }) => {
  const [coordinates, setCoordinates] = useState({ lat: 22.54992, lng: 0 });
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [apiData, setApiData] = useState(null);



const handleRegisterLocation = () => {
  if (!apiData) {
    Swal.fire({
      title: 'Sin datos',
      text: 'No se ha cargado la información de la ubicación.',
      icon: 'warning',
      confirmButtonText: 'Aceptar',
    });
    return;
  }

  Swal.fire({
    title: '¿Registrar ubicación?',
    text: '¿Deseas registrar esta ubicación ahora?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, registrar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: 'black',
    cancelButtonColor: 'gray',
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .post(
          'http://localhost:8080/api/location/save',
          {
            address: apiData.formattedAddress,
            coordinates: apiData.coordinates,
            city: apiData.city,
            state: apiData.state,
            country: apiData.country,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          console.log('✅ Ubicación registrada:', response.data);
          Swal.fire({
            title: 'Registrado',
            text: 'La ubicación se registró correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            window.location.reload();
          });
        })
        .catch((error) => {
          console.error('❌ Error al registrar la ubicación:', error);
          Swal.fire({
            title: 'Error',
            text: 'Hubo un error al registrar la ubicación.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        });
    }
  });
};


useEffect(() => {
  if (!searchData) return;

  const fetchCoordinates = async () => {
    const address = `${searchData.street} ${searchData.number}, ${searchData.city}, ${searchData.state}, ${searchData.country}`;

    try {
      const apiKey = "AIzaSyDZhoJFtRUBaI9v9YmSYIJ_pMWHGHj2RH0";
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${apiKey}`
      );

      const data = await response.json();

      if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        const formattedAddress = data.results[0].formatted_address;
        const addressComponents = data.results[0].address_components;

        const city = addressComponents.find((component) =>
          component.types.includes("locality")
        )?.long_name;
        const state = addressComponents.find((component) =>
          component.types.includes("administrative_area_level_1")
        )?.long_name;
        const country = addressComponents.find((component) =>
          component.types.includes("country")
        )?.long_name;

        setApiData({
          formattedAddress,
          coordinates: location,
          city,
          state,
          country,
        });

        setCoordinates(location);
      } else {
        console.error("Error en la geocodificación:", data.status);
        alert("No se pudo encontrar la ubicación. Verifica la dirección.");
      }
    } catch (error) {
      console.error("Error al llamar a la API de geocodificación:", error);
      alert("Hubo un error al buscar la ubicación.");
    }
  };

  fetchCoordinates();
}, [searchData]);

return (
  <APIProvider apiKey={API_KEY}>
    <Box
      sx={{
        display: "flex",  // Contenedor flexible
        gap: 2,  // Espacio entre el mapa y la información
        width: "100%",  // Ancho completo
        height: "100%",  // Altura completa
      }}
    >
      {/* Mapa (lado izquierdo) */}
      <Box
        sx={{
          flex: 2,  // El mapa ocupa 2/3 del espacio
          height: "440px",  // Altura fija para el mapa
          borderRadius: "12px",  // Bordes redondeados
          overflow: "hidden",  // Evita que el mapa sobresalga
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",  // Sombra
        }}
      >
        <Map
          mapId={"bf51a910020fa25a"}
          defaultZoom={17}
          defaultCenter={coordinates}
          center={coordinates}
          gestureHandling={"greedy"}
          disableDefaultUI={false}
        >
          <AdvancedMarker ref={markerRef} position={coordinates} />
        </Map>
      </Box>

      {/* Información de la ubicación (lado derecho) */}
      <Box
        sx={{
          flex: 1,  // La información ocupa 1/3 del espacio
          maxWidth: 400,  // Ancho máximo
          p: 2,  // Padding
          bgcolor: "background.level2",  // Color de fondo
          borderRadius: "sm",  // Bordes redondeados
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",  // Sombra
        }}
      >
        <Typography level="h4" sx={{ mb: 2 }}>
          Información de la ubicación
        </Typography>
        {apiData ? (
          <>
            <Typography><strong>Dirección:</strong> {apiData.formattedAddress}</Typography>
            <Typography><strong>Coordenadas:</strong> Lat: {apiData.coordinates.lat}, Lng: {apiData.coordinates.lng}</Typography>
            <Typography><strong>Ciudad:</strong> {apiData.city}</Typography>
            <Typography><strong>Estado:</strong> {apiData.state}</Typography>
            <Typography><strong>País:</strong> {apiData.country}</Typography>
          </>
        ) : (
          <Typography>No se ha cargado la información de la ubicación.</Typography>
        )}

        <Button

          style={{ background: 'white', color: 'black' }}
          onClick={handleRegisterLocation}
          sx={{ mt: 2 }}
        >
          Registrar ubicación
        </Button>
      </Box>
    </Box>
  </APIProvider>
);
};

export default Mapa;