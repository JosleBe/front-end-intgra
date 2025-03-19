import Sidebar from "../components/sidebar/Sidebar.jsx";
import React from "react";
const Layout = ({ children }) => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar /> {/* El sidebar se mantendrá fijo en el lado izquierdo */}
      
      {/* Contenedor del contenido principal */}
      <div 
        style={{ 
          flex: 1, 
          padding: "20px", 
          overflowY: "auto", // Hace que el contenido sea desplazable
          height: "100vh" // Hace que el contenido ocupe todo el alto de la ventana
        }}
      >
        {children} {/* Este es el contenido que se pasará como children */}
      </div>
    </div>
  );
};

export default Layout;
