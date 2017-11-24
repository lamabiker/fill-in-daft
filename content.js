let userFields = {
  name: document.getElementById('your_name'),
  email: document.getElementById('your_email'),
  phone: document.getElementById('your_phone'),
  message: document.getElementById('your_message')
};

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    var data = request.data || {};

    Object.keys(userFields).forEach((i) => {
      userFields[i].value = data[i];
    });

    sendResponse({data: data, success: true});
});
