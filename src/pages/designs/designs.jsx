import React, { useState, useEffect } from 'react';
import Loader from 'react-loaders'
import { Card, CardGrid } from '../../components/card/card';
import { Categories, Category } from '../../components/categories/categories';
import { useParams } from "react-router-dom";
import API_URL from '../../api-url';
import './designs.css';

import {
    APIRequests,
    LoadStates,
    useDesigns,
    useCategories,
    useCurrentCategory,
    useLoadState
} from './api-requests';

// function useCategoryList(){
//     const [categoryList, setCategoryList] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);

//     useEffect(() => {

//         setIsLoading(true);

//         fetch(API_URL + '/design-category-list')
//         .then(response => response.json())
//         .then(data => {
//             setIsLoading(false);
//             setCategoryList(data.design_categories.sort());
//         }).catch((err) => {          
//             console.log(err);
//         });

//       }, []);

//     return [categoryList, isLoading];
// }

// /**
//  * 
//  * @param {string} category - A category string, this hook fetches all the designs from a given category 
//  */
// function useDesignsInCategory(category){
//     const [designList, setDesignList] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [fetchError, setFetchError] = useState(false);

//     useEffect(() => {
//         setIsLoading(true);

//         fetch(API_URL + '/design-categories?category=' + category)
//         .then(response => response.json())
//         .then(data => {

//             setFetchError(false);
//             setIsLoading(false);
//             setDesignList(data[0].designs);

//         }).catch(err => {

//             console.warn(err);
//             setFetchError(true);

//         });
//       }, [category]);

//     return [designList, isLoading, fetchError];
// }

function DesignsPage(props) {
    useEffect(() => {
        APIRequests.initial();
        return () => APIRequests.reset()
    }, []);

    const currentCategory = useCurrentCategory();
    const categories = useCategories();
    const designs = useDesigns();
    const loadState = useLoadState();


    const handleCategorySelected = (category) => APIRequests.setCategory(category);

    //Reset APIRequests on unmount

    //APIRequests.nextPage();

    //let { category } = useParams();
    //const [selectedCategory, setSelectedCategory] = useState(null);
    
    // const handleCategoryChanged = (category) => setSelectedCategory(category);
    // useEffect(() => {
    //     APIRequests.events.on("categoryChanged", handleCategoryChanged);
    //     return (() => APIRequests.events.removeListener("categoryChanged", handleCategoryChanged))
    // });
        




    console.log(currentCategory)
    console.log(categories)
    console.log(designs)
    console.log(loadState)

    // const Cards = (
    //     <CardGrid>
    //         {designs.map((design, index) => 
    //             <Card 
    //                 key={design._id}
    //                 title={design.title}
    //                 tags={design.tags || []}
    //                 stores={design.stores || []}
    //                 availability={design.availability || "available"}
    //                 defaultLink={design.default_link}
    //                 images={design.images.map((imageConfig) => {
    //                     return API_URL + imageConfig.url;
    //                 })}
    //             />
    //         )}
    //     </CardGrid>
    // )

    const Loading = (
        <div className="designs__loading">
            {
                loadState === LoadStates.ERROR ? 
                <p style={{ fontSize: "1.5rem", textAlign: "center" }}> Could not fetch designs. <br/> Very uncool. </p> :
                <Loader color="black" active={true} type="cube-transition" />
            }
        </div>
    )

    /**
     * We don't mount our grid until our request is complete and our effect has 
     * set isLoading to false.
     */
        const Grid = (loadState === LoadStates.LOADING || loadState === LoadStates.ERROR) ? Loading : <CardPage designs={designs } />;

    return (
        <div className="designs">
            <Categories onSelected={handleCategorySelected} selected={currentCategory}>
                {categories.map((categoryName, index) => <Category key={index} name={categoryName} /> )}
            </Categories>
            {/* {CategoryBar} */}
            {Grid}
            <button onClick={() => APIRequests.nextPage()}></button>
        </div>
    );
}

function CardPages(props){
    return (
        <div>
            {props.pages.map((designs)=> 
                <CardGrid designs={designs} />
            )}
        </div>
    )
}

function CardPage(props){

    const [designs, setDesigns] = useState(props.designs);
    // useEffect(() => {
    //     setDesigns(props.designs);
    // }, [])

    return (
        <CardGrid>
            {designs.map((design, index) =>  {
                return <Card 
                    key={design._id}
                    title={design.title}
                    tags={design.tags || []}
                    stores={design.stores || []}
                    availability={design.availability || "available"}
                    defaultLink={design.default_link}
                    images={design.images.map((imageConfig) => {
                        return API_URL + imageConfig.url;
                    })}
                />
             })}
        </CardGrid>
    )
}





export default DesignsPage;
