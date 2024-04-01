import React, { useState, useEffect } from "react";

export default function Searchbar({ setSearchResult }) {
    const [input, setInput] = useState('');

    useEffect(() => {
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
        </div>
    );
}
