// ============================================================
// 予定と過去の公演の表示
// イベントのデータは data/schedule.js にあります(終了の決まり方も、そこに書いてあります)。
//
// このファイルがすること:
//  1. [data-schedule="upcoming"] に、これから開催されるイベントを並べる(data-kind で、種類の絞り込みもできる)
//  2. [data-schedule="past"] に、開催が終わったイベントを、新しい順に並べる
//  3. [data-event-status="ID"] に、開催終了・開催中の帯を出す
//  4. [data-active-only="ID"] は、終了したら隠す(「販売中」の表示や、購入リンクなど)
//     [data-ended-only="ID"] は、終了したら出す(hidden で始めておく)
// (JavaScript が動かないときは、ページに書いてある内容が、そのまま見えます)
// ============================================================

"use strict";

const KIND_LABELS = { live: "ライブ", handshake: "握手会", theater: "劇場公演" };

// 日本時間の日付と時刻から、ミリ秒を作る
function jstMs(day, time) {
  return Date.parse(day + "T" + time + "+09:00");
}

// イベントの状態: "ended"(開催終了) / "ongoing"(開催中) / "upcoming"(開催予定) / "started"(開始後。終了日時は未確認)
function statusOf(ev, now) {
  if (ev.ended === true) return "ended";

  let end = null;
  if (ev.endsAt) end = Date.parse(ev.endsAt);
  else if (ev.lastDay) end = jstMs(ev.lastDay, "23:59:59");
  const hasEnd = end !== null && !isNaN(end);
  if (hasEnd && now > end) return "ended";

  const started = ev.start ? jstMs(ev.start, "00:00:00") <= now : false;
  if (!started) return "upcoming";
  // 終了の日時がわからないイベントは、始まったあとも、自動では終了にしない
  return hasEnd ? "ongoing" : "started";
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function link(label, href, external) {
  const a = el("a", "", label);
  a.href = href;
  if (external) {
    a.target = "_blank";
    a.rel = "noopener";
  }
  return a;
}

function statusBadge(status) {
  if (status === "ended") return el("span", "badge ended", "開催終了");
  if (status === "ongoing") return el("span", "badge ongoing", "開催中");
  if (status === "started") return el("span", "badge ongoing", "開催中または終了(終了日時は未確認)");
  return null;
}

// ---- これから開催されるイベントの一覧 ----
function renderUpcoming(box, now) {
  const kinds = box.dataset.kind ? box.dataset.kind.split(",") : null;
  const list = SCHEDULE.filter(function (ev) {
    return statusOf(ev, now) !== "ended" && (!kinds || kinds.indexOf(ev.kind) >= 0);
  }).sort(function (a, b) {
    return a.start < b.start ? -1 : a.start > b.start ? 1 : 0;
  });

  box.replaceChildren();
  if (list.length === 0) {
    const p = el("p", "pending", "いま、このサイトに載せている予定はありません。最新の予定は、");
    p.appendChild(link("公式のスケジュール", "https://www.akb48.co.jp/about/schedule/", true));
    p.appendChild(document.createTextNode("で確認してください。"));
    box.appendChild(p);
    return;
  }

  const ul = el("ul", "event-list");
  list.forEach(function (ev) {
    const li = el("li", "event-item");
    li.appendChild(el("span", "event-date", ev.dateLabel));
    const body = el("div", "event-body");
    const head = el("p", "event-title");
    head.appendChild(link(ev.title, ev.guide.href));
    body.appendChild(head);
    const meta = el("p", "event-meta");
    meta.appendChild(el("span", "badge kind", KIND_LABELS[ev.kind] || ""));
    const badge = statusBadge(statusOf(ev, now));
    if (badge) meta.appendChild(badge);
    meta.appendChild(document.createTextNode(" " + ev.venue));
    body.appendChild(meta);
    li.appendChild(body);
    ul.appendChild(li);
  });
  box.appendChild(ul);
}

// ---- 過去の公演の一覧 ----
function renderPast(box, now) {
  const list = SCHEDULE.filter(function (ev) {
    return statusOf(ev, now) === "ended";
  }).sort(function (a, b) {
    return a.start < b.start ? 1 : a.start > b.start ? -1 : 0;
  });

  box.replaceChildren();
  if (list.length === 0) {
    box.appendChild(el("p", "pending", "まだ、開催が終わったイベントはありません。終わったものは、ここに載ります。"));
    return;
  }

  list.forEach(function (ev) {
    const card = el("div", "event-card");
    const head = el("h3", "");
    head.appendChild(document.createTextNode(ev.title + " "));
    head.appendChild(el("span", "badge ended", "開催終了"));
    card.appendChild(head);
    const meta = el("p", "event-meta");
    meta.appendChild(el("span", "badge kind", KIND_LABELS[ev.kind] || ""));
    meta.appendChild(document.createTextNode(" " + ev.dateLabel + " / " + ev.venue));
    card.appendChild(meta);
    if (ev.summary) card.appendChild(el("p", "event-summary", ev.summary));

    const links = el("ul", "event-links");
    function add(label, href, external) {
      const li = el("li");
      li.appendChild(link(label, href, external));
      links.appendChild(li);
    }
    add("当時のガイド: " + ev.guide.label, ev.guide.href);
    (ev.extra || []).forEach(function (x) {
      add(x.label, x.href);
    });
    if (ev.setlist) {
      const li = el("li");
      li.appendChild(link("セットリスト", ev.setlist.href));
      li.appendChild(
        document.createTextNode(ev.setlist.published ? "(掲載しています)" : "(まだ載せていません。確かな情報で確認できたら載せます)")
      );
      links.appendChild(li);
    }
    if (ev.voices) add("行った人の感想(みんなの声)", ev.voices.href);
    (ev.official || []).forEach(function (x) {
      add(x.label, x.url, true);
    });
    card.appendChild(links);
    box.appendChild(card);
  });
}

// ---- ページの上の帯 ----
function renderBanner(box, ev, status) {
  box.replaceChildren();
  if (status === "ended") {
    const div = el("div", "notice ended-notice");
    div.appendChild(el("strong", "", "開催終了: "));
    div.appendChild(
      document.createTextNode(
        "「" + ev.title + "」(" + ev.dateLabel + ")は、終了しました。このページの内容は、当時の情報です。参加の申し込みや、チケットの購入は、できません(配信の見逃しなど、終了後も続くものは、それぞれの公式の案内を確認してください)。 "
      )
    );
    div.appendChild(link("過去の公演の一覧を見る", "past.html"));
    box.appendChild(div);
  } else if (status === "ongoing" || status === "started") {
    const div = el("div", "notice");
    div.appendChild(el("strong", "", "開催中: "));
    div.appendChild(document.createTextNode("「" + ev.title + "」(" + ev.dateLabel + ")は、開催期間中です。最新の情報は、公式の案内を確認してください。"));
    box.appendChild(div);
  }
}

// ---- ページ全体に反映する ----
function applySchedule(now) {
  const byId = {};
  SCHEDULE.forEach(function (ev) {
    byId[ev.id] = ev;
  });

  document.querySelectorAll('[data-schedule="upcoming"]').forEach(function (box) {
    renderUpcoming(box, now);
  });
  document.querySelectorAll('[data-schedule="past"]').forEach(function (box) {
    renderPast(box, now);
  });
  document.querySelectorAll("[data-event-status]").forEach(function (box) {
    const ev = byId[box.dataset.eventStatus];
    if (ev) renderBanner(box, ev, statusOf(ev, now));
  });
  document.querySelectorAll("[data-active-only]").forEach(function (node) {
    const ev = byId[node.dataset.activeOnly];
    node.hidden = ev ? statusOf(ev, now) === "ended" : false;
  });
  document.querySelectorAll("[data-ended-only]").forEach(function (node) {
    const ev = byId[node.dataset.endedOnly];
    node.hidden = ev ? statusOf(ev, now) !== "ended" : true;
  });
}

applySchedule(Date.now());
