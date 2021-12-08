const express = require("express");
const amazonScraper = require('amazon-buddy');
var bodyParser = require('body-parser');
var cors = require('cors');
var AWS = require('aws-sdk');
var router = express.Router();
const app = express();
app.use(express.json());
const port = 8080;
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

const { appConfig } = require("./config");
const service = require("./service");
const { config } = require("aws-sdk");

app.use(cors());


AWS.config.update({
  "region": "us-east-1",
  "accessKeyId": "ASIA5YETWBVQZZXTLPFG",
  "secretAccessKey": "veNUE5e8qMFv0bvI2O0soR8/KWTvxJ40iUWY0dsY",
  "sessionToken" : "FwoGZXIvYXdzEPr//////////wEaDHIOvUxEaHIlnwRN7SLBAdGbIK4Mr3SgqHhAQ0bw0PLiZfM6EGcp/L70aV9aEp6a9NXON/wOPFAlE+WbPF6OCNYTd6X3oTxtrvBP+rLZ63hb66t9quVs/a0OgreCp5MtqH6mnagbYJSCOTXaYbsJjdvOo8eJcJk7zkmZMQd6jt0NS8wEOOpk6baDeSWmbj7aiKE3jwSmM1pYF4pP3bX2miUkaF4KcF662kIZRrSK91D9xIlCeiUzrhsnzX6/kuheZpb+DxXKoi1k/9xmHdttjIso4MDDjQYyLcsOs3C5YXga7cwfRz5xqLH182DckCPxG2t9+tDpiK3zhT6F+5RFayg4dySYfA=="
 });

var dynamoDB = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json());
const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

app.use(cors(corsOptions));


app.post("/FetchProducts", (req,res) => {
  const productName = req.body.product;
  fetchProductsFromAPI(productName).then( (result) => {
    res.status(200).send(result);
  })
});
  
/*async function fetchProductsFromAPI (productName) {
  console.log("Fetching products....")
    const products = await amazonScraper.products({ keyword: productName, number: 5 });
    const results = products.result;
    const productData = [];
    for (var i=0; i<results.length ; i++) {
        let review_list = [];
        const productDetails = {};
        console.log("Fetching reviews....")
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

        console.log(productDetails);
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
        asin: 'B07XV8C1G5',
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

        productDetails["userID"] = "ironman12"
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
    const client = new AWS.CognitoIdentityServiceProvider({ region: "us-east-1" });
    const result = await client.resendConfirmationCode(params, function (err, result) {
      if (err) {
        res.json({
          statusCode: 400,
          status: "failure",
          error: err
        });
      } else {
        return res.json({
          statusCode: 200,
          status: "success",
          result
        });
      }
    });
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
        return res.json({
          statusCode: 200,
          status: "success",
          result: {
            accessToken: result.getAccessToken().getJwtToken(),
            idToken: result.getIdToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
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
  console.log(`Shop Assist Server : listening on port ${port}`);
});
