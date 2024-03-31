import React, { useState, useEffect } from "react";

export default function Searchbar({ setSearchResult }) {
    const [input, setInput] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [dataCharacter, setDataCharacter] = useState(null);

    useEffect(() => {
        if (!input && !selectedGender) return; // Si no hay entrada ni género seleccionado, no hagas nada

        // Construir la query de GraphQL basada en los filtros
        const query = `
            query {
                characters(filter: {
                    name: "${input}",
                    gender: "${selectedGender}"
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
        .then(data => setSearchResult(data.data.characters.results))
        .catch(error => console.error('Error fetching data:', error));
    }, [input, selectedGender, setSearchResult]); 

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleGenderChange = (event) => {
        setSelectedGender(event.target.value);
    };

    return (
        <div>
            <input 
                type="text" 
                placeholder="Search" 
                value={input} 
                onChange={handleInputChange} 
            />
            <select value={selectedGender} onChange={handleGenderChange}>
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Genderless">Genderless</option>
                <option value="unknown">Unknown</option>
            </select>
            {dataCharacter && (
                <div>
                    <p>name: {dataCharacter.name}</p>
                    <img src={dataCharacter.image} alt={dataCharacter.name} />
                </div>
            )}
        </div>
    );
}
