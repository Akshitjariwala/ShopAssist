const request = require('request');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const aws = require('aws-sdk');
const { appConfig } = require("./config");

const send401 = (res) => {
    res.status(401)
    res.json()
}

const cognito = new aws.CognitoIdentityServiceProvider();

const authenticate = async (req, res, next) => {
    const token = req.get('Authorization');
    if (undefined === token) {
        send401(res);
    } else {
        request({
            url: `https://cognito-idp.us-east-1.amazonaws.com/${appConfig.UserPoolId}/.well-known/jwks.json`,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                pems = {};
                var keys = body['keys'];
                for (var i = 0; i < keys.length; i++) {
                    var key_id = keys[i].kid;
                    var modulus = keys[i].n;
                    var exponent = keys[i].e;
                    var key_type = keys[i].kty;
                    var jwk = { kty: key_type, n: modulus, e: exponent };
                    var pem = jwkToPem(jwk);
                    pems[key_id] = pem;
                }
                var decodedJwt = jwt.decode(token, { complete: true });
                if (!decodedJwt) {
                    console.log("Not a valid JWT token");
                    send401(res);
                }
                else {
                    var kid = decodedJwt.header.kid;
                    var pem = pems[kid];
                    if (!pem) {
                        console.log('Invalid token');
                        send401(res);
                    }
                    jwt.verify(token, pem, function (err, payload) {
                        if (err) {
                            console.log("Invalid Token.");
                            send401(res);
                        } else {
                            //console.log("Valid Token.");
                            var params = {
                                AccessToken: req.get('Authorization')
                            };
                            cognito.getUser(params, async (err, data) => {
                                if (err) {
                                    send401(res);
                                }
                                else {
                                    //req.user = data.UserAttributes[3].Value;
                                    var user = data.UserAttributes.filter(obj => {
                                        return obj.Name === 'email'
                                    })
                                    req.user = user[0].Value;
                                    next();
                                }
                            });
                        }
                    });
                }
            } else {
                console.log("Error! Unable to download JWKs", error);
                send401(res);
            }
        });
    }
}

module.exports = {
    authenticate
}