const fs = require('fs');
const corpus = require('./corpus');

function addCode(set, code) {
  var arr = code.replace(/^e?\s*(\d\d\d+)\s*([a-z])?/i, 'e $1 $2').split(' ').filter((v) => v);
  for(var i=0; i<arr.length; i++) {
    set.add(arr[i].replace(/[\(\)]/g, ''));
    for(var j=i+1; j<arr.length; j++)
      set.add(arr.slice(i, j+1).join(''));
  }
};

var set = new Set();
for(var r of corpus.values()) {
  addCode(set, r.code);
  var txt = (r.names+' '+r.type+' '+r.status).replace(/[\s\[\]\(\)\'\"\–\-\+\:\,\.#]+/g, ' ');
  for(var wrd of txt.toLowerCase().split(' '))
    set.add(wrd);
}
set.delete('');

var z = '';
for(var v of set)
  z += `"${v}","${v.replace(/[\(\)]/g, '')}"\n`;
fs.writeFileSync('out.txt', z);
