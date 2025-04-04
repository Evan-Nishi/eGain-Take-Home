import React from "react";

function RecCard({ rec }) {
    return (
        <div className="body-container">
            <h2>Type: {rec.name}</h2>
            <h3>Brand: {rec.brand}</h3>
            <img src={rec.imgUrl} alt={rec.name} />
            <a href={rec.url}  target="_blank" rel="noopener noreferrer">purchase link</a>
        </div>
    );
}

export default RecCard;
