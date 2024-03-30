import React from "react";

export default function Cards({ id, name, image }) {
    return (
        <div>
            <p>name: {name}</p>
            <img src={image} alt={name} />
        </div>
    );
}
