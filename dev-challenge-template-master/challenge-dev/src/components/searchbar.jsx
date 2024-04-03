import React, { useState } from "react";

export default function Searchbar({ setSearchResult }) {
    const [input, setInput] = useState('');

    const handleSearch = () => {
        if (!input) return;
    
        const query = `
            query {
                characters(filter: {
                    name: "${input}"
                }) {
                    results {
                        id
                        name
                        image
                        gender
                        species
                    }
                }
            }
        `;
    
        fetch('https://rickandmortyapi.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }, 
            body: JSON.stringify({ query })
        })
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data.data.characters.results) && data.data.characters.results.length === 0) {
                setSearchResult(1); 
            } else {
                setSearchResult(data.data.characters.results);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
    };

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    return (
        <div style={{ marginBottom: '20px' }}> 
            <input 
                type="text" 
                placeholder="Buscar" 
                value={input} 
                onChange={handleInputChange} 
                style={{ marginRight: '10px', height: '40px', fontSize: '1.1em', textAlign: 'center', borderRadius: '5px' }} /* Aplicar estilos */
            />
            <button onClick={handleSearch} style={{ border: '1px solid #ff0505', borderRadius: '5px', padding: '5px 10px', height: '40px', fontSize: '1.1em' }}>Buscar</button> {/* Aplicar estilos */}
        </div>
    );
}
