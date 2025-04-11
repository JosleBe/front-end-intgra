import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from '../../assets/img/logo-pro-help.png';
import '../sidebar/css/Sidebar.css';
import { NavLink } from 'react-router-dom';
import { User } from 'lucide-react';
import UserService from '../../service/UserService';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profile, setProfile] = useState({
    id: "guest",
    name: "Invitado",
    role: "guest",
    email: null,
    sexo: null
  });

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("profileInfo"));
    if (storedProfile) {
      setProfile(storedProfile);
    }
  }, []); 
  return (
    <div
      className={`d-flex flex-column flex-shrink-0 p-3 ${isCollapsed ? 'collapsed' : ''}`}
      style={{
        width: isCollapsed ? '80px' : '270px',
        height: '100vh',
        background: '#AFCCD0',
        overflowY: 'auto',
        transition: 'width 0.3s ease-in-out'
      }}
    >
      <a href="/" style={{ borderRadius: 10, borderWidth: 4, borderColor: 'white' }} className="d-flex w-full bg-black overflow-hidden align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        {!isCollapsed && (

          <img
            style={{
              border: '3px solid ',  // Borde blanco
              overflow: 'hidden',
              padding: '5px',
              borderRadius: 8,
              backgroundColor: 'blacks', // Fondo blanco
            }}

            src={logo}
            alt="Logo"
          />

        )}
      </a>

      <ul className="nav nav-pills flex-column mb-auto mt-7" style={{ gap: '10px' }}> {/* Aumento de espacio entre los elementos */}
        {
          profile.role !== "guest" && <li className="nav-item">
            <NavLink
              to="/profile"
              className="nav-link"
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#FFFFFF" : "transparent",
                color: isActive ? "black" : "black", // Texto blanco cuando no está seleccionado

                borderRadius: '8px',
                padding: '8px 12px',
                transition: 'background-color 0.3s ease, border 0.3s ease',
              })}
            >
              <i style={{ fontSize: 18 }} className="fas fa-home me-2"></i>
              {!isCollapsed && <span style={{ fontSize: 17, fontWeight: 500 }}>Perfil</span>}
            </NavLink>
          </li>
        }


        <li>
          <NavLink
            to="/campaigns"
            className="nav-link"
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#FFFFFF" : "transparent",
              color: isActive ? "black" : "black", // Texto blanco cuando no está seleccionado

              padding: '8px 12px',
              transition: 'background-color 0.3s ease, border 0.3s ease',
            })}
          >
            <i className="fas fa-bullhorn me-2"></i>

            {!isCollapsed && <span style={{ fontSize: 17, fontWeight: 500 }}>Campañas</span>}
          </NavLink>
        </li>
        {
          profile.role !== "guest" && (
            <li>

              <NavLink
                to="/chat"
                className="nav-link"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#FFFFFF" : "transparent",
                  color: isActive ? "black" : "black", // Texto blanco cuando no está seleccionado

                  borderRadius: '8px',
                  padding: '8px 12px',
                  transition: 'background-color 0.3s ease, border 0.3s ease',
                })}
              >
                <i className="fas fa-comments me-2"></i>
                {!isCollapsed && <span style={{ fontSize: 17, fontWeight: 500 }}>Chat</span>}
              </NavLink>
            </li>
          )
        }

        {
          UserService.isAdmin() && (
            <li>
              <NavLink
                to="/ubicaciones"
                className="nav-link"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#FFFFFF" : "transparent",
                  color: isActive ? "black" : "black", // Texto blanco cuando no está seleccionado
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
          )
        }

        {

          /*
             <li>
          <NavLink 
            to="/record" 
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
            {!isCollapsed && <span style={{ fontSize: 17, fontWeight: 500 }}>Historial</span>}
          </NavLink>
        </li>
          */
        }

        {
          UserService.isAdmin() && (
            <li>
              <NavLink
                to="/donations"
                className="nav-link"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#FFFFFF" : "transparent",
                  color: isActive ? "black" : "black", // Texto blanco cuando no está seleccionado
                  // Borde blanco cuando está seleccionado
                  borderRadius: '8px',
                  padding: '8px 12px',
                  transition: 'background-color 0.3s ease, border 0.3s ease',
                })}
              >
                <i className="fas fa-hand-holding-heart me-2"></i>

                {!isCollapsed && <span style={{ fontSize: 17, fontWeight: 500 }}>Donaciones</span>}
              </NavLink>
            </li>

          )
        }


        {
          UserService.isAdmin() && (
            <li>
              <NavLink
                to="/usuarios"
                className="nav-link"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#FFFFFF" : "transparent",
                  color: isActive ? "black" : "black", // Texto blanco cuando no está seleccionado
                  // Borde blanco cuando está seleccionado
                  borderRadius: '8px',
                  padding: '8px 12px',
                  transition: 'background-color 0.3s ease, border 0.3s ease',
                })}
              >
                <i className="fas fa-user me-2"></i>
                {!isCollapsed && <span style={{ fontSize: 17, fontWeight: 500 }}>Usuarios</span>}
              </NavLink>
            </li>
          )
        }

      </ul>
    </div>
  );
}

export default Sidebar;
