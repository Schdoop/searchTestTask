'use strict';

const {searchService} = require('../services/search');

module.exports = {

    search: async (req) => {
        const {search, limit} = req;
        try {
            return await searchService(search, limit);
        } catch(e) {
            console.log(e.message)
        }
    }

};
