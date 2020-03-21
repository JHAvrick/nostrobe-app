import React, { useEffect, useState } from 'react';
import ReactImageFallback from 'react-image-fallback';
import StoreIcons from '../../config/store-icons';
import FallbackPNG from '../../assets/fallback.png';
import Loader from 'react-loaders';
import { AiOutlineShopping } from 'react-icons/ai';
import 'loaders.css';
import './card.css';
import './card-grid.css';

const Availability = {
    'available': { label: "Available", color: "#6FFF86" },
    'in_stock': { label: "in_stock", color: "#6FFF86" },
    'not_available': { label: "Not Available", color: "#FF9696" },
    'out_of_stock': { label: "out_of_stock", color: "#FF9696" },
    'out_of_print': { label: "out_of_print", color: "#FF9696" },
    'coming_soon': { label: "Upcoming", color: "#969AFF" },
}

function Card(props) {

  const [isImageResolved, setIsImageResolved] = useState(false);
  const handleImageResolved = () => setIsImageResolved(true);

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    let timeout = setTimeout(() => setIsVisible(true), 15);
    return (() => clearTimeout(timeout))
  }, []);

  const [stock, setStock] = useState(Availability[props.availability]);
  useEffect(() => setStock(Availability[props.availability]),[props.availability]);

  return (
    <div className={isVisible ? "card" : "card--beforeenter"}>
        
        <div className="card__stores">
            {props.stores.map((store, index) => 
                <StoreIcon key={index} storeName={store.name} storeLink={store.link} />
            )}
        </div>

        <a target="_blank" rel="noopener noreferrer" href={props.defaultLink} className="card__a">
            <LoadingImage isVisible={!isImageResolved} />

            <ReactImageFallback
                    src={props.images[0]}
                    fallbackImage={FallbackPNG}
                    alt="Design Preview"
                    className="card__img" 
                    onLoad={handleImageResolved}
                    onError={handleImageResolved}
            />

        </a>
        <div className="card__tray">
            <div className="card__tray-left">
                <p className="card__title">{props.title}</p>
                <p className="card__tags">{
                    props.tags.map((tag, index) => 
                        index === props.tags.length - 1 ? tag : tag + ", ")
                    }
                </p>
            </div>
            <div className="card__tray-right">
                <button className="card__btn" onClick={() => window.open(props.defaultLink, '_blank')}>
                    <AiOutlineShopping width={16} height={16} />
                    <div className="card__btn-label-wrapper">
                        <p className="card__btn-label">View In Store </p>
                        <p className="card__btn-status">Status: 
                            <span style={{color: stock.color }}>
                                {" " + stock.label }
                            </span> 
                        </p>
                    </div>
                </button>
            </div>
        </div>
    </div>
  );
}

Card.defaultProps = {
    defaultLink: "",
    images: [],
    title: "Untitled",
    availability: "available",
    tags: [],
    stores: []
}

function CardGrid(props) {
    return (
      <div className="card-grid">
          {props.children}
          {props.children.length % 3 !== 0 ? <div className="dummy-card"></div> : "" }
      </div>
    );
}

function StoreIcon(props){
    return (
        <div>
            <div className="card__store-icon"> 
                <div className="card__store-icon-content">
                    <img className="card__store-img" alt="Store Icon" src={StoreIcons[props.storeName] || ""} />
                    <span className="card__store-label"> 
                        <a target="_blank" rel="noopener noreferrer" href={props.storeLink}> { props.storeName } </a> 
                    </span> 
                </div>
            </div>
        </div>
    )
}

function LoadingImage(props){
    return (
        <div className="card__loading-image" style={{ display: props.isVisible ? "flex" : "none" }}>
            <Loader color="#939393" active={true} type="cube-transition" />
        </div>
    )
}

LoadingImage.defaultProps = { isVisible: true }

export { CardGrid, Card } ;
