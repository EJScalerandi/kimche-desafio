import React, { useState, useEffect } from "react";

export default function Searchbar() {
    const [dataCharacter, setDataCharacter] = useState(null);
    const [input, setInput] = useState('');

    useEffect(() => {
        if (!input) return; 
        fetch('https://rickandmortyapi.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query {
                        characters(filter: { name: "${input}" }) {
                            results {
                                id
                                name
                                image
                            }
                        }
                    }
                `
            })
        })
        .then(response => response.json())
        .then(data => setDataCharacter(data.data.characters.results[0])) 
        .catch(error => console.error('Error fetching data:', error));
    }, [input]); 

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    return (
        <div>
            <input 
                type="text" 
                placeholder="Search" 
                value={input} 
                onChange={handleInputChange} 
            />
            {dataCharacter && (
                <div>
                    <p>name: {dataCharacter.name}</p>
                    <img src={dataCharacter.image} alt={dataCharacter.name} />
                </div>
            )}
        </div>
    );
}