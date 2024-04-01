// Homepage.jsx
import React, { useState, useEffect } from "react";
import Cards from "./Cards";
import SearchBar from "./searchbar";

export default function Homepage() {
    const [data, setData] = useState([]);
    const [backUp, setBackUp] = useState([]);
    const [input, setInput] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedSpecies, setSelectedSpecies] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
        fetch('https://rickandmortyapi.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query {
                        characters {
                            results {
                                id
                                name
                                image
                                status
                                gender
                                species
                            }
                        }
                    }
                `
            })
        })
        .then(response => response.json())
        .then(data => {
            setData(data.data.characters.results);
            setBackUp(data.data.characters.results);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        if(searchResult === 1){
            return};
        if(searchResult.length > 0){
            setData(searchResult);
        }
    }, [searchResult]);
    
    useEffect(() => {
        const filteredData = data.filter(character => {
            return (
                character.name.toLowerCase().includes(input.toLowerCase()) &&
                (selectedGender === '' || character.gender === selectedGender) &&
                (selectedStatus === '' || character.status === selectedStatus) &&
                (selectedSpecies === '' || character.species === selectedSpecies)
            );
        });
        setData(filteredData);
    }, [selectedGender, selectedStatus, selectedSpecies]);
    
    const handleGenderChange = (event) => {
        setSelectedGender(event.target.value);
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    const handleSpeciesChange = (event) => {
        setSelectedSpecies(event.target.value);
    };

const handleResetFilters = () => {
    setSelectedGender('');
    setSelectedStatus('');
    setSelectedSpecies('');
    setSearchResult([]);
    setData(backUp);
};



    return (
        <div>
            <div>
                <SearchBar setSearchResult={setSearchResult} />
            </div>
            <select value={selectedGender} onChange={handleGenderChange}>
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Genderless">Genderless</option>
                <option value="unknown">Unknown</option>
            </select>
            <select value={selectedStatus} onChange={handleStatusChange}>
                <option value="">All Statuses</option>
                <option value="Alive">Alive</option>
                <option value="Dead">Dead</option>
                <option value="unknown">Unknown</option>
            </select>
            <select value={selectedSpecies} onChange={handleSpeciesChange}>
                <option value="">All Species</option>
                <option value="Human">Human</option>
                <option value="Alien">Alien</option>
                <option value="Animal">Animal</option>
                <option value="Robot">Robot</option>
                <option value="unknown">Unknown</option>
            </select>
            <button onClick={handleResetFilters}>Reset Filters</button>
            <div>
                {data.length > 0 ? (
                    data.map(character => (
                        <Cards
                            key={character.id} 
                            id={character.id}
                            name={character.name}
                            image={character.image}
                            status={character.status}
                        />
                    ))
                ) : (
                    <p>No hay datos disponibles</p>
                )}
            </div>
        </div>
    );
}
