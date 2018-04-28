const awsContext = require('aws-lambda-mock-context');
const alexaVerifier = require('alexa-verifier');
const bodyParser = require('body-parser');
const express = require('express');
const https = require('https');
const http = require('http');
const query = require('./query');
const alexa = require('./alexa');
const dialogflow = require('./dialogflow');

const E = process.env;
const X = express();

X.use(bodyParser.json());
X.use(bodyParser.urlencoded({extended: true}));
X.all('/dialogflow', dialogflow);
X.all('/alexa', (req, res) => {
  var h = req.headers;
  alexaVerifier(h.signaturecertchainurl, h.signature, JSON.stringify(req.body), (err) => {
    if(err) return res.status(400).send();
    var ctx = awsContext();
    alexa.handler(req.body, ctx);
    ctx.Promise.then((ans) => res.json(ans));
  });
});
X.all('/slack/install', (req, res) => {
  res.redirect(`https://slack.com/oauth/authorize?client_id=${E.SLACK_CLIENT_ID}&scope=${E.SLACK_SCOPE}`);
});
X.use(express.static('assets', {extensions:['html']}));

var server = http.createServer(X);
server.listen(E.PORT||80, () => {
  var addr = server.address();
  console.log(`SERVER: listening on channel ${addr.port}`);
});
