const toRoman = require('roman-numerals').toRoman;
const foodins = require('food-ins');
const foode = require('food-e');
const message = require('./message');
const nlp = require('./nlp');

function status(sta) {
  var z = '';
  if(sta.includes('a')) z += 'Australia, New Zealand, ';
  if(sta.includes('e')) z += 'Europian Union, ';
  if(sta.includes('u')) z += 'United States, ';
  return z.replace(/,\s*$/, '').replace(/,\s*([^,]+?)$/, ', and $1');
};

function query(key, tags) {
  if(!tags) return message('none');
  var inp = nlp(tags.join(' '));
  inp = inp.replace(/(\s+0)?\.(\d+)/g, (m, p1, p2) => ` (${toRoman(p2)})`);
  var i = /^e/.test(key)? null:foodins(inp)[0];
  var e = /^ins/.test(key)? null:foode(inp)[0];
  if(i==null && e==null) return message('none');
  var obj = Object.assign({}, e, i);
  obj.code = `${i? 'I.N.S. '+i.code:''}${i && e? ' or ':''}${e? e.code:''}`;
  obj.status = status(obj.status);
  var sta = obj.status? 'yes':'no';
  if(!key) return message('any_'+sta, obj);
  if(key.endsWith('code')) return message('code', obj);
  if(key.endsWith('name')) return message('name', obj);
  if(key.endsWith('type')) return message('type', obj);
  return message('status_'+sta, obj);
};
module.exports = query;
