const query = require('./query');
const message = require('./message');

const LAUNCHED = new Set();

function tellAs(out, req, ask) {
  var source = req.originalRequest!=null? req.originalRequest.source:'agent';
  var speech = ask && source==='google'? `<speak>${out} <break time="2s"/> ${message('more')}</speak>`:out;
  return {speech, source: 'dialogflow', data: {google: {expectUserResponse: ask, isSsml: true}}};
};
function tell(out, req) {
  return tellAs(out, req, LAUNCHED.has(req.sessionId));
};

function DefaultWelcomeIntent(req) {
  LAUNCHED.add(req.sessionId);
  return message('welcome');
};

function AboutHelp(req) {
  return message('help');
};

function ActionsStop(req) {
  LAUNCHED.delete(req.sessionId);
  return message('stop');
};

function dialogflow(req, res) {
  var rst  = req.body.result, inp = rst.resolvedQuery;
  var int = rst.metadata.intentName, ps = rst.parameters;
  console.log(`DIALOGFLOW.${int}>> "${inp}"`, ps);
  if(int==='Default Welcome Intent') return res.json(tellAs(DefaultWelcomeIntent(req.body), true));
  if(int==='about_help') return res.json(tell(AboutHelp(req.body)));
  if(int==='action_stop') return res.json(tellAs(ActionsStop(req.body), false));
  var out = query(ps.key||'', ps.tags||[]);
  res.json(tell(out, req.body));
  console.log(`DIALOGFLOW.${int}<< "${out}"`);
};
module.exports = dialogflow;
