// ============================================================
// GA4(Googleアナリティクス)を使うための「場所」だけ、用意してあります。
//
// 【いまの状態】収益化(広告・アフィリエイト)は、まだ始めていません。
// 下の GA_MEASUREMENT_ID が空("")のあいだは、このファイルは何もしません。
// Googleへの通信は、1つも発生しません。
//
// 【測定IDを入れるとき】(将来、ぱちゃがGA4のアカウントを作ってから)
// 1. Google が発行する測定ID("G-" で始まる文字列)を、GA_MEASUREMENT_ID に入れる
//    (アカウントの作成・測定IDの発行は、ぱちゃ本人が行う。Claude はアカウント作成をしない)
// 2. 入れたら、このページを開いたときと、外部サイトへのリンクを押したときの記録が、
//    GA4(Google)に送られるようになる。
// 3. about.html の「個人情報とアクセスについて」の記載も、実際に送られる内容と合わせて見直す。
//
// 【何を記録するか(測定IDを入れたあと)】
// - ページを開いたこと(GA4の標準の機能)
// - 外部サイト(このサイト以外)へのリンクを押したこと(outbound_click)。
//   将来、どのページで「宿・交通・持ち物」などの需要があるかを見るために使う。
//   個人を特定できる情報(名前・メールなど)は、送らない。
// ============================================================

"use strict";

const GA_MEASUREMENT_ID = ""; // 例: "G-XXXXXXXXXX"(いまは空 = 無効)

if (GA_MEASUREMENT_ID) {
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);

  // 外部サイトへのリンクを押したときだけ、記録する(このサイトの中のリンクは送らない)
  document.addEventListener("click", function (event) {
    const link = event.target.closest("a[href]");
    if (!link) return;
    let url;
    try {
      url = new URL(link.getAttribute("href"), location.href);
    } catch (e) {
      return;
    }
    if (url.origin === location.origin) return;
    gtag("event", "outbound_click", {
      link_url: url.href,
      link_domain: url.hostname,
      page_path: location.pathname
    });
  });
}
