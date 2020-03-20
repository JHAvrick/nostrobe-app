import { useState, useEffect } from 'react';
import EventEmitter from '../../util/event-emitter';
import API_URL from '../../api-url';

const LoadStates = {
    "COMPLETE": "COMPLETE",
    "LOADING": "LOADING",
    "ERROR": "ERROR",
}

const APIRequests = {
    _categories: [],
    _category: null,
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

    reset: function(){
        this._fetching = false;
        //this._category = null;
        //this.events.emit("categoryChanged", this._category);
        this._page = 0;
        this.designs = [];
        this.state = LoadStates.COMPLETE;
    },

    /**
     * Sets a new category, clears the current page and designs and triggers a fetching
     * of the new category's designs
     * 
     * @param {string} category
     */
    setCategory: function(category){
        // if (/* category === this._category  || */ !this._categories.includes(category)) return;

        this._category = category;
        this.designs = [];
        this._page = 0;

        this.events.emit("categoryChanged", this._category);
        this.nextPage();
    },

    /**
     * Fetches the design categories and automatically sets the category to "all",
     * which will also trigger a loading of the first page in that category. Categories
     * will only every be fetched once until the page is reloaded.
     */
    initial: function(){
        /**
         * If we've already got categories we can skip the actual fetch and just trigger
         * our event and set our initial category
         */
        if (this._categories.length > 0)  {
            //this.events.emit("categoriesFetched", this._categories);
            this.setCategory(this._category);
            return;
        }

        if (this._fetching) return;
        this._fetching = true;

        this._setLoadState(LoadStates.LOADING);
        fetch(API_URL + '/design-category-list')
        .then(response => response.json())
        .then(data => {
            this._fetching = false;
            this._categories = data.design_categories.sort();
            this.events.emit("categoriesFetched", this._categories);
            this._setLoadState(LoadStates.COMPLETE);

            this.setCategory(this._categories[0]);

        }).catch((err) => {      
            this._fetching = false;    
            this._setLoadState(LoadStates.ERROR);
        });
    },

    /**
     * Loads the next 9 results in the current category and adds then onto 
     * the end of the designs array
     */
    nextPage: function(){
        if (this._fetching) return;
        this._fetching = true;

        let pageStart = this._page * this._pageSize;
        let pageEnd = (this._page + 1) * this._pageSize;
        let req = API_URL + `/designs?_start=${pageStart}&_limit=${pageEnd}&categories_in=${this._category}`;

        console.log(req);

        this._setLoadState(LoadStates.LOADING);
        fetch(req)
        .then(response => response.json())
        .then(data => {
            this._fetching = false;
            this._page = this._page + 1;
            this.designs = this.designs.concat(data);
            this.events.emit("pageFetched", this.designs, this._page);
            this._setLoadState(LoadStates.COMPLETE);
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
    const [categories, setCategories] = useState(APIRequests._categories);

    const handleCategoriesFetched = (newCategories) => setCategories([].concat(newCategories));
    useEffect(() => {
        APIRequests.events.on("categoriesFetched", handleCategoriesFetched);
        return (() => {
            APIRequests.events.removeListener("categoriesFetched", handleCategoriesFetched);
        })
    })

    return categories;
}

function useCurrentCategory(){
    const [category, setCategory] = useState(APIRequests._category);

    const handleCategoryChanged = (newCategory) => setCategory(newCategory);
    useEffect(() => {
        APIRequests.events.on("categoryChanged", handleCategoryChanged);
        return (() => {
            APIRequests.events.removeListener("categoryChanged", handleCategoryChanged);
        })
    })

    return category;
}


function useDesigns(){
    const [designs, setDesigns] = useState(APIRequests.designs);
    
    const handlePageFetched = (newDesigns) => { setDesigns(newDesigns) };

    useEffect(() => {
        APIRequests.events.on("pageFetched", handlePageFetched);
        return (() => {
            APIRequests.events.removeListener("pageFetched", handlePageFetched);
        })
    })

    return designs;
}

export { APIRequests, LoadStates, useCategories, useCurrentCategory, useDesigns, useLoadState } ;