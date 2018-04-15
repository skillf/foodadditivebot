const awsContext = require('aws-lambda-mock-context');
const alexaVerifier = require('alexa-verifier');
const bodyParser = require('body-parser');
const express = require('express');
const https = require('https');
const http = require('http');
const intents = require('./intents');
const alexa = require('./alexa');

const E = process.env;
const X = express();

X.use(bodyParser.json());
X.use(bodyParser.urlencoded({extended: true}));
X.all('/dialogflow', (req, res) => {
  var rst  = req.body.result, inp = rst.resolvedQuery;
  var int = rst.metadata.intentName, ps = rst.parameters;
  var out = intents(int, ps);
  res.json({speech: out, source: 'dialogflow'});
  console.log(`DIALOGFLOW.${int}>> "${inp}"`, ps);
  console.log(`DIALOGFLOW.${int}<< "${out}"`);
});
X.all('/alexa', (req, res) => {
  var h = req.headers;
  alexaVerifier(h.signaturecertchainurl, h.signature, JSON.stringify(req.body), (err) => {
    if(err) return res.status(400).send();
    var ctx = awsContext();
    alexa.handler(req.body, ctx);
    ctx.Promise.then((ans) => res.json(ans));
  });
});
X.use(express.static('assets', {extensions:['html']}));

var server = http.createServer(X);
server.listen(E.PORT||80, () => {
  var addr = server.address();
  console.log(`SERVER: listening on channel ${addr.port}`);
});
