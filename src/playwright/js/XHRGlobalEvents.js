window.processFlag = -1;

var open = window.XMLHttpRequest.prototype.open,
  send = window.XMLHttpRequest.prototype.send;

function openReplacement(method, url, async, user, password) {
  this._url = url;
  return open.apply(this, arguments);
}

function sendReplacement(data) {
  if (this.onreadystatechange) {
    this._onreadystatechange = this.onreadystatechange;
  }
  console.log('Request Sent');
  this.onreadystatechange = onReadyStateChangeReplacement;
  processFlag = 0;
  return send.apply(this, arguments);
}

function onReadyStateChangeReplacement() {
  window.processFlag = this.readyState;
  console.log('Ready State changed to : ', this.readyState);
  console.log('process Flag : ', window.processFlag);
  console.log('boolean check : ', window.processFlag === 4);
  console.log('document readystate : ', document.readyState);
  if (this._onreadystatechange) {
    return this._onreadystatechange.apply(this, arguments);
  }
}

window.XMLHttpRequest.prototype.open = openReplacement;
window.XMLHttpRequest.prototype.send = sendReplacement;
