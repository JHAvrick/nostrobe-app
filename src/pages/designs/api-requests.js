import { useState, useEffect } from 'react';
import EventEmitter from '../../util/event-emitter';
import client from '../../contentful-client';

const LoadStates = {
    "COMPLETE": "COMPLETE",
    "LOADING": "LOADING",
    "ERROR": "ERROR",
}

const APIRequests = {
    _fetching: false, 
    categories: [],
    category: null,
    page: 0,
    pageSize: 9,
    state: LoadStates.LOADING,
    designs: [],
    events: new EventEmitter(),

    _setLoadState: function(loadState){
        this.state = loadState;
        this.events.emit("stateChange", this.state)
    },

    reset: function(){
        this._fetching = false;
        //this.category = null;
        //this.events.emit("categoryChanged", this.category);
        this.page = 0;
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
        // if (/* category === this.category  || */ !this.categories.includes(category)) return;

        this.category = category;
        this.designs = [];
        this.page = 0;

        this.events.emit("categoryChanged", this.category);
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
        if (this.categories.length > 0)  {
            //this.events.emit("categoriesFetched", this.categories);
            this.setCategory(this.category);
            return;
        }

        if (this._fetching) return;
        this._fetching = true;

        this._setLoadState(LoadStates.LOADING);
        client.getEntries({ 
          content_type: 'designCategory'
        }).then((entry) => {
            this._fetching = false;
            this.categories = entry.items.map((item) => item.fields.category);
            this.events.emit("categoriesFetched", this.categories);
            this._setLoadState(LoadStates.COMPLETE);
            this.setCategory(this.categories[0]);
        }
        ).catch((err) => {
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

        let pageStart = this.page * this.pageSize;
        let pageEnd = (this.page + 1) * this.pageSize;
        //let req = API_URL + `/designs?_start=${pageStart}&_limit=${pageEnd}&categories_in=${this.category}`;

        this._setLoadState(LoadStates.LOADING);
        client.getEntries({ 
            skip: pageStart,
            limit: pageEnd,
            content_type: 'design',
            'fields.categories[in]': this.category,
        }).then((entry) => {

            this._fetching = false;
            this.page = this.page + 1;

            let nextPage = entry.items.map((item) => {
                return {
                    defaultLink: item.fields.defaultLink,
                    title: item.fields.title,
                    images: item.fields.images.map((image) => image.fields.file.url),
                    availability: item.fields.availability[0],
                    tags: item.fields.tags,
                    stores: item.fields.stores
                }
            });

            this.designs = this.designs.concat(nextPage);
            this.events.emit("pageFetched", this.designs, this.page);
            this._setLoadState(LoadStates.COMPLETE);

        }).catch((err) => {
            console.log(err);
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
    const [categories, setCategories] = useState(APIRequests.categories);

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
    const [category, setCategory] = useState(APIRequests.category);

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