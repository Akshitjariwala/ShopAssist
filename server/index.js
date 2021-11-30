var axios = require("axios").default;
const express = require("express");
const amazonScraper = require('amazon-buddy');
const PORT = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var cors = require('cors');

const app = express();
app.use(bodyParser.json());
const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

app.use(cors(corsOptions));


app.post("/FetchProducts", (req,res) => {
  const productName = req.body.product;
  console.log(productName);
  fetchProductsFromAPI(productName).then( (result) => {
    res.status(200).send(result);
  })
});
  
async function fetchProductsFromAPI (productName) {
  console.log(productName);
    const products = await amazonScraper.products({ keyword: productName, number: 50 });
    const results = products.result;
    const productData = [];
    for (var i=0; i<results.length ; i++) {
        let review_list = [];
        const productDetails = {};
        const reviews = await amazonScraper.reviews({asin:results[i].asin,number:10});

        productDetails["asin"] = results[i].asin;
        productDetails["price"] = results[i].price.current_price.toString(); 
        productDetails["reviews_count"] = results[i].reviews.total_reviews.toString();
        productDetails["overall_rating"] = results[i].reviews.rating.toString();
        productDetails["title"] = results[i].title;
        productDetails["thumbnail"] = results[i].thumbnail;
        productDetails["stars_stat"] = reviews.stars_stat; 
        
        for (var j=0;j<reviews.result.length;j++) {
          review_list.push(reviews.result[j].review);
        }

        productDetails["reviews"] = review_list;
        productData.push(productDetails);
    }
    return productData;
};

app.post("/LoadDatabase", (req,res) => {
  // hit API gateway to trigger lambda function to save data into Dynamo DB.
  console.log(req.body.data);
  const productJSONData = req.body.data;
  
})

app.listen(PORT,() => {
   console.log(`Server listening on ${PORT}`);
});