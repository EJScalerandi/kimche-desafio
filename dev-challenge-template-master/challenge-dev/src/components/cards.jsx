import React from "react";
import "./cards.css"; 
export default function Cards({ name, image }) {
    return (
        <div className="card">
            <p className="card-name">{name}</p>
            <img className="card-image" src={image} alt={name} />
        </div>
    );
}
