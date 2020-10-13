'use strict';
const data = require('../data');

module.exports = {

    searchService: async (searchText, limit) => {
        let results = [];

        if(searchText.length >= 3) {
            const words = searchText.split(/[^A-Za-z<>0-9\.]/);

            data.forEach(item => {

                if(!item.isActive) {
                    return;
                }

                let searchFields = [item.name, item.about, ...item.tags];
                let foundWords = [];
                let priceMatched = true;

                searchFields.forEach(field => {

                    // Searching for any of the words
                    words.forEach( word => {
                        word = word.trim();
                        if(word.length === 0) return;

                        if (field.toLowerCase().indexOf(word) > -1) {
                            if(!foundWords.includes(word)) {
                                foundWords.push(word);
                            }
                        }

                        // If user inputs 'price>N' or 'price<N', we should filter out all of the other results
                        const priceFilter = word.match(/price[<>][0-9]+/);
                        if(priceFilter !== null) {
                            const term = priceFilter[0];
                            if(term.indexOf('>') > -1) {
                                const price = term.substr(term.indexOf('>') + 1);
                                if(Number(item.price) < price) {
                                    priceMatched = false;
                                }
                            }

                            if(term.indexOf('<') > -1) {
                                const price = term.substr(term.indexOf('<') + 1);
                                if(Number(item.price) > price) {
                                    priceMatched = false;
                                }
                            }
                        }
                    });

                });
                if (foundWords.length > 0 && priceMatched) {
                    results.push( { item, foundWords: foundWords.length });
                }
            });
        }

        results.sort( (a, b) => a.foundWords > b.foundWords ? -1 : 1);

        return {searchResults: results.slice(0, limit), totalResults: results.length};
    }

};
