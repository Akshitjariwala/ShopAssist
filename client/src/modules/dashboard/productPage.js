import React, { useState } from 'react';

function ProductPage() {

    const[productTitle, setProductTitle] = useState("");
    const[thumbnail, setThumbnail] = useState("");
    const[price,setPrice] = useState("");
    const[reviews,setReviews] = useState("");
    const[stars_stat,setStartStat] = useState("");
    const[rating,setRating] = useState("");
    const[reviewCount,setReviewCount] = useState("");

    return (
        <div>
            <div class="container">
                <h2> {productTitle} </h2>
            </div>
            <button>Review Analysis</button>
            <button>Rating visulization</button>
        </div>
    );

}

export default ProductPage;