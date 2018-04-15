const toRoman = require('roman-numerals').toRoman;
const foodins = require('food-ins');
const foode = require('food-e');
const message = require('./message');
const nlp = require('./nlp');

function parameter(nam, ps) {
  if(nam.includes('.ins')) return ps['ins-tags'];
  if(nam.includes('.e')) return ps['e-tags'];
  return ps['any-tags'];
};

function status(sta) {
  var z = '';
  if(sta.includes('a')) z += 'Australia, New Zealand, ';
  if(sta.includes('e')) z += 'Europian Union, ';
  if(sta.includes('u')) z += 'United States, ';
  return z.replace(/,\s*$/, '').replace(/,\s*([^,]+?)$/, ', and $1');
};

function intents(nam, ps) {
  var inp = nlp(parameter(nam, ps).join(' '));
  inp = inp.replace(/(\s+0)?\.(\d+)/g, (m, p1, p2) => ` (${toRoman(p2)})`);
  var i = /\.any|\.ins/.test(nam)? foodins(inp)[0]:null;
  var e = /\.any|\.e/.test(nam)? foode(inp)[0]:null;
  if(i==null && e==null) return message('none');
  var obj = Object.assign({}, e, i);
  obj.code = `${i? 'I.N.S. '+i.code:''}${i && e? ' or ':''}${e? e.code:''}`;
  obj.status = status(obj.status);
  var sta = obj.status? 'yes':'no';
  if(nam.endsWith('any')) return message('any_'+sta, obj);
  if(nam.endsWith('code')) return message('code', obj);
  if(nam.endsWith('name')) return message('name', obj);
  if(nam.endsWith('type')) return message('type', obj);
  return message('status_'+sta, obj);
};
module.exports = intents;
