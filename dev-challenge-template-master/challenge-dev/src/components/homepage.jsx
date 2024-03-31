import React, { useState, useEffect } from "react";
import Searchbar from "./searchbar";
import Cards from "./cards";

export default function Homepage() {
    const [data, setData] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [selectedGender, setSelectedGender] = useState('');

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
        .then(data => setData(data.data.characters.results))
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleSearchResult = (result) => {
        setSearchResult(result);
        setSearchValue(result.length > 0 ? '' : searchValue); 
    };

    return (
        <div>
            <Searchbar setSearchResult={handleSearchResult} setData={setData} data={data} />
            {(searchResult.length > 0 || searchValue) ? (
                searchResult.map(character => (
                    <Cards
                        key={character.id} 
                        id={character.id}
                        name={character.name}
                        image={character.image}
                    />
                ))
            ) : (
                data
                .filter(character => !selectedGender || character.gender === selectedGender)
                .map(character => (
                    <Cards
                        key={character.id} 
                        id={character.id}
                        name={character.name}
                        image={character.image}
                    />
                ))
            )}
        </div>
    );
}
