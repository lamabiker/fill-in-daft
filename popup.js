function fillIn(e) {
  const target = e.target.value;
  let data = JSON.parse(localStorage.getItem(target));

  Object.keys(data).forEach(function(i) {
    let element = document.getElementById(i);
    element.value = data[i];
  });
}

function triggerForm() {
  let fields = ['name', 'phone', 'email', 'message'];
  let data = {};
  fields.forEach((i) => {
    data[i] = document.getElementById(i).value;
  });
  getPageData(data);
}

function initPopup() {
  const select = document.getElementById('names');
  const trigger = document.getElementById('trigger');
  select.addEventListener('change', fillIn);
  trigger.onclick = triggerForm;
  for (let key in localStorage){
    let opt = document.createElement('option');
    opt.value = key;
    opt.innerHTML = key;
    names.appendChild(opt);
  }
}

function handleStateChange(e) {
  let response = e.target.response;
  if(response) {
    let json = JSON.parse(response);
  }
}

function handleData(data) {
  if(data) {
    let json = JSON.parse(data);
    json.data.forEach((item) => {
      let obj = {};
      obj[item.name] = JSON.stringify(item);
      localStorage.setItem(item.name, JSON.stringify(item));
    })
  }

  initPopup();
}

function getPageData(data) {

  chrome.tabs.query( { active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { data }, function(response) {
      console.log('success');
    });
  });

}

function makeRequest(opts) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(opts.method, opts.url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}

document.addEventListener('DOMContentLoaded', () => {

  makeRequest({
    method: 'GET',
    url: '/data/data.json'
  })
  .then(handleData)
  .catch(function (err) {
    console.error('Augh, there was an error!', err.statusText);
  });

});
