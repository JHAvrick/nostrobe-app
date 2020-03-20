import React, { useState, useEffect } from 'react';
import { Card, CardGrid } from '../../components/card/card';
import { Categories, Category } from '../../components/categories/categories';
import { useParams } from "react-router-dom";
import API_URL from '../../api-url';
import './designs.css';

import Loader from 'react-loaders'

function useCategoryList(){
    const [categoryList, setCategoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        setIsLoading(true);

        fetch(API_URL + '/design-category-list')
        .then(response => response.json())
        .then(data => {
            setIsLoading(false);
            setCategoryList(data.design_categories.sort());
        }).catch((err) => {          
            console.log(err);
        });

      }, []);

    return [categoryList, isLoading];
}

/**
 * 
 * @param {string} category - A category string, this hook fetches all the designs from a given category 
 */
function useDesignsInCategory(category){
    const [designList, setDesignList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        fetch(API_URL + '/design-categories?category=' + category)
        .then(response => response.json())
        .then(data => {

            setFetchError(false);
            setIsLoading(false);
            setDesignList(data[0].designs);

        }).catch(err => {

            console.warn(err);
            setFetchError(true);

        });
      }, [category]);

    return [designList, isLoading, fetchError];
}

function DesignsPage(props) {
    //let { category } = useParams();
    const [selectedCategory, setSelectedCategory] = useState(/* category || */  "all");
    const handleCategorySelected = (category) => {
        if (category !== selectedCategory){
            setSelectedCategory(category); 
        }
    }

    const [categories, categoriesLoading] = useCategoryList();
    const [designs, designsLoading, fetchError] = useDesignsInCategory(selectedCategory);

    const CategoryBar = categoriesLoading ? "" : (
        <Categories onSelected={handleCategorySelected} selected={selectedCategory}>
            {categories.map((categoryName, index) => <Category key={index} name={categoryName} /> )}
        </Categories>
    )

    const Loading = (
        <div className="designs__loading">
            {
                fetchError ? <p style={{ fontSize: "1.5rem", textAlign: "center" }}> Could not fetch designs. <br/> Very uncool. </p> :
                <Loader color="black" active={true} type="cube-transition" />
            }
        </div>
    )

    const Cards = (
        <CardGrid>
            {designs.map((design, index) => 
                <Card 
                    key={index}
                    title={design.title}
                    tags={design.tags}
                    stores={design.stores}
                    availability={design.availability}
                    defaultLink={design.default_link}
                    images={design.images.map((imageConfig) => {
                        return API_URL + imageConfig.url;
                    })}
                />
            )}
        </CardGrid>
    )

    /**
     * We don't mount our grid until our request is complete and our effect has 
     * set isLoading to false.
     */
    const Grid =  (categoriesLoading || designsLoading) ? Loading : Cards;

    return (
        <div className="designs">
            {CategoryBar}
            {Grid}
        </div>
    );
}








export default DesignsPage;
