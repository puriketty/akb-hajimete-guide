// ============================================================
// live.html の「セットリストと歌唱メンバー」欄。公演ごとに切り替えるタブと、
// ネタバレ防止の折りたたみの中身を作る。行・出典の組み立ては live-setlist-view.js。
// ============================================================

"use strict";

(function () {
  var tabsBox = document.getElementById("live-embed-tabs");
  var bodyBox = document.getElementById("live-embed-body");
  if (!tabsBox || !bodyBox) return;

  var setlists = liveSetlistsOfGroup();
  var current = setlists[0] ? setlists[0].id : null;

  function render() {
    tabsBox.replaceChildren();
    setlists.forEach(function (s) {
      var button = liveEl("button", "", s.tabLabel);
      button.type = "button";
      button.setAttribute("aria-pressed", String(current === s.id));
      button.addEventListener("click", function () {
        current = s.id;
        render();
      });
      tabsBox.appendChild(button);
    });

    bodyBox.replaceChildren();
    var setlist = setlists.filter(function (s) {
      return s.id === current;
    })[0];
    if (!setlist) return;
    bodyBox.appendChild(liveEl("h3", "live-sub-title", setlist.title));
    bodyBox.appendChild(buildLiveSetlistView(setlist));
  }

  render();
})();
