import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function CardDetail() {
    const [characterData, setCharacterData] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const { id } = useParams();
    
    useEffect(() => {
        fetch(`https://rickandmortyapi.com/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query {
                        character(id: "${id}") {
                            id
                            name
                            image
                            status
                            origin {
                                id
                                name
                                dimension
                                residents {
                                    id
                                    name
                                }
                            }
                        }
                    }
                `
            })
        })
        .then(response => response.json())
        .then(data => {
            setCharacterData(data.data.character);
            const originId = data.data.character.origin.id;
            fetch(`https://rickandmortyapi.com/graphql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        query {
                            location(id: "${originId}") {
                                id
                                name
                                type
                                dimension
                                residents {
                                    id
                                    name
                                }
                            }
                        }
                    `
                })
            })
            .then(response => response.json())
            .then(data => {
                // Verifica si el id es null
                if (!originId) {
                    // Asigna valores predefinidos a locationData si el id es null
                    setLocationData({
                        id: "unknown",
                        name: "unknown",
                        type: "unknown",
                        dimension: "unknown",
                        residents: []
                    });
                } else {
                    setLocationData(data.data.location);
                }
            })
            .catch(error => console.error('Error fetching location data:', error));
        })
        .catch(error => console.error('Error fetching character data:', error));
    }, [id]);
    

    return (
        <div>
            {characterData && locationData ? (
                <div>
                    <h1>{characterData.name}</h1>
                    <img src={characterData.image} alt={characterData.name} />
                    <p>Status: {characterData.status}</p>
                    <p>Origin: {characterData.origin.name}</p>
                    <p>Origin Dimension: {characterData.origin.dimension}</p>
                 
                    <p>Location: {locationData.name}</p>
                    <p>Location Type: {locationData.type}</p>
                    <p>Location Dimension: {locationData.dimension}</p>
                </div>
            ) : (
                <p>Cargando...</p>
            )}
        </div>
    );
}
