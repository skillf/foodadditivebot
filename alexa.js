const Alexa = require('alexa-sdk');
const message = require('./message');
const query = require('./query');

const E = process.env;
const LAUNCHED = new Set();

function launch(txt) {
  LAUNCHED.add(this.event.session.sessionId);
  this.emit(':ask', txt);
};
function stop(txt) {
  LAUNCHED.delete(this.event.session.sessionId);
  this.emit(':tell', txt);
};
function tell(txt) {
  var e = LAUNCHED.has(this.event.session.sessionId)? ':ask':':tell';
  this.emit(e, e===':ask'? `${txt} <break time="2s"/> ${message('more')}`:txt);
};

function name(p) {
  if(!p.resolutions || !p.resolutions.resolutionsPerAuthority[0].values) return p.value||'';
  return p.resolutions.resolutionsPerAuthority[0].values[0].value.name;
};
function parameters(s) {
  return {key: name(s.key), tags: s.tags.value||''};
};

function LaunchRequest() {
  console.log(`ALEXA.LaunchRequest`);
  launch.call(this, message('welcome'));
};

function DefaultFallbackIntent() {
  console.log(`ALEXA.DefaultFallbackIntent`);
  tell.call(this, message('error'));
};

function HelpIntent() {
  console.log(`ALEXA.HelpIntent`);
  tell.call(this, message('help'));
};

function CancelIntent() {
  console.log(`ALEXA.CancelIntent`);
  stop.call(this, message('stop'));
};

function StopIntent() {
  console.log(`ALEXA.StopIntent`);
  stop.call(this, message('stop'));
};

function SessionEndedRequest() {
  console.log(`ALEXA.SessionEndedRequest`);
  stop.call(this, message('stop'));
};

function Unhandled() {
  var int = this.event.request.intent;
  if(!int || !int.slots) return tell.call(this, message('stop'));
  var nam = int.name, ps = parameters(int.slots);
  console.log(`ALEXA.${nam}>>`, ps);
  var out = query(ps.key||'', [ps.tags]);
  console.log(`ALEXA.${nam}<< "${out}"`);
  tell.call(this, out);
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
