// ============================================================
// 「劇場公演のセットリスト」の表示
// データは data/songs.js(曲)・data/setlists.js(公演)にある。
// URLの ?stage= で、公演を切り替える(例: setlist.html?stage=kokokarada)。省略時は、最初の公演。
//
// 曲をタップすると、画面下からパネル(ボトムシート)が1枚だけ出る。
// 中に、曲名・作詞作曲・配信サービスで探すボタン・公式の公演ページへのリンクがある。
// 配信サービスのボタンは、曲名から検索URLを自動で組み立てる(直リンクがあれば、そちらを優先する)。
// 歌詞は載せない。音源の埋め込みもしない。
// ============================================================

"use strict";

const songsById = {};
SONGS.forEach(function (s) {
  songsById[s.id] = s;
});

function findSetlist(stageId) {
  return SETLISTS.filter(function (s) {
    return s.id === stageId;
  })[0];
}

function currentStageId() {
  try {
    const value = new URLSearchParams(location.search).get("stage");
    if (value && findSetlist(value)) return value;
  } catch (e) {
    // URLSearchParamsが使えない環境でも、動作は止めない
  }
  return SETLISTS[0] ? SETLISTS[0].id : null;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// 配信サービスの検索URLを組み立てる(曲名 + "AKB48")
function searchQuery(song) {
  const term = (song.searchTerm && song.searchTerm.trim()) || song.title;
  return term + " AKB48";
}

function appleMusicUrl(song) {
  if (song.links && song.links.apple) return song.links.apple;
  return "https://music.apple.com/jp/search?term=" + encodeURIComponent(searchQuery(song));
}

function spotifyUrl(song) {
  if (song.links && song.links.spotify) return song.links.spotify;
  return "https://open.spotify.com/search/" + encodeURIComponent(searchQuery(song));
}

function youtubeMusicUrl(song) {
  if (song.links && song.links.youtube) return song.links.youtube;
  return "https://music.youtube.com/search?q=" + encodeURIComponent(searchQuery(song));
}

const titleBox = document.getElementById("setlist-title");
const listBox = document.getElementById("setlist-songs");
const sourceBox = document.getElementById("setlist-source");

const overlay = document.getElementById("song-sheet-overlay");
const sheet = document.getElementById("song-sheet");
const sheetTitle = document.getElementById("song-sheet-title");
const sheetCredit = document.getElementById("song-sheet-credit");
const sheetApple = document.getElementById("song-sheet-apple");
const sheetSpotify = document.getElementById("song-sheet-spotify");
const sheetYoutube = document.getElementById("song-sheet-youtube");
const sheetOfficial = document.getElementById("song-sheet-official");
const sheetCloseButton = document.getElementById("song-sheet-close");

let activeSetlist = null;

function openSheet(song) {
  sheetTitle.textContent = song.title;
  const credit = [song.lyricist ? "作詞: " + song.lyricist : "", song.composer ? "作曲: " + song.composer : ""]
    .filter(function (s) {
      return s;
    })
    .join(" / ");
  sheetCredit.textContent = credit;
  sheetCredit.hidden = credit === "";
  sheetApple.href = appleMusicUrl(song);
  sheetSpotify.href = spotifyUrl(song);
  sheetYoutube.href = youtubeMusicUrl(song);
  if (activeSetlist) sheetOfficial.href = activeSetlist.officialUrl;

  overlay.hidden = false;
  sheet.hidden = false;
  sheet.setAttribute("aria-hidden", "false");
  document.body.classList.add("sheet-open");
}

function closeSheet() {
  overlay.hidden = true;
  sheet.hidden = true;
  sheet.setAttribute("aria-hidden", "true");
  document.body.classList.remove("sheet-open");
}

overlay.addEventListener("click", closeSheet);
sheetCloseButton.addEventListener("click", closeSheet);
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !sheet.hidden) closeSheet();
});

// 下にスワイプすると閉じる(スマホ向け)
let touchStartY = null;
sheet.addEventListener("touchstart", function (e) {
  touchStartY = e.touches[0].clientY;
});
sheet.addEventListener("touchend", function (e) {
  if (touchStartY === null) return;
  const deltaY = e.changedTouches[0].clientY - touchStartY;
  touchStartY = null;
  if (deltaY > 60) closeSheet();
});

function renderSongRow(song, index) {
  const li = el("li", "setlist-row");
  const button = el("button");
  button.type = "button";
  button.appendChild(el("span", "setlist-track", String(index + 1).padStart(2, "0")));
  button.appendChild(el("span", "setlist-song-title", song.title));
  button.addEventListener("click", function () {
    openSheet(song);
  });
  li.appendChild(button);
  return li;
}

function render() {
  const stageId = currentStageId();
  const setlist = findSetlist(stageId);
  if (!setlist) {
    titleBox.textContent = "セットリストが見つかりませんでした";
    return;
  }
  activeSetlist = setlist;

  titleBox.textContent = setlist.title;

  listBox.replaceChildren();
  setlist.songIds.forEach(function (songId, index) {
    const song = songsById[songId];
    if (!song) return;
    listBox.appendChild(renderSongRow(song, index));
  });

  sourceBox.replaceChildren();
  const link = el("a", "", "公式のセットリストページ");
  link.href = setlist.officialUrl;
  link.target = "_blank";
  link.rel = "noopener";
  sourceBox.appendChild(document.createTextNode("出典: "));
  sourceBox.appendChild(link);
  sourceBox.appendChild(document.createTextNode("(" + setlist.checkedAt + " 確認)"));
}

render();
