import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from '../../assets/img/logo-pro-help.png';
import '../sidebar/css/Sidebar.css';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={`d-flex flex-column flex-shrink-0 p-3 ${isCollapsed ? 'collapsed' : ''}`} 
      style={{
        width: isCollapsed ? '80px' : '270px',
        height: '100vh',
        background: 'black',
        overflowY: 'auto',
        transition: 'width 0.3s ease-in-out' 
      }}
    >
      <a href="/" className="d-flex w-full align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        {!isCollapsed && (
        
            <img 
              style={{
                border: '2px solid white',  // Borde blanco
                padding: '5px', 
                borderRadius: 8     
                 // Espaciado entre el borde y la imagen
              }}  
             
              src={logo} 
              alt="Logo" 
            />
        
        )}
      </a>
      
      <ul className="nav nav-pills flex-column mb-auto mt-7" style={{ gap: '10px' }}> {/* Aumento de espacio entre los elementos */}
        <li className="nav-item">
          <NavLink 
            to="/profile" 
            className="nav-link" 
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#FFFFFF" : "transparent",
              color: isActive ? "black" : "white", // Texto blanco cuando no está seleccionado
           
              borderRadius: '8px',
              padding: '8px 12px',
              transition: 'background-color 0.3s ease, border 0.3s ease',
            })}
          >
            <i style={{ fontSize: 18 }} className="fas fa-home me-2"></i>
            {!isCollapsed && <span style={{ fontSize: 17, fontWeight: 500 }}>Perfil</span>}
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/campaigns" 
            className="nav-link" 
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#FFFFFF" : "transparent",
              color: isActive ? "black" : "white", // Texto blanco cuando no está seleccionado
            
              padding: '8px 12px',
              transition: 'background-color 0.3s ease, border 0.3s ease',
            })}
          >
            <i style={{ fontSize: 18 }} className="fas fa-tachometer-alt me-2"></i>
            {!isCollapsed && <span style={{ fontSize: 17, fontWeight: 500 }}>Campañas</span>}
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/chat" 
            className="nav-link" 
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#FFFFFF" : "transparent",
              color: isActive ? "black" : "white", // Texto blanco cuando no está seleccionado
           
              borderRadius: '8px',
              padding: '8px 12px',
              transition: 'background-color 0.3s ease, border 0.3s ease',
            })}
          >
            <i className="fas fa-comments me-2"></i>
            {!isCollapsed && <span style={{ fontSize: 17, fontWeight: 500 }}>Chat</span>}
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/ubicaciones" 
            className="nav-link" 
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#FFFFFF" : "transparent",
              color: isActive ? "black" : "white", // Texto blanco cuando no está seleccionado
           // Borde blanco cuando está seleccionado
              borderRadius: '8px',
              padding: '8px 12px',
              transition: 'background-color 0.3s ease, border 0.3s ease',
            })}
          >
            <i className="fas fa-map-marker-alt me-2"></i>
            {!isCollapsed && <span style={{ fontSize: 17, fontWeight: 500 }}>Ubicaciones</span>}
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
