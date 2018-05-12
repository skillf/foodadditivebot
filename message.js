const HELP = [
`Food additives are used to preserve flavor, or enhance taste and appearance. Look at ingredients on the packaging and you can find things like "E202", or "100(ii)" mentioned. These are called the E number, or I.N.S. code of the additive.

You can ask me about the "name", "code", "type", or "approval" of any such additive. You can ask like:
- What is INS 203?
- What is the E number of Potassium Sorbate?
- Tell me the name of INS 160.3.
- Give me the type of E 100.
- I want to know about approval of INS 203.

Say "done, or got it" when you are done talking to me.`,
];
const WELCOME = [
  'Hi! You can ask me about the "name", "code", "type", or "approval" of any food additive. Say "help", to know more, or "done / got it" when you are done talking to me.',
  'Hello! You can ask me about the "name", "code", "type", or "approval" of any food additive. Say "help", to know more, or "done / got it" when you are done talking to me.',
  'Good day! You can ask me about the "name", "code", "type", or "approval" of any food additive. Say "help", to know more, or "done / got it" when you are done talking to me.',
  'Greetings! You can ask me about the "name", "code", "type", or "approval" of any food additive. Say "help", to know more, or "done / got it" when you are done talking to me.',
];
const STOP = [
  'Goodbye!',
  'Bye!',
  'Tata!',
  'Alvida!',
];
const NONE = [
  "I don't know about that.",
  "It's not a food additive.",
  "I don't know about ingredients.",
  "I don't think it's a food additive.",
];
const MORE = [
  "Knowledge is power, ask me more.",
  "What else do you want to know?",
  "Anything else?",
  "Something else?",
  "What's next?",
  "What else?",
];
const CODE = [
  "${names} is ${code}.",
  "${names} is coded as ${code}.",
  "${names} is numbered as ${code}.",
  "${names} is written as ${code}.",
];
const NAME = [
  "${code} is ${names}.",
  "${code} is called as ${names}.",
  "${code} is known as ${names}.",
  "${code} is assigned to ${names}.",
];
const STATUS_NO = [
  "${code}, called as ${names}, is not approved.",
  "${code}, or ${names}, does not pass any compliance.",
  "No country has consented to the use of ${names}, a.k.a. ${code}.",
  "No one accepts use of ${names}, assigned ${code}.",
];
const STATUS_YES = [
  "${code}, called as ${names}, is approved by ${status}.",
  "${code}, or ${names}, passes compliance of ${status}.",
  "${status} have consented to the use of ${names}, a.k.a. ${code}.",
  "${status} accept use of ${names}, assigned ${code}.",
];
const TYPE = [
  "${code}, called as ${names}, is a ${type}.",
  "${code}, or ${names}, is a type of ${type}.",
  "${names}, a.k.a. ${code}, is used as a ${type}.",
  "${names}, assigned ${code}, works as a ${type}.",
];
const ANY_NO = [
  "${code}, called as ${names}, is a ${type}. It is not approved.",
  "${code}, or ${names}, is a type of ${type}. It does not pass any compliance.",
  "No country has consented to the use of ${names}, a.k.a. ${code}. It is used as a ${type}",
  "No one accepts use of ${names}, assigned ${code}. It works as a ${type}.",
];
const ANY_YES = [
  "${code}, called as ${names}, is a ${type}. It is approved by ${status}.",
  "${code}, or ${names}, is a type of ${type}. It passes compliance of ${status}.",
  "${status} have consented to the use of ${names}, a.k.a. ${code}. It is used as a ${type}.",
  "${status} accept use of ${names}, assigned ${code}. It works as a ${type}.",
];
const ERROR = [
  "I didn't get that. Can you say it again?",
  "I missed what you said. Say it again?",
  "Sorry, could you say that again?",
  "Sorry, can you say that again?",
  "Can you say that again?",
  "Sorry, I didn't get that.",
  "Sorry, what was that?",
  "One more time?",
  "What was that?",
  "Say that again?",
  "I didn't get that.",
  "I missed that.",
];

const FORMAT = new Map([
  ['help', HELP],
  ['welcome', WELCOME],
  ['stop', STOP],
  ['none', NONE],
  ['more', MORE],
  ['code', CODE],
  ['name', NAME],
  ['status_no', STATUS_NO],
  ['status_yes', STATUS_YES],
  ['type', TYPE],
  ['any_no', ANY_NO],
  ['any_yes', ANY_YES],
  ['error', ERROR],
]);

function message(typ, obj={}) {
  var fmts = FORMAT.get(typ), fmt = fmts[Math.floor(Math.random()*fmts.length)];
  return fmt.replace(/\${(\w+)}/g, (m, p1) => obj[p1]);
};
module.exports = message;
