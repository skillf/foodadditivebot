var ACCESS_TOKEN = 'a81e31683f1b41e39df0a3a23dbe9e58';

var form = document.querySelector('form');
var query = document.querySelector('#query');
var card = document.querySelector('card');
var ansHead = document.querySelector('#ans-head');
var ansBody = document.querySelector('#ans-body');
var client = new ApiAi.ApiAiClient({accessToken: ACCESS_TOKEN});

form.onsubmit = function() {
  var txt = query.value;
  client.textRequest(txt).then(function(res) {
    query.value = '';
    var qry = res.result.resolvedQuery;
    var ans = res.result.fulfillment.speech;
    var sph = new SpeechSynthesisUtterance(ans);
    card.removeAttribute('style');
    ansHead.textContent = qry;
    ansBody.innerHTML = ans.replace(/\n/g, '<br>');
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(sph);
    window.speechSynthesis.resume();
  }).catch(function() {
    card.removeAttribute('style');
    ansHead.textContent = 'ERROR!';
    ansBody.innerHTML = 'Failed to connect to service.';
  });
  return false;
};

if(window.location.search==='?install_success=1') {
  var section = document.getElementById('install_success');
  section.removeAttribute('style');
}
