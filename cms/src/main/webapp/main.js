// import UiExtension from "@bloomreach/ui-extension";

document.addEventListener('DOMContentLoaded', () => {
  UiExtension.register().then((ui) => {

    ui.channel.page.get().then(showPageAttibutes);
    ui.channel.page.on('navigate', showPageAttibutes);

    onClick('createLandingPage', () => {
      resetMessages();
      ui.channel.page.get().then(createLandingPage).then(ui.channel.refresh());
    });

  });
});

function showPageAttibutes (page) {
  // console.log(page.siteMapItem);
  document.getElementById('path').innerText = page.path;
}

function createLandingPage (page) {

  fetch('_rp/' + page.siteMapItem.id + './sitemap', {
    headers: {
      'contextPath': '/site'
    }
  }).then(function (response) {
    if (response.status !== 200) {
      response.json().then((json) => document.getElementById('error-message').innerText = json.message);
    } else {
      response.json().then(function (json) {
        var siteMap = json.data.id;
        fetch('_rp/' + siteMap + './detach', {
          method: 'post',
          headers: {
            'contextPath': '/site',
            'siteMapItemUUID': page.siteMapItem.id,
            'targetName': page.path
          }
        }).then(function (response) {
          if (response.status !== 200) {
            response.json().then((json) => document.getElementById('error-message').innerText = json.message);
          } else {
            response.json().then((json) => document.getElementById('success-message').innerText = json.message)
          }
        });
      }).catch(function (error) {
        response.json().then((json) => document.getElementById('error-message').innerText = error);
      });
    }
  }).catch(function (error) {
    response.json().then((json) => document.getElementById('error-message').innerText = error);
  });
}

function onClick (id, listener) {
  document.getElementById(id).addEventListener('click', listener);
}

function resetMessages () {
  document.getElementById('error-message').innerText = '';
  document.getElementById('success-message').innerText = '';
}