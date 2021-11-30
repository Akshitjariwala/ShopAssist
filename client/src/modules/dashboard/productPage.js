import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";

const ProductPage = () => {

    
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        setProductList(history.location.state.products);
    });
} 

export default ProductPage;