// ============================================================
// GA4(Googleアナリティクス)の計測タグ。
// 全ページ共通のこのファイルを、各ページの <head> の早い位置で読み込む
// (Google推奨の「gtag.jsは、できるだけ<head>の上のほうで読み込む」に合わせている)。
//
// 【いまの状態(2026-09-22〜)】測定ID(G-LL6VEFNVP8。ぱちゃがGA4で発行したもの)を設定し、有効にした。
// ページを開くたびに、Googleへ計測の通信が送られる。
// GA_MEASUREMENT_ID を空("")に戻すと、このファイルは何もせず、Googleへの通信も発生しなくなる。
//
// 【何を記録しているか】
// - ページを開いたこと(GA4の標準の機能。ページ内容そのものは送らない)
// - 外部サイト(このサイト以外)へのリンクを押したこと(outbound_click)。
//   どのページで「宿・交通・持ち物」などの需要があるかを見るために使う。
//   個人を特定できる情報(名前・メールなど)は、送らない。
// - about.html の「個人情報とアクセスについて」に、この内容を明記してある。測定の記録先を変えるときは、
//   両方を合わせて直す。
// ============================================================

"use strict";

const GA_MEASUREMENT_ID = "G-LL6VEFNVP8"; // 2026-09-22 に、ぱちゃが発行した測定IDを設定(有効)

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
