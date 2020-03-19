import React, { useState, useEffect } from 'react';
import { Card, CardGrid } from '../../components/card/card';
import { Categories, Category } from '../../components/categories/categories';
import { useParams } from "react-router-dom";
import API_URL from '../../api-url';


function useCategoryList(){
    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        console.log("Fetching Categories");

        fetch(API_URL + '/design-categories')
        .then(response => response.json())
        .then(data => {
            setCategoryList(
                data.map((categoryObject) => categoryObject.category).sort()
            );
        }).catch(err => console.log(err));
      }, []);

    return categoryList;
}

/**
 * 
 * @param {string} category - A category string, this hook fetches all the designs from a given category 
 */
function useDesignsInCategory(category){
    const [designList, setDesignList] = useState([]);

    useEffect(() => {
        console.log("Fetching Designs: " + category);

        fetch(API_URL + '/design-categories?category=' + category)
        .then(response => response.json())
        .then(data => {
            setDesignList(data[0].designs);
        }).catch(err => console.log(err));
      }, [category]);

    return designList;
}



function DesignsPage(props) {
    //let { category } = useParams();




    const [selectedCategory, setSelectedCategory] = useState(/* category || */  "all");
    const handleCategorySelected = (category) => setSelectedCategory(category);

    const categories = useCategoryList();
    const designs = useDesignsInCategory(selectedCategory);

    console.log(categories);
    console.log(designs);

    // defaultLink: "",
    // img: "",
    // title: "Untitled",
    // tags: [],
    // available: true,
    // availibilityStatus: "In Stock",
    // stores: []

    return (
        <div className="designs">
            <Categories onSelected={handleCategorySelected} selected={selectedCategory}>
                {categories.map((categoryName, index) => <Category key={index} name={categoryName} /> )}
            </Categories>
            <CardGrid>
                {designs.map((design, index) => 
                    <Card 
                        key={Math.random()}
                        title={design.title}
                        tags={design.tags}
                        stores={design.stores}
                        availability={design.availiblility}
                        defaultLink={design.default_link}
                        images={design.images.map((imageConfig) => {
                             return API_URL + imageConfig.url;
                        })}
                    />
                
                )}
            </CardGrid>
        </div>
    );
}








export default DesignsPage;
