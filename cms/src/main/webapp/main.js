// import UiExtension from "@bloomreach/ui-extension";

document.addEventListener('DOMContentLoaded', () => {
  UiExtension.register().then((ui) => {
    showUiProperties(ui);
    ui.channel.page.get().then(showPageProperties);
    ui.channel.page.on('navigate', showPageProperties);

    onClick('refreshChannel', () => ui.channel.refresh());
    onClick('refreshPage', () => ui.channel.page.refresh());
    onClick('createLandingPage', () => {
      ui.channel.page.get().then(createLandingPage);

    });
  });
});

function showUiProperties (ui) {
  const properties = pluck(ui, ['baseUrl', 'extension', 'locale', 'timeZone', 'user', 'version']);
  showJson(properties, 'ui');
}

function showPageProperties (page) {
  showJson(page, 'page');
}

function showJson (json, id) {
  document.getElementById(id).innerHTML = JSON.stringify(json, null, ' ');
}

function createLandingPage (page) {
  // TODO use fetch
  //  let response = await fetch('_rp/'+page.siteMapItem.id+'./sitemap');

  var sourceSitemapItemUUID = page.siteMapItem.id;
  var pagePath = page.path;
  console.log(`create landing for sitemap ${sourceSitemapItemUUID}`);
  let xhr = new XMLHttpRequest();
  xhr.open('GET', '_rp/' + page.siteMapItem.id + './sitemap');
  xhr.responseType = 'json';
  xhr.setRequestHeader('contextPath', '/site');
  xhr.send();
  xhr.onload = function () {
    if (xhr.status != 200) { // analyze HTTP status of the response
      console.log(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
    } else { // show the result
      console.log(`Done, got ${xhr.response.length} bytes`); // responseText is the server
      showJson(xhr.response, 'allui');
      console.log(xhr.response.data.id);
      if (xhr.response.success) {
        var siteMap = xhr.response.data.id;
        let xhrPost = new XMLHttpRequest();
        xhrPost.open('POST', `_rp/${siteMap}./detach`);
        xhrPost.responseType = 'json';
        xhrPost.setRequestHeader('contextPath', '/site');
        xhrPost.setRequestHeader('siteMapItemUUID', sourceSitemapItemUUID);
        xhrPost.setRequestHeader('targetName', pagePath);
        xhrPost.send();
        xhrPost.onload = function () {
          console.log(`page copy returns ${xhrPost.status}`);
        }
      } else {
        console.log(`response returned from server ${xhr.response.success}`)
      }

    }
  };

  xhr.onprogress = function (event) {
    if (event.lengthComputable) {
      console.log(`Received ${event.loaded} of ${event.total} bytes`);
    } else {
      console.log(`Received ${event.loaded} bytes`); // no Content-Length
    }
  };

  xhr.onerror = function () {
    console.log("xhr request failed");
  };
}

function onClick (id, listener) {
  document.getElementById(id).addEventListener('click', listener);
}

function pluck (object, properties) {
  return Object.keys(object)
    .filter(key => properties.includes(key))
    .reduce((result, key) => {
      result[key] = object[key];
      return result;
    }, {});
}