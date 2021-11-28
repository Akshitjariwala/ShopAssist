const express = require("express");
var router = express.Router();
const app = express();
app.use(express.json())
const port = 8080;
const cors = require("cors");
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const { appConfig } = require("./config");
const service = require("./service");
const { config } = require("aws-sdk");

const poolData = {
  UserPoolId: appConfig.UserPoolId,
  ClientId: appConfig.ClientId
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

app.post("/signUp", async (req, res) => {
  console.log('signup', req);
  let name = req.body.email;
  let email = req.body.email;
  let password = req.body.password;
  let attributeList = [];

  attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "name", Value: name }, { Name: "email", Value: email }));
  userPool.signUp(name, password, attributeList, null, function (err, result) {
    if (err) {
      res.json({
        status: "failure",
        error: err
      });
    }
    return res.json({
      status: "success",
      result
    });
  })
});

app.post("/signUpVerify", async (req, res) => {

  try {
    let email = req.body.email;
    let verificationCode = req.body.verificationCode;

    let userData = {
      Username: email,
      Pool: userPool
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.confirmRegistration(verificationCode, true, function (err, result) {
      if (err) {
        res.json({
          status: "failure",
          error: err
        });
      }
      return res.json({
        status: "success",
        result
      });

    });
  } catch (err) {
    return res.json({
      status: "failure",
      error: err
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: email,
      Password: password,
    });

    let userData = {
      Username: email,
      Pool: userPool
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        return res.json(
          {
            status: 'success',
            result: {
              accessToken: result.getAccessToken().getJwtToken(),
              idToken: result.getIdToken().getJwtToken(),
              refreshToken: result.getRefreshToken().getToken()
            }
          });

      },
      onFailure: function (err) {
        return res.json({
          status: "failure",
          error: err
        });
      }
    });

  } catch (err) {
    return res.json({
      status: "failure",
      error: err
    });
  }
});

app.post("/forgotPassword", async (req, res) => {
  try {
    let email = req.body.email;

    let userData = {
      Username: email,
      Pool: userPool
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.forgotPassword({
      onSuccess: function (result) {
        console.log('call result: ' + result);
        res.json({
          status: "success",
          result
        });
      },
      onFailure: function (err) {
        res.json({
          status: "failure",
          error: err
        });
      }
    })
  } catch (err) {
    return res.json({
      status: "failure",
      error: err
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
      Pool: userPool
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess: function (result) {
        res.json({
          status: "success",
          result
        });
      },
      onFailure: function (err) {
        res.json({
          status: "failure",
          error: err
        });
      }
    })
  } catch (err) {
    return res.json({
      status: "failure",
      error: err
    });
  }
});

app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});
