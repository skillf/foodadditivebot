const fs = require('fs');

function toId(v) {
  return v.replace(/[^\w]/g, '_');
};

function toValues(vs) {
  var z = [];
  for(var v of vs)
    z.push({name: v});
  return z;
};

function toSlots(v) {
  var map = new Map(), z = [];
  for(var response of v.responses) {
    for(var parameter of response.parameters)
      map.set(parameter.name, parameter.dataType);
  }
  for(var [k, v] of map)
    z.push({name: toId(k), type: toId(v.substring(1))});
  return z;
};

function toSamples(v) {
  var z = [];
  for(var sample of v) {
    var text = '';
    for(var datum of sample.data) {
      if(datum.alias) text += `{${toId(datum.alias)}}`;
      else text += datum.text;
    }
    z.push(text);
  }
  return z;
};

var schema = JSON.parse(fs.readFileSync('alexa.json', 'utf8'));
schema.interactionModel.languageModel.types = [];
schema.interactionModel.languageModel.intents.length = 3;

var entities = fs.readdirSync('entities');
for(var entity of entities) {
  if(!entity.endsWith('_entries_en.json')) continue;
  var name = toId(entity.replace('_entries_en.json', ''));
  var values = toValues(JSON.parse(fs.readFileSync('entities/'+entity, 'utf8')));
  schema.interactionModel.languageModel.types.push({name, values});
}

var intents = fs.readdirSync('intents');
var intentMap = new Map();
for(var intent of intents) {
  if(intent.endsWith('_usersays_en.json')) continue;
  var value = JSON.parse(fs.readFileSync('intents/'+intent, 'utf8'));
  intentMap.set(intent.replace('.json', ''), value);
}
for(var intent of intents) {
  if(!intent.endsWith('_usersays_en.json')) continue;
  var value = JSON.parse(fs.readFileSync('intents/'+intent, 'utf8'));
  var intentValue = intentMap.get(intent.replace('_usersays_en.json', ''));
  var name = toId(intentValue.name);
  var slots = toSlots(intentValue);
  var samples = toSamples(value);
  schema.interactionModel.languageModel.intents.push({name, slots, samples});
}

fs.writeFileSync('alexa.json', JSON.stringify(schema, null, 2));
