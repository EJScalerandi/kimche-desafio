import React, { useState, useEffect } from "react";
import Cards from "./Cards";
import SearchBar from "./searchbar";
import { Link } from "react-router-dom";

export default function Homepage() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [input, setInput] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedSpecies, setSelectedSpecies] = useState('');
    const [searchResult, setSearchResult] = useState([]);
   
    useEffect(() => {
        if (searchResult === 1) {
            return;
        }
        if (searchResult.length > 1) {
            setData(searchResult);
        } else {
            fetchData(currentPage);
        }
    }, [searchResult, currentPage]);
    

    const fetchData = (page) => {
        fetch('https://rickandmortyapi.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query {
                        characters(page: ${page}) {
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
        })
        .then(response => response.json())
        .then(result => {
            setData(result.data.characters.results);
            setTotalPages(result.data.characters.info.pages);
        })
        .catch(error => console.error('Error fetching data:', error));
    };

    useEffect(() => {
        if(searchResult === 1) {
            return;
        }
        if(searchResult.length > 0) {
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
        fetchData(1);
        setCurrentPage(1);
    };

    const handleNextPage = () => {
        if(currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if(currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
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
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous Page</button>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next Page</button>
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
            </div>
        </div>
    );
}