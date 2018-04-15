const Alexa = require('alexa-sdk');
const message = require('./message');
const intents = require('./intents');

const E = process.env;
const LAUNCHED = new Set();

function launch(t) {
  LAUNCHED.add(t.event.session.sessionId);
  return ':ask';
};

function stop(t) {
  LAUNCHED.delete(t.event.session.sessionId);
  return ':tell';
};

function tell(t) {
  return LAUNCHED.has(t.event.session.sessionId)? ':ask':':tell';
};

function parameters(ps) {
  var z = {};
  for(var k in ps)
    z[k.replace('_', '-')] = [ps[k].value];
  return z;
};

function LaunchRequest() {
  console.log(`ALEXA.LaunchRequest`);
  this.emit(launch(this), message('welcome'));
};

function DefaultFallbackIntent() {
  console.log(`ALEXA.DefaultFallbackIntent`);
  this.emit(tell(this), message('error'));
};

function HelpIntent() {
  console.log(`ALEXA.HelpIntent`);
  this.emit(tell(this), message('help'));
};

function CancelIntent() {
  console.log(`ALEXA.CancelIntent`);
  this.emit(stop(this), message('stop'));
};

function StopIntent() {
  console.log(`ALEXA.StopIntent`);
  this.emit(stop(this), message('stop'));
};

function SessionEndedRequest() {
  console.log(`ALEXA.SessionEndedRequest`);
  this.emit(stop(this), message('stop'));
};

function Unhandled() {
  var int = this.event.request.intent;
  if(int==null) return;
  var nam = int.name, ps = int.slots;
  var out = intents(nam.replace('_', '.'), parameters(ps));
  console.log(`ALEXA.${nam}>>`, ps);
  console.log(`ALEXA.${nam}<< "${out}"`);
  this.emit(tell(this), out);
};


var handlers = {
  LaunchRequest, DefaultFallbackIntent, SessionEndedRequest,
  'AMAZON.HelpIntent': HelpIntent, 'AMAZON.CancelIntent': CancelIntent, 'AMAZON.StopIntent': StopIntent, Unhandled
};
exports.handler = function(e, ctx, fn) {
  const alexa = Alexa.handler(e, ctx, fn);
  alexa.appId = E.ALEXA_APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
// this.event.request.intent.slots.text.value;
