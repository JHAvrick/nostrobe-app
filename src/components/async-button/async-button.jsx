import React, { useState, useEffect } from 'react';
import Loader from 'react-loaders';
import "./async-button.css";

function AsyncButton(props){

    const [isLoading, setIsLoading] = useState(props.isLoading);
    useEffect(() => setIsLoading(props.isLoading),[props.isLoading]);

    return (
        <button onClick={props.onClick} className="async-button">
            { 
                isLoading ? 
                <Loader style={{transform: 'scale(0.75)'}} color="black" type="line-scale-party" /> 
                : props.label 
            }
        </button>
    )
}

AsyncButton.defaultProps = {
    label: "Click Me!",
    onClick: function(){},
    isLoading: false,
}

export default AsyncButton;