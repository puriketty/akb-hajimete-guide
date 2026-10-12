// ============================================================
// ライブ(THREE CONCEPTS LIVE)のセットリストを、1公演ぶん組み立てる共通部品。
// live-setlist.html(live-setlist.js。曲をタップすると配信サービスのシートが開く)と、
// live.html の「セットリストと歌唱メンバー」(live-setlist-embed.js。タップなし)の、両方で使う。
// データは data/songs.js・data/setlists.js。
//
// 項目(行・公演中の発表・公演の説明)ごとに、出典リンクを [1][2] の形で付け、
// 出典の一覧(番号つき)を、公演の一番下に出す。
// ============================================================

"use strict";

var LIVE_GROUP_ID = "three-concepts-live";

var liveSongsById = {};
SONGS.forEach(function (s) {
  liveSongsById[s.id] = s;
});

function liveEl(tag, className, text) {
  var node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function liveSetlistsOfGroup() {
  return SETLISTS.filter(function (s) {
    return s.category === "live" && s.group === LIVE_GROUP_ID;
  });
}

// 公演ごとに、出典に出てくる順で番号をふる
function numberSources(setlist) {
  var order = [];
  function add(keys) {
    (keys || []).forEach(function (k) {
      if (SETLIST_SOURCES[k] && order.indexOf(k) < 0) order.push(k);
    });
  }
  if (setlist.intro) add(setlist.intro.src);
  (setlist.items || []).forEach(function (item) {
    add(item.src);
  });
  (setlist.notices || []).forEach(function (n) {
    add(n.src);
  });
  var numbers = {};
  order.forEach(function (k, i) {
    numbers[k] = i + 1;
  });
  return { order: order, numbers: numbers };
}

function sourceLinks(keys, numbers, className) {
  var box = liveEl("span", className || "live-row-src");
  (keys || []).forEach(function (k) {
    var src = SETLIST_SOURCES[k];
    if (!src) return;
    var a = liveEl("a", "src-link", "[" + numbers[k] + "]");
    a.href = src.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.title = "出典: " + src.label;
    a.setAttribute("aria-label", "出典" + numbers[k] + "(新しいタブで開く)");
    box.appendChild(a);
  });
  return box;
}

function buildRow(item, numbers, onSong) {
  var li = liveEl("li", "live-row" + (item.type === "note" ? " live-row-note" : ""));
  var main = liveEl("span", "live-row-main");
  var wrap;

  if (item.type === "song") {
    var song = liveSongsById[item.songId];
    if (!song) return li;
    var title = song.title;
    if (item.note) title += "(" + item.note + ")";
    main.appendChild(liveEl("span", "live-row-title", title));
    var line = item.center || item.detail;
    if (line) main.appendChild(liveEl("span", "live-row-detail", line));
    if (!onSong && item.center && item.detail && item.detail !== item.center) {
      main.appendChild(liveEl("span", "live-row-detail", item.detail));
    }
    if (onSong) {
      wrap = liveEl("button", "live-row-button");
      wrap.type = "button";
      wrap.addEventListener("click", function () {
        onSong(song, item);
      });
    } else {
      wrap = liveEl("div", "live-row-button");
    }
  } else {
    var name = item.name;
    if (item.note) name += "(" + item.note + ")";
    main.appendChild(liveEl("span", "live-row-title", name));
    if (item.detail) main.appendChild(liveEl("span", "live-row-detail", item.detail));
    wrap = liveEl("div", "live-row-button");
  }

  wrap.appendChild(liveEl("span", "live-row-track", item.track));
  wrap.appendChild(main);
  li.appendChild(wrap);
  if (item.src && item.src.length) li.appendChild(sourceLinks(item.src, numbers));
  return li;
}

// 1公演ぶんの中身(説明・曲の一覧・公演中の発表・出典の一覧)を返す。onSong を渡すと、曲の行がタップできる。
function buildLiveSetlistView(setlist, onSong) {
  var root = liveEl("div", "live-setlist-view");

  if (setlist.pending) {
    root.appendChild(liveEl("p", "pending", "準備中です。公演のあと、セットリストが確認でき次第、載せます。"));
    return root;
  }

  var nums = numberSources(setlist);

  if (setlist.intro) {
    var intro = liveEl("p", "live-intro", setlist.intro.text + " ");
    intro.appendChild(sourceLinks(setlist.intro.src, nums.numbers, "live-inline-src"));
    root.appendChild(intro);
  }
  if (setlist.orderNote) root.appendChild(liveEl("p", "live-order-note", setlist.orderNote));

  var list = liveEl("ul", "live-setlist-list");
  (setlist.items || []).forEach(function (item) {
    list.appendChild(buildRow(item, nums.numbers, onSong));
  });
  root.appendChild(list);

  if (setlist.notices && setlist.notices.length) {
    root.appendChild(liveEl("h3", "live-sub-title", "この公演で発表されたこと"));
    var ul = liveEl("ul", "live-notices");
    setlist.notices.forEach(function (n) {
      var li = liveEl("li", "", n.text + " ");
      if (n.note) li.appendChild(liveEl("strong", "", n.note + " "));
      li.appendChild(sourceLinks(n.src, nums.numbers, "live-inline-src"));
      ul.appendChild(li);
    });
    root.appendChild(ul);
  }

  root.appendChild(liveEl("h3", "live-sub-title", "出典"));
  var ol = liveEl("ol", "live-source-list");
  nums.order.forEach(function (k) {
    var src = SETLIST_SOURCES[k];
    var li = liveEl("li");
    var a = liveEl("a", "", src.label);
    a.href = src.url;
    a.target = "_blank";
    a.rel = "noopener";
    li.appendChild(a);
    ol.appendChild(li);
  });
  root.appendChild(ol);
  root.appendChild(liveEl("p", "summary-scope", "出典は、" + setlist.checkedAt + "に確認しました。"));
  return root;
}
