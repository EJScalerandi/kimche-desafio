import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import rickAndMortyImage from "../assets/rickandmorty.jpg";

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
                if (!originId) {
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
        <div style={{
            backgroundImage: `url(${rickAndMortyImage})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat',
            minHeight: 'calc(100vh - 5cm)', 
            padding: '20px',
            paddingBottom: '5cm', 
            boxSizing: 'border-box', 
            textAlign: 'center', 
        }}>
            <div className="card" style={{ 
                border: '1px solid #ff0505',
                borderRadius: '12px',
                padding: '16px',
                margin: '8px',
                width: '350px',
                display: 'inline-block',
                transition: 'transform 0.5s',
                
            }}>
                {characterData && locationData ? (
                    <div>
                        <h1 className="card-name">{characterData.name}</h1>
                        <img className="card-image" src={characterData.image} alt={characterData.name} />
                        <p>Status: {characterData.status}</p>
                        <p>Origin: {characterData.origin.name}</p>
                        <p>Origin Dimension: {characterData.origin.dimension}</p>
                     
                        <p>Location: {locationData.name}</p>
                        <p>Location Type: {locationData.type}</p>
                        <p>Location Dimension: {locationData.dimension}</p>

                   
                        <Link to="/" style={{
                            display: 'inline-block',
                            textDecoration: 'none',
                            border: '1px solid rgba(0, 0, 0, 0.3)', 
                            borderRadius: '4px', 
                            backgroundColor: 'rgba(255, 255, 255, 0.7)', 
                            padding: '8px 16px', 
                            color: '#000', 
                        }}>Volver</Link>
                    </div>
                ) : (
                    <p>Cargando...</p>
                )}
            </div>
        </div>
    );
}
