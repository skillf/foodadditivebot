const number = require('./number');
const T = require('./type');

function token(type, value) {
  return {type, value};
};

function tokenize(txt) {
  var quo = null, y = '', z = [];
  for(var c of txt) {
    if((quo!=null && quo!=c) || /\w/.test(c)) { y += c; continue; }
    if(y) { z.push(token(quo!=null? T.QUOTED:T.TEXT, y)); y = ''; }
    if(/[\'\"\`]/.test(c)) quo = quo==null? c:null;
    else if(/\S/g.test(c)) z.push(token(T.TEXT, c));
  }
  if(y) z.push(token(quo!=null? T.QUOTED:T.TEXT, y));
  return z;
};

function nlp(txt) {
  var tkns = tokenize(txt), z = '';
  tkns.push(token(T.TEXT, ''));
  tkns = number(tkns);
  for(var tkn of tkns)
    z += tkn.value+' ';
  return z.trim();
};
module.exports = nlp;
