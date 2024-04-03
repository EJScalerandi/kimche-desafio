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
            backgroundRepeat: 'repeat',
            backgroundAttachment: 'fixed', 
            minHeight: 'calc(100vh - 5cm)', 
            padding: '20px',
            paddingBottom: '5cm', 
            boxSizing: 'border-box', 
        }}>

            <div style={{ marginBottom: '20px' }}> 
                <SearchBar setSearchResult={setSearchResult} setInput={setInput} />
            </div>
            <div style={{ display: 'flex', marginBottom: '20px' }}> 
                <select value={selectedGender} onChange={handleGenderChange} style={{ flex: '1', marginRight: '10px', height: '40px', fontSize: '1.1em', textAlign: 'center', borderRadius: '5px' }}> {/* Estilo flex para distribuir el espacio */}
                    <option value="">Todos los géneros</option>
                    <option value="Male">Masculinos</option>
                    <option value="Female">Femeninos</option>
                    <option value="Genderless">Sin género</option>
                    <option value="unknown">Desconocido</option>
                </select>
                <select value={selectedStatus} onChange={handleStatusChange} style={{ flex: '1', marginRight: '10px', height: '40px', fontSize: '1.1em' ,textAlign: 'center', borderRadius: '5px' }}> {/* Estilo flex para distribuir el espacio */}
                    <option value="">Todos los estados</option>
                    <option value="Alive">Con vida</option>
                    <option value="Dead">Muertos</option>
                    <option value="unknown">Desconocido</option>
                </select>
                <select value={selectedSpecies} onChange={handleSpeciesChange} style={{ flex: '1', height: '40px', fontSize: '1.1em', textAlign: 'center', borderRadius: '5px' }}> {/* Estilo flex para distribuir el espacio */}
                    <option value="">Todas las especies</option>
                    <option value="Human">Humanos</option>
                    <option value="Alien">Alien</option>
                    <option value="Animal">Animales</option>
                    <option value="Robot">Robot</option>
                    <option value="unknown">Desconocido</option>
                </select>
            </div>
            <button onClick={handleResetFilters} style={{ marginBottom: '20px', fontSize: '1.1em', border: '1px solid #ff0505', borderRadius: '5px', padding: '5px 10px' }}>Resetear filtros</button> {/* Añadir margen inferior */}
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
                <button onClick={handlePreviousPage} disabled={currentPage === 1} style={{ fontSize: '1.1em' }}>Página previa</button>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} style={{ fontSize: '1.1em' }}>Página siguiente</button>
            </div>
        </div>
    );
}
