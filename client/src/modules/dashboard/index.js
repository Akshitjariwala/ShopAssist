import { Button } from 'antd';
import React, { useState } from 'react';
import { fetchProducts } from '../../service';
import { useHistory, Redirect,Link } from "react-router-dom";
import axios from 'axios';
import { ROUTES } from 'common/constants';

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
          productMetaData["userID"] = "akshitjariwala10"
          productMetaData["asin"] = product.asin;
          productMetaData["price"] = product.price.toString();
          productMetaData["reviews_count"] = product.reviews_count.toString();
          productMetaData["overall_rating"] = product.overall_rating.toString();
          productMetaData["title"] = product.title;
          productMetaData["stars_stat"] = product.stars_stat;
          productMetaData["thumbnail"] = product.thumbnail;
          
          //const product_review_list = {} original

          const product_review_list = {}

          const tempReviewResult = [
            "I like everything about it I had to switch back from android to iPhone so I heard the XR was good. I got this refurbished cause it’s cheap.The only thing I dislike no button but I’m getting used to not having a button.",     
            "muy buen celular esta perfecto",
            "Worked good for me.",
            "It is too slick for my hand. I’ve dropped it at least four times. Thankfully it has not broken. I don’t think a glass back was a good idea. My finger aren’t very long.",
            "It arrived fast as you would expect from Amazon. The phone feels good holding it and it responds fast to the touch. So far I'm very happy with it.",
            "The phone was okay but then once you try to start it; it doesn’t work. The phone is obviously locked and it only works with certain carriers which the seller claims that it works with “all carriers”: FALSE! I have Brent dying to return it but Amazon staff have not be backing me up.",
            "No issue with product at all. Charger and cable were not stock but exceed expectations for perf and quality.",
            "I will update this as time goes on, but upon receiving my phone it seems nearly brand new.",
            "It’s perfect the battery last longer than expected can go almost two days with out charging it",
            "Received as listed great buy."
            ];

          /*for (let i=0;i<product.reviews.length;i++){
            product_review_list[i] = product.reviews[i]; original 
          }*/

          for (let i=0;i<tempReviewResult.length;i++){
            product_review_list[i] = tempReviewResult[i];
          }

          productMetaData["reviews"] = product_review_list;
      }
    });

    console.log(JSON.stringify("Akshit"));

    // productMetaData = JSON.stringify(productMetaData);

    axios.post('https://qtx9upms37.execute-api.us-east-1.amazonaws.com/default/products',productMetaData).then((result) => {
      console.log(result.data);
      history.push({pathname : ROUTES.PRODUCTPAGE, data : { userID : productMetaData.userID, asin : productMetaData.asin } }); // Add user email and asin number. 
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
)};

export default Dashboard;
