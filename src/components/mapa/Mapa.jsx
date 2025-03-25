import { APIProvider, AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import PropTypes from "prop-types";

const API_KEY = "AIzaSyDZhoJFtRUBaI9v9YmSYIJ_pMWHGHj2RH0";

const Mapa = ({ lat, lng, height }) => {
  return (
    <APIProvider apiKey={API_KEY}>
      <div style={{height: `${height}px`}} className="w-full rounded-lg shadow-lg">
        <Map
          mapId="bf51a910020fa25a"
          defaultZoom={18}
          gestureHandling="greedy"
          disableDefaultUI={false}
          defaultCenter={{ lat, lng }}
          style={{ width: "100%", height: "100%" }} // Asegura que el mapa ocupe todo el contenedor
        >
          <AdvancedMarker position={{ lat, lng }} />
        </Map>
      </div>
    </APIProvider>
  );
};

Mapa.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
};

export default Mapa;
