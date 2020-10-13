/**
 * This file will hold the Menu that lives at the top of the Page, this is all rendered using a React Component...
 *
 */
import React, { useState, useEffect } from 'react';
import 'babel-polyfill';
import Search from './search';

function Menu() {

    const [showingSearch, setShowingSearch] = useState(false);

    /**
     * Shows or hides the search container
     * @memberof Menu
     * @param e [Object] - the event from a click handler
     */
    const showSearchContainer = (e) => {
        e.preventDefault();
        setShowingSearch(!showingSearch);
    }

    return (
        <header className="menu">
            <div className="menu-container">
                <div className="menu-holder">
                    <h1>ELC</h1>
                    <nav>
                        <a href="#" className="nav-item">HOLIDAY</a>
                        <a href="#" className="nav-item">WHAT'S NEW</a>
                        <a href="#" className="nav-item">PRODUCTS</a>
                        <a href="#" className="nav-item">BESTSELLERS</a>
                        <a href="#" className="nav-item">GOODBYES</a>
                        <a href="#" className="nav-item">STORES</a>
                        <a href="#" className="nav-item">INSPIRATION</a>

                        <a href="#" onClick={showSearchContainer}>
                            <i className="material-icons search">search</i>
                        </a>
                    </nav>
                </div>
            </div>
            {showingSearch && <Search onHide={showSearchContainer} />}
        </header>
    );


}

// Export out the React Component
module.exports = Menu;
