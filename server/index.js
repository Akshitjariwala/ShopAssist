const express = require("express");
const amazonScraper = require("amazon-buddy");
var bodyParser = require("body-parser");
var cors = require("cors");
var AWS = require("aws-sdk");
var router = express.Router();
const app = express();
app.use(express.json());
const port = 8080;
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
var product_data_api = require('./constants');

const { appConfig } = require("./config");
const service = require("./service");
const { config } = require("aws-sdk");

app.use(cors());

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "ASIA5YETWBVQVCILPOL7",
  secretAccessKey: "+6zhbDSjOuZw/ZEIMZLWFcmmDxFB4ZWVAiCw2YOZ",
  sessionToken:
    "FwoGZXIvYXdzEDAaDF6Sy1w+2ef6aFzCKSLBAUvBu4jLoUlF0rsmj0URl4Z5ORt4xUgqKiA4yYpJFUvTrW5aXdA6l0JdCHsTqiiCNoPwwk/Bc+yZerR24nI9oCfzHnRnhWuqL52QVC3wKSd+NfnLmi7i1oG8f1tPA6vV1HdraSa8EP99Z9MUxfvE1O9KUA58obwYtPi3U9yuPF16/3exhXnqts6i+lzH6Uhj6eDBcrESbKgMKk1eS+HWFUcQ6JMMJMo2i6P9jemf5EGbGgo4H8fuhGveIdhMQrMarJMo8a/PjQYyLWGMhBRk6JBDbcceo7Kd8HSD6uqs1dWeXUHBM0jVper/KG5rrB64lWT+Yk/KQw==",
});

var dynamoDB = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json());
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.post("/FetchProducts", (req, res) => {
  const productName = req.body.product;
  fetchProductsFromAPI(productName).then((result) => {
    res.status(200).send(result);
  });
});

/*async function fetchProductsFromAPI (productName) {
  const productData = [];
  try {
  console.log("Fetching products....")
    const products = await amazonScraper.products({ keyword: productName, number: 5 });
    const results = products.result;
    
    for (var i=0; i<results.length ; i++) {
        let review_list = [];
        const productDetails = {};
        console.log("Fetching reviews....")
        const reviews = await amazonScraper.reviews({asin:results[i].asin,number:5});

        productDetails["userID"] = "jonDoe";
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

        console.log(productDetails);
        productDetails["reviews"] = review_list;
        productData.push(productDetails);
    }
  } catch (err) {
    console.log(err);
  }
    return productData;
};*/

async function fetchProductsFromAPI(productName) {
  console.log(productName);
  
  var results = product_data_api.PS4_PRODUCT_DATA;
  const productData = [];
  for (var i = 0; i < results.length; i++) {
    let review_list = [];
    const productDetails = {};
    try {
    var reviews = await amazonScraper.reviews({
      asin: results[i].asin,
      number: 20,
    });

    console.log(reviews);

    } catch(err) {
      console.log(err)
    }
    productDetails["userID"] = "akshitjariwala19";
    productDetails["asin"] = results[i].asin;
    productDetails["price"] = results[i]["price.current_price"].toString();
    productDetails["reviews_count"] = results[i]["reviews.total_reviews"].toString();
    productDetails["overall_rating"] = results[i]["reviews.rating"].toString();
    productDetails["title"] = results[i].title;
    productDetails["thumbnail"] = results[i].thumbnail;
    productDetails["stars_stat"] = reviews.stars_stat;

    for (var j = 0; j < reviews.result.length; j++) {
      review_list.push(reviews.result[j].review);
    }

    productDetails["reviews"] = review_list;

    productData.push(productDetails);
  }

  console.log(productData);

  return productData;
}

app.post("/LoadDatabase", (req, res) => {
  console.log(req.body.data.body.reviewID);
  console.log(req.body.data.body.reviewList);
  const productReviewID = req.body.data.body.reviewID;
  const productReviewList = req.body.data.body.reviewList;

  var params = {
    TableName: "ProductReview",
    Item: {
      reviewID: productReviewID,
      reviewList: productReviewList,
    },
  };

  const result = productReviewID;

  dynamoDB.put(params, (err, response) => {
    if (err) console.log(err);
    else return res.status(200).send(result);
  });
});

