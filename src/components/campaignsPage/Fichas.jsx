import React from "react";

// Componente de la ficha
const Fichas = ({ input, onDragStart }) => {
    return (
        <div
            className="flex items-center p-2 rounded-lg bg-gray-200 text-gray-800 text-sm font-medium cursor-grab"
            draggable
            onDragStart={(e) => onDragStart(e, input)}
        >
            <span>{input}</span>
            <button
                type="button"
                className="ml-2 bg-gray-50 text-gray-500 rounded-lg p-1 hover:bg-gray-300 flex items-center justify-center h-6 w-6"
                aria-label="Close"
            >
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
            </button>
        </div>
    );
};

export default Fichas;