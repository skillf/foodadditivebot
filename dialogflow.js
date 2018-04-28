const query = require('./query');
const message = require('./message');

const LAUNCHED = new Set();

function tell(out, req) {
  var ask = LAUNCHED.has(req.sessionId);
  var source = req.originalRequest!=null? req.originalRequest.source:'agent';
  var speech = ask && source==='google'? `<speak>${out} <break time="2s"/> ${message('more')}</speak>`:out;
  return {speech, source: 'dialogflow', data: {google: {expectUserResponse: ask, isSsml: true}}};
};

function DefaultWelcomeIntent(req) {
  LAUNCHED.add(req.sessionId);
  return null;
};

function ActionsStop(req) {
  LAUNCHED.delete(req.sessionId);
  return null;
};

function dialogflow(req, res) {
  var rst  = req.body.result, inp = rst.resolvedQuery;
  var int = rst.metadata.intentName, ps = rst.parameters;
  console.log(`DIALOGFLOW.${int}>> "${inp}"`, ps);
  if(int==='Default Welcome Intent') return res.json(DefaultWelcomeIntent(req.body));
  if(int==='action_stop') return res.json(ActionsStop(req.body));
  var out = query(ps.key||'', ps.tags||[]);
  res.json(tell(out, req.body));
  console.log(`DIALOGFLOW.${int}<< "${out}"`);
};
module.exports = dialogflow;
