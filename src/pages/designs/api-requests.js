import React, { useState, useEffect } from 'react';
import API_URL from '../../api-url';

// const LoadStates = {
//     "LOADING_CATEGORIES": "LOADING_CATEGORIES",
//     "LOADING_FIRST_PAGE": "LOADING_FIRST_PAGE",
//     "LOADING_NEXT_PAGE": "LOADING_NEXT_PAGE",
//     "CATEGORY_FETCH_ERROR": "CATEGORY_FETCH_ERROR",
//     "DESIGN_FETCH_ERROR": "DESIGN_FETCH_ERROR",
//     "FETCH_COMPLETE": "FETCH_COMPLETE"
// }

const LoadStates = {
    "COMPLETE": "COMPLETE",
    "LOADING": "LOADING",
    "ERROR": "ERROR",
}

const APIRequests = {
    _categories: [],
    _category: "all",
    _page: 0,
    _pageSize: 9,
    _fetching: false,
    state: LoadStates.COMPLETE,
    designs: [],
    events: new EventEmitter(),

    _setLoadState: function(loadState){
        this.state = loadState;
        this.events.emit("stateChange", this.state)
    },

    setCategory: function(category, autoFetchPage = true){
        if (category === this._category || !this._categories.includes(category)) return;

        this._category = category;
        this._page = 0;

        this.events.emit("categoryChanged", this._category);
        if (autoFetchPage) this.nextPage();
    },

    fetchCategories: function(){
        if (this._fetching || this.categories.length > 0) return;
        this._fetching = true;

        this._setLoadState(LoadStates.LOADING);
        fetch(API_URL + '/design-category-list')
        .then(response => response.json())
        .then(data => {
            this._fetching = false;
            this._categories = data.design_categories.sort();
            this.events.emit("categoriesFetched", this._categories);
            this._setLoadState(LoadStates.NOT_LOADING);
        }).catch((err) => {      
            this._fetching = false;    
            this._setLoadState(LoadStates.ERROR);
        });
    },

    nextPage: function(){
        if (this._fetching) return;
        this._fetching = true;

        let pageStart = this._page * this._pageSize;
        let pageEnd = this._page * (this._pageSize + 1)
        let req = API_URL + `/designs?_start=${pageStart}&_limit=${pageEnd}&categories_in=${this._category}`;

        this._setLoadState(LoadStates.LOADING);
        fetch(req)
        .then(response => response.json())
        .then(data => {
            this._fetching = false;
            this.page = this.page + 1;
            this.designs.concat(data.designs);
            this.events.emit("pageFetched", this.designs, this._page);
            this._setLoadState(LoadStates.NOT_LOADING);
        }).catch(err => {
            this._fetching = false;
            this._setLoadState(LoadStates.ERROR);
        });

    }


}

function useLoadState(){
    const [loadState, setLoadState] = useState(APIRequests.state);
    const handleStateChange = (state) => setLoadState(state);
    useEffect(() => {
        APIRequests.events.on("stateChange", handleStateChange)
        return (() => {
            APIRequests.events.removeListener("stateChange", handleStateChange);
        })
    })

    return loadState;
}

function useCategories(){
    const [categories, setCategories] = useState([]);

    const handleCategoriesFetched = (newCategories) => setCategories([].concat(newCategories));
    useEffect(() => {
        APIRequests.events.on("categoriesFetched", handleCategoriesFetched);
        return (() => {
            APIRequests.events.removeListener("categoriesFetched", handleCategoriesFetched);
        })
    })

    return categories;
}

function useDesigns(){
    const [designs, setDesigns] = useState([]);

    const handlePageFetched = (newDesigns) => setDesigns([].concat(newDesigns));
    useEffect(() => {
        APIRequests.events.on("pageFetched", handlePageFetched);
        return (() => {
            APIRequests.events.removeListener("pageFetched", handlePageFetched);
        })
    })

    return designs;
}

export default { APIRequests, LoadStates, useCategories, useDesigns, useLoadState } ;