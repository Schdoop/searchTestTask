/**
 * Search component
 *
 */
import React, { useState, useEffect } from 'react';
import 'babel-polyfill';
import useDebounce from "../hooks/useDebounce";

function Search({ onHide }) {

    const [searchResults, setSearchResults] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const searchLimit = 5;
    const serverURL   = 'http://localhost:3035';

    /**
     * Sends search query to backend
     *
     * @param searchText [String] - search query
     * @returns {Promise<*[]|any>}
     */
    const sendQuery = async (searchText) => {

        if(searchText.length < 3) {
            return {searchResults: [], totalResults: 0};
        }

        const response = await fetch(serverURL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({search: searchText, limit: searchLimit})
        });

        if(!response.ok) {
            console.error(`Fetching error: ${response.status}`);
            return {searchResults: [], totalResults: 0};
        }

        return await response.json();
    }


    const debouncedSearchText = useDebounce(searchText, 300);

    useEffect(() => {
            if (debouncedSearchText) {
                setIsSearching(true);
                sendQuery(debouncedSearchText).then(results => {
                    const {searchResults, totalResults} = results;
                    setIsSearching(false);
                    setSearchResults(searchResults);
                    setSearchText(searchText);
                    setTotalResults(totalResults);
                });
            } else {
                setSearchResults([]);
            }
        },
        [debouncedSearchText]
    );


    /**
     * Highlights found words in search results
     *
     * @memberof Menu
     * @private
     */
    const highLightWords = () => {
        const words = searchText.split(/[^A-Za-z<>0-9\.]/);
        const nodes = [...document.querySelectorAll('.result-name'), ...document.querySelectorAll('.result-about')];
        words.forEach( word => {
            nodes.forEach( node => {
                if(word.length < 1) return;

                let text = node.innerHTML;
                text = text.split(word).join(`##${word}#/`);

                const capitalizedWord = word[0].toUpperCase() + word.substr(1);
                text = text.split(capitalizedWord).join(`##${capitalizedWord}#/`);

                node.innerHTML = text;
            });
            if(word.match(/price[<>][0-9]+/) !== null) {
                document.querySelectorAll('.result-price').forEach( item => item.classList.add('highlight'));
            }
        });

        nodes.forEach( node => {
            node.innerHTML = node.innerHTML.split('##').join('<span class="highlight">');
            node.innerHTML = node.innerHTML.split('#/').join('</span>');
        });

    }

    useEffect(() => {
        highLightWords();
    })

    const resultTemplate = (result) => (
        <div className="result" key={result.item._id + Math.random()}>
            <div className="result-image">
                {result.item.picture && <img src={result.item.picture} />}
            </div>
            <div className="result-texts">
                <div className="result-name">{result.item.name}</div>
                <div className="result-about">{result.item.about}</div>
            </div>
            <div className="result-price">${result.item.price}</div>
        </div>);

    const emptyResult = {item: {_id: 0, picture: null, name: 'No results', about: '', price: ''}};

    return (
        <div>
            <div className="search-container">
                <input type="text" onChange={e => setSearchText(e.target.value)} />
                <a href="#" onClick={onHide}>
                    <i className="material-icons close">close</i>
                </a>
            </div>
            <div className="search-results">
                {searchResults.length > 0 && <div className="result-count">
                    {isSearching ?
                        <span>Searching ...</span> :
                        <span>Displaying {searchResults.length} of {totalResults} results</span>}
                </div>}
                {searchResults.length > 0 && searchResults.map( result => resultTemplate(result) )}
                {searchResults.length === 0 && searchText.length > 2 && resultTemplate(emptyResult)}
            </div>
        </div>
    );


}

// Export out the React Component
module.exports = Search;
