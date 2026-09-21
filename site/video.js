// ============================================================
// 公式映像: 再生ボタンを押したときだけ、YouTube(プライバシー強化モード)を読み込みます。
// 押すまでは、YouTube には接続しません。
// ============================================================

"use strict";

document.querySelectorAll(".video").forEach(function (box) {
  const button = box.querySelector(".video-play");
  const id = box.dataset.id || "";
  // 動画IDは、英数字と - _ の11文字だけを受け付ける
  if (!button || !/^[A-Za-z0-9_-]{11}$/.test(id)) return;

  button.addEventListener("click", function () {
    const iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
    iframe.title = box.dataset.title || "公式映像";
    iframe.allow = "autoplay; encrypted-media; picture-in-picture";
    iframe.allowFullscreen = true;
    box.replaceChildren(iframe);
    box.classList.add("playing");
  });
});