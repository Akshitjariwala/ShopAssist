var axios = require("axios").default;
const express = require("express");
const amazonScraper = require('amazon-buddy');
const PORT = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var cors = require('cors');
var AWS = require('aws-sdk');

AWS.config.update({
  "region": "us-east-1",
  "accessKeyId": "ASIA5YETWBVQR2A5YUY4",
  "secretAccessKey": "Fj/PQKzbeQCwKFolxtEb3oJ5eQ5OoOJngBZCA+T0",
  "sessionToken" : "FwoGZXIvYXdzEHYaDPoIYjCOzyeHlfR0SCLBAXB/7T/GOxYvPmzLDOrJZgoXvZNp2+/KFTKzkUXxOqr4YVFpMC5lGMomzmTvD334nmkREljqvz+TzrpJ8QpBQUTsHIeNebeJlGmR/dn3nOvuIsluNe768lrONNih1Xf2AzgbvBxy9S6H2Qjzj51hyxY9BXXxhCxFLXytPLTjN6MB5+Su4N0Phhkh81mtLL6WDCQz2jDZDWjr6k00LaWV1zVwwB+ttaIPyiHDzw2am6YuUM4FTG+ZoB/PzhcxTgHKzv8orsamjQYyLT/dt9h148+j0FylFYLzXNCNSQM5P1Dtq/XTtl4cjY0kqq8audR9dXgZOdd56A=="
 });

var dynamoDB = new AWS.DynamoDB.DocumentClient();

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
  
/*async function fetchProductsFromAPI (productName) {
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
};*/

async function fetchProductsFromAPI (productName) {
  console.log(productName);
    //const products = await amazonScraper.products({ keyword: productName, number: 50 });
    const product = {
        position: { page: 1, position: 1, global_position: 1 },
        asin: 'B07P6Y7954',
        price: {
            discounted: false,
            current_price: 574,
            currency: 'USD',
            before_price: 0,
            savings_amount: 0,
            savings_percent: 0
        },
        reviews: { total_reviews: 317, rating: 4.6 },
        url: 'https://www.amazon.com/dp/B07P6Y7954',
        score: '1458.20',
        sponsored: false,
        amazonChoice: false,
        bestSeller: false,
        amazonPrime: false,
        title: 'Newest Flagship Microsoft Xbox One S 1TB HDD Bundle with Two (2X) Wireless Controllers, 1-Month Game Pass Trial, 14-Day Xbox Live Gold Trial - White',
        thumbnail: 'https://m.media-amazon.com/images/I/51-JAEI1jzL._AC_UY218_.jpg'
    }

    const results = [];
    results.push(product);

    //const results = products.result;
    const productData = [];
    for (var i=0; i<results.length ; i++) {
        let review_list = [];
        const productDetails = {};
        const reviews = await amazonScraper.reviews({asin:'B07P6Y7954',number:50});

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

    console.log(productData);

    return productData;
};

app.post("/LoadDatabase", (req,res) => {
 
  console.log(req.body.data.reviewID);
  console.log(req.body.data.reviewList);
  const productReviewID = req.body.data.reviewID;
  const productReviewList = req.body.data.reviewList;

  var params = {
    TableName : "ProductReview",
    Item : {
      reviewID : productReviewID,
      reviewList : productReviewList
    }
  }

  const result = productReviewID;

  dynamoDB.put(params, (err, response) => {
      if(err)
        console.log(err);
      else  
        return res.status(200).send(result);
  });
})

app.post("/FetchSentiment", (req,res) => {
  
  const sentimentID = req.body.data;
  console.log("In Fetch sentiment function.");
  console.log(sentimentID);

  var params = {
    TableName : "sentimentTable",
    KeyConditionExpression : "#transactionID = :transactionID",
    ExpressionAttributeNames:{
        "#transactionID": "sentimentID"
    },
    ExpressionAttributeValues: {
    ":transactionID": sentimentID
}
};

  dynamoDB.query(params, (err,response) => {
    if(err) console.log(err);
    else
      console.log(response);
  });
});

app.listen(PORT,() => {
   console.log(`Server listening on ${PORT}`);
});