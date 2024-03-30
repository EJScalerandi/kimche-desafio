import React, { useState, useEffect } from "react";
import Searchbar from "./searchbar";
import Cards from "./cards";

export default function Homepage() {
    const [data, setData] = useState([]);

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
    console.log(data)
    return (
        <div>
            <Searchbar />
            {data.map(character => (
                <Cards
                    key={character.id} 
                    id={character.id}
                    name={character.name}
                    image={character.image}
                />
            ))}
        </div>
    );
    
}
