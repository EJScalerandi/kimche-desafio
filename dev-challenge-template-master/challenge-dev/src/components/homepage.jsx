import React, { useState, useEffect } from "react";
import Cards from "./Cards";
import SearchBar from "./searchbar";
import { Link } from "react-router-dom";
import rickAndMortyImage from "../assets/rickandmorty.jpg";

export default function Homepage() {
    const [originalData, setOriginalData] = useState([]);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [input, setInput] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedSpecies, setSelectedSpecies] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const pageSize = 24; 
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const allCharacters = [];

            
            for (let i = 1; i <= 5; i++) {
                const response = await fetch('https://rickandmortyapi.com/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                            query {
                                characters(page: ${i}) {
                                    info {
                                        pages
                                    }
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
                });
                const result = await response.json();
                allCharacters.push(...result.data.characters.results);
            }

            setOriginalData(allCharacters);
            applyFiltersAndPagination(allCharacters);
            setTotalPages(5); 
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const applyFiltersAndPagination = (characters) => {
        let filteredData = characters.filter(character => {
            return (
                character.name.toLowerCase().includes(input.toLowerCase()) &&
                (selectedGender === '' || character.gender === selectedGender) &&
                (selectedStatus === '' || character.status === selectedStatus) &&
                (selectedSpecies === '' || character.species === selectedSpecies)
            );
        });
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setData(filteredData.slice(startIndex, endIndex));
    };

    useEffect(() => {
        if (searchResult !== 1 && searchResult.length > 0) {
            applyFiltersAndPagination(searchResult);
        } else {
            applyFiltersAndPagination(originalData);
        }
    }, [searchResult, input, selectedGender, selectedStatus, selectedSpecies, currentPage, originalData]);

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
        setInput('');
        setSearchResult([]);
        fetchData();
        setCurrentPage(1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div style={{
            backgroundImage: `url(${rickAndMortyImage})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            padding: '20px'
        }}>

            <div>
                <SearchBar setSearchResult={setSearchResult} setInput={setInput} />
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
                        <Link key={character.id} to={`/detail/${character.id}`}>
                            <Cards
                                id={character.id}
                                name={<span>{character.name}</span>}
                                image={character.image}
                            />
                        </Link>
                    ))
                ) : (
                    <p>No hay datos disponibles</p>
                )}
                <br />
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous Page</button>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next Page</button>
            </div>
        </div>
    );
}
