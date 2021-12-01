import { Button } from 'antd';
import React, { useState } from 'react';
import { fetchProducts } from '../../service';
import { useHistory, Redirect,Link } from "react-router-dom";
import { loadIntoDatabase } from '../../service';
import axios from 'axios';
import { productPage } from 'modules/dashboard/productPage'
import { ROUTES } from 'common/constants';
var cors = require('cors');

function Dashboard() {
  
  const [product, setProduct] = useState("");
  const [productList, setProductList] = useState("");
  const history = useHistory();

  const onSearchButtonClick = async () => {
    console.log('before fetching the product: '+product);
    const products = await fetchProducts(product);
    setProductList(products.data);
    console.log(productList);
    //console.log(products); // Display product details on the page.
  }

  const onProductClick = async (asinNumber) => {

    console.log("Div Clicked");
    var productMetaData = {};
    productList.map(product => {
      if (product.asin == asinNumber){
          // Add user email id as well from session to product review details.
          productMetaData["userID"] = "akshitjariwala12"
          productMetaData["asin"] = product.asin;
          productMetaData["price"] = product.price.toString();
          productMetaData["reviews_count"] = product.reviews_count.toString();
          productMetaData["overall_rating"] = product.overall_rating.toString();
          productMetaData["title"] = product.title;
          productMetaData["stars_stat"] = product.stars_stat;
          productMetaData["thumbnail"] = product.thumbnail;
          
          const product_review_list = {}

          for (let i=0;i<product.reviews.length;i++){
            product_review_list[i] = product.reviews[i];
          }
          productMetaData["reviews"] = product_review_list;
      }
    });

    console.log(JSON.stringify("Akshit"));

    // productMetaData = JSON.stringify(productMetaData);

    axios.post('https://qtx9upms37.execute-api.us-east-1.amazonaws.com/default/products',productMetaData).then((result) => {
      console.log(result.data);
      history.push(ROUTES.PRODUCTPAGE, { userID : "akshitjariwala", asin : ''}); // Add user email and asin number. 
    }).catch( (error) => {
      console.log(error);
    });
  }

  return (
    <div>
        <div>Dashboard</div>
        <form>
        <h2>Search Your Product</h2>
        <input 
          style={StyleSheet.input}
          name="product_name" 
          placeholder="Enter Product"
          onChange = {(e) => setProduct(e.target.value) }
          value = {product} />
        <Button onClick={onSearchButtonClick}> Search </Button>
        </form>
        <div>
          {productList && productList.map((product) => (
            <div onClick={(e) => onProductClick(product.asin)} className="card" style={{cursor:"pointer",width:"500px"}}>
              <div className="container" style={{"margin-top":"10px","margin-left":"10px"}}>
                <h4>{product.title}</h4>
                <p>{product.price}</p>
                <p>{product.review_count}</p>
                <p>{product.thumbnail}</p>
              </div>
            </div>
        ))
        }
        </div>
     </div>   
);
}

export default Dashboard;
