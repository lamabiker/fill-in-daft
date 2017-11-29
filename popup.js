function initPopup() {

  // Event listeners triggerForm() and prefillFields()
  names.addEventListener('change', prefillFields);
  trigger.onclick = triggerForm;

  names.innerHTML = '';
  let opt = document.createElement('option', { value: 0 });
  opt.innerText = 'Select a saved option';
  names.appendChild(opt);

  initPrefilledOptions();
}

function initPrefilledOptions() {
  if(localStorage.length) {
    for (let key in localStorage){
      let opt = document.createElement('option');
      opt.value = key;
      opt.innerText = key;
      names.appendChild(opt);
    }
    names.className = `${names.className.split(' ')[0]} is-visible`;
  } else {
    names.className = `${names.className.split(' ')[0]} is-hidden`;
  }
}

// UI action functions
function prefillFields(e) {
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

// Handle JSON if file provided, then iniitialise popup
function handleData(data) {
  if(data) {
    let json = JSON.parse(data);
    json.data.forEach((item) => {
      if(!localStorage.getItem(item.name)) {
        let obj = {};
        obj[item.name] = JSON.stringify(item);
        localStorage.setItem(item.name, JSON.stringify(item));
      }
    })
  }

  initPopup();
}

// Helper functions
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
    xhr.onerror = function (e) {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}

// Trigger popup on load
document.addEventListener('DOMContentLoaded', () => {

  makeRequest({
    method: 'GET',
    url: '/data/data.json'
  })
  .then(handleData)
  .catch(function (err) {
    console.warn('Augh, no JSON file or there was an error!', err.statusText);

    initPopup();
  });

});

// Interact with page and save to `localStorage`
function getPageData(data) {

  chrome.tabs.query( { active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { data }, function(response) {
      let json = { "data": [data] };
      handleData(JSON.stringify(json));
    });
  });

}
