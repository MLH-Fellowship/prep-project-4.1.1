import React from 'react';
// styling
import './Popup.css';
// images
import city from './city.png';

const PopUp = props => {
    // function that takes boolean as param to conditionally display popup
    const { setPopUp } = props 

    return (
        <div className="PopUp">
            {/* x close window */}
            <button className="popup-x" onClick={()=> setPopUp(false)} >X</button>
            <div className="pu-content-container">
                <img className="pu-img" src={city} alt="city" />
                <h1>Unable to determine your location. Please set it manually</h1>
            </div>
            {/* button controls */}
            <div className="pu-button-container">
                <button onClick={()=> setPopUp(false)}>Done</button>
            </div>
        </div>
    );
}

export default PopUp;