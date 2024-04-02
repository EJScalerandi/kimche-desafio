import React from "react";
import "./cards.css"; // Importa el archivo de estilos CSS

export default function Cards({ name, image }) {
    return (
        <div className="card">
            <p className="card-name">{name}</p>
            <img className="card-image" src={image} alt={name} />
        </div>
    );
}
