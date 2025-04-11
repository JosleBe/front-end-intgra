import { X } from 'lucide-react';
import React from 'react';

const Alert = ({ message, type, onClose, onConfirm }) => {
    if (!message) return null;
  
    const alertStyles = {
      success: "text-green-800 bg-green-100 border-green-400",
      error: "text-red-800 bg-white border-red-400",
      info: "text-blue-800 bg-blue-100 border-blue-400",
      warning: "text-yellow-800 bg-yellow-100 border-yellow-400",
      dark: "text-gray-800 bg-gray-200 border-gray-500",
    };

    const titleMap = {
      success: "Registro exitoso",
      error: "Error",
      info: "Información",
      warning: "Advertencia",
      dark: "Mensaje",
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {/* Contenedor del modal */}
        <div className={`w-96 p-5 rounded-lg shadow-lg border ${alertStyles[type]} transform transition-all scale-100 opacity-100`}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">{titleMap[type] || "Alerta"}</h2>
            <button onClick={onClose} className="text-black hover:text-gray-900"><X/></button>
          </div>
          <p className="text-sm">{message}</p>
          
          {/* Si el tipo es "success", mostrar el botón de "Confirmar" */}
          {type === 'success' && (
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => { 
                  if (onConfirm) onConfirm(); 
                  onClose(); // Cerrar el mensaje después de la acción
                }} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Aceptar
              </button>
            </div>
          )}
        </div>
      </div>
    );
};

export default Alert;