app.post("/FetchSentiment", (req, res) => {
  const sentimentID = req.body.data;
  console.log("In Fetch sentiment function.");
  console.log(sentimentID);

  var params = {
    TableName: "sentimentTable",
    KeyConditionExpression: "#transactionID = :transactionID",
    ExpressionAttributeNames: {
      "#transactionID": "sentimentID",
    },
    ExpressionAttributeValues: {
      ":transactionID": sentimentID,
    },
  };

  dynamoDB.query(params, (err, response) => {
    if (err) console.log(err);
    else console.log(response);
    return res.status(200).send(response);
  });
});

const poolData = {
  UserPoolId: appConfig.UserPoolId,
  ClientId: appConfig.ClientId,
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

app.post("/signUp", async (req, res) => {
  console.log("signup", req);
  let name = req.body.email;
  let email = req.body.email;
  let password = req.body.password;
  let attributeList = [];

  attributeList.push(
    new AmazonCognitoIdentity.CognitoUserAttribute(
      { Name: "name", Value: name },
      { Name: "email", Value: email }
    )
  );
  userPool.signUp(name, password, attributeList, null, function (err, result) {
    if (err) {
      res.json({
        statusCode: 400,
        status: "failure",
        error: err,
      });
    } else {
      return res.json({
        statusCode: 200,
        status: "success",
        result,
      });
    }
  });
});

app.post("/signUpVerify", async (req, res) => {
  try {
    let email = req.body.email;
    let verificationCode = req.body.verificationCode;

    let userData = {
      Username: email,
      Pool: userPool,
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.confirmRegistration(
      verificationCode,
      true,
      function (err, result) {
        if (err) {
          res.json({
            statusCode: 400,
            status: "failure",
            error: err,
          });
        } else {
          return res.json({
            statusCode: 200,
            status: "success",
            result,
          });
        }
      }
    );
  } catch (err) {
    return res.json({
      statusCode: 400,
      status: "failure",
      error: err,
    });
  }
});

app.post("/resendConfirmationCode", async (req, res) => {
  try {
    let email = req.body.email;

    const params = {
      ClientId: appConfig.ClientId,
      Username: email,
    };
    const client = new AWS.CognitoIdentityServiceProvider({
      region: "us-east-1",
    });
    const result = await client.resendConfirmationCode(
      params,
      function (err, result) {
        if (err) {
          res.json({
            statusCode: 400,
            status: "failure",
            error: err,
          });
        } else {
          return res.json({
            statusCode: 200,
            status: "success",
            result,
          });
        }
      }
    );
  } catch (err) {
    return res.json({
      statusCode: 400,
      status: "failure",
      error: err,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      {
        Username: email,
        Password: password,
      }
    );

    let userData = {
      Username: email,
      Pool: userPool,
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        var today = new Date();
        today.setHours(today.getHours() + 1);
        return res.json({
          statusCode: 200,
          status: "success",
          result: {
            accessToken: result.getAccessToken().getJwtToken(),
            idToken: result.getIdToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
            expiryTime: today
          },
        });
      },
      onFailure: function (err) {
        return res.json({
          statusCode: 400,
          status: "failure",
          error: err,
        });
      },
    });
  } catch (err) {
    return res.json({
      statusCode: 400,
      status: "failure",
      error: err,
    });
  }
});

app.post("/forgotPassword", async (req, res) => {
  try {
    let email = req.body.email;

    let userData = {
      Username: email,
      Pool: userPool,
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.forgotPassword({
      onSuccess: function (result) {
        console.log("call result: " + result);
        res.json({
          statusCode: 200,
          status: "success",
          result,
        });
      },
      onFailure: function (err) {
        res.json({
          statusCode: 400,
          status: "failure",
          error: err,
        });
      },
    });
  } catch (err) {
    return res.json({
      statusCode: 400,
      status: "failure",
      error: err,
    });
  }
});

app.post("/resetPassword", async (req, res) => {
  try {
    let email = req.body.email;
    let verificationCode = req.body.verificationCode;
    let newPassword = req.body.newPassword;

    let userData = {
      Username: email,
      Pool: userPool,
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess: function (result) {
        res.json({
          statusCode: 200,
          status: "success",
          result,
        });
      },
      onFailure: function (err) {
        res.json({
          statusCode: 400,
          status: "failure",
          error: err,
        });
      },
    });
  } catch (err) {
    return res.json({
      statusCode: 400,
      status: "failure",
      error: err,
    });
  }
});

app.listen(port, () => {
  console.log('Shop Assist Server : listening on port ${port}');
});
