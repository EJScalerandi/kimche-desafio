// CardDescription.js
import React from "react";

export default function CardDescription({ id, name, description }) {s
    return (
        <div>
            <h2>{name}</h2>
            <p>ID: {id}</p>
            <p>Description: {description}</p>
        </div>
    );
}
