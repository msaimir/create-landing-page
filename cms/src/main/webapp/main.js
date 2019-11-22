// import UiExtension from "@bloomreach/ui-extension";

document.addEventListener('DOMContentLoaded', () = > {
  UiExtension.register().then((ui) = > {
    showUiProperties (ui);

ui.channel.page.get().then(showPageProperties);
ui.channel.page.on('navigate', showPageProperties);

onClick('refreshChannel', () = > ui.channel.refresh()
)
;
onClick('refreshPage', () = > ui.channel.page.refresh()
)
;
})
;
})
;

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

function onClick (id, listener) {
  document.getElementById(id).addEventListener('click', listener);
}

function pluck (object, properties) {
  return Object.keys(object)
    .filter(key = > properties.includes(key)
)
.
  reduce((result, key) = > {
    result[key] = object[key];
  return result;
},
  {
  }
)
  ;
}