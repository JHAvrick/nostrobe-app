import React, { useEffect } from 'react';
import Helmet from 'react-helmet';
import Loader from 'react-loaders'
import AsyncButton from '../../components/async-button/async-button'
import { Card, CardGrid } from '../../components/card/card';
import { Categories, Category } from '../../components/categories/categories';
import './designs.css';

//import { useParams, useLocation } from 'react-router-dom';

import {
    APIRequests,
    LoadStates,
    useDesigns,
    useCategories,
    useCurrentCategory,
    useLoadState
} from './api-requests';


function DesignsPage(props) {
    // const location = useLocation();
    // const params = useParams();
    // console.log(params);
    // console.log(location)

    useEffect(() => {
        APIRequests.initial();
        return () => APIRequests.reset()
    }, []);

    const currentCategory = useCurrentCategory();
    const categories = useCategories();
    const designs = useDesigns();
    const loadState = useLoadState();

    const handleCategorySelected = (category) => APIRequests.setCategory(category);

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
     * Show a loading icon instead of the grid when we are loading our first page. After the first page the 
     * grid is always shown.
     * 
     */
    const Grid = ( 
        (loadState === LoadStates.LOADING && APIRequests.page === 0) 
        || loadState === LoadStates.ERROR) 
        ? Loading 
        : (
            <div>
                <CardPage designs={designs} />
                <AsyncButton 
                    onClick={() => APIRequests.nextPage()} 
                    isLoading={loadState === LoadStates.LOADING} 
                    label="See More"
                />
            </div>  
        );

    return (
        <div className="designs">
            <Helmet>
                <meta charSet="utf-8" />
                <title>No Strobe</title>
                <meta name="description" content="No Strobe - Designs"/>
                <link rel="canonical" href="https://nostrobe.com/designs" />
                <meta name="keywords" content="design,illustration,vector,modern,art,shoegaze,strompbox,prints,minimalist,abstract,redbubble,zazzle,society6,teepublic" />
            </Helmet>
            
            <Categories onSelected={handleCategorySelected} selected={currentCategory}>
                {categories.map((categoryName, index) => <Category key={index} name={categoryName} /> )}
            </Categories>
            {/* {CategoryBar} */}
            {Grid}
        </div>
    );
}

function CardPage(props){

    return (
        <CardGrid>
            {props.designs.map((design, index) =>  {
                return <Card 
                    key={index}
                    title={design.title}
                    tags={design.tags || []}
                    stores={design.stores || []}
                    availability={design.availability || "available"}
                    defaultLink={design.defaultLink}
                    images={design.images}
                />
             })}
        </CardGrid>
    )
}





export default DesignsPage;


/* <InfiniteScroll

dataLength={designs.length} //This is important field to render the next data
next={() => APIRequests.nextPage()}
hasMore={true}
loader={<h4>Loading...</h4>}>

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

</InfiniteScroll> */