// ============================================================
// 部割プランナー
// 会いたいメンバーを選ぶと、なるべく別々の部に振り分けて
// 「どの部の参加権利を取ればいいか」を計算します。
// (メンバーのデータは data/events.js にあります)
// ============================================================

"use strict";

// ページの中の部品を、あとで使うために名前をつけて取り出しておく
const eventSelect = document.getElementById("event-select");
const eventInfo = document.getElementById("event-info");
const searchBox = document.getElementById("search");
const chipsBox = document.getElementById("chips");
const resultBox = document.getElementById("result");
const selectedCount = document.getElementById("selected-count");
const clearButton = document.getElementById("clear-button");

// HTMLの部品(タグ)をつくる便利な関数
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function currentEvent() {
  return EVENTS[eventSelect.selectedIndex];
}

// 「1つの部に何人まで」の設定を読み取る
function currentCapacity() {
  return Number(document.querySelector('input[name="capacity"]:checked').value);
}

// いま選ばれているメンバーの名前の一覧
function selectedNames() {
  return Array.from(chipsBox.querySelectorAll("input:checked")).map(function (input) {
    return input.value;
  });
}

// ------------------------------------------------------------
// 振り分けの計算
// names: 選んだメンバー / capacity: 1つの部に入れていい人数
// 戻り値: { assigned: 部ごとのメンバー一覧, unplaced: 入れられなかった人 }
// ------------------------------------------------------------
function assign(names, ev, capacity) {
  const assigned = {};
  ev.parts.forEach(function (part) {
    assigned[part.no] = [];
  });
  const unplaced = [];

  // 1人を、出られる部のどれかに入れる。
  // 部がいっぱいなら、そこにいる人を別の部に動かせないか試す。
  function tryPlace(name, visited) {
    // 人が少ない部を先に試す(できるだけ均等にばらけさせるため)
    const options = ev.members[name].slice().sort(function (a, b) {
      return assigned[a].length - assigned[b].length;
    });
    for (const no of options) {
      if (visited.has(no)) continue;
      visited.add(no);
      if (assigned[no].length < capacity) {
        assigned[no].push(name);
        return true;
      }
      for (const other of assigned[no]) {
        if (tryPlace(other, visited)) {
          assigned[no] = assigned[no].filter(function (n) {
            return n !== other;
          });
          assigned[no].push(name);
          return true;
        }
      }
    }
    return false;
  }

  // 出られる部が少ない人から先に決めると、うまくいきやすい
  const order = names.slice().sort(function (a, b) {
    return ev.members[a].length - ev.members[b].length;
  });
  order.forEach(function (name) {
    if (!tryPlace(name, new Set())) unplaced.push(name);
  });

  return { assigned: assigned, unplaced: unplaced };
}

// 全員を回るには、1つの部に最低何人まで入れる必要があるか
function neededCapacity(names, ev, startFrom) {
  for (let k = startFrom; k <= names.length; k++) {
    if (assign(names, ev, k).unplaced.length === 0) return k;
  }
  return null;
}

// ------------------------------------------------------------
// 画面の表示
// ------------------------------------------------------------
function renderEventInfo() {
  const ev = currentEvent();
  eventInfo.replaceChildren();
  eventInfo.appendChild(el("strong", "", ev.title));
  eventInfo.appendChild(document.createTextNode("(" + ev.status + ")"));
  eventInfo.appendChild(el("br"));
  eventInfo.appendChild(document.createTextNode("部割の確認日: " + ev.checkedAt + " / "));
  const link = el("a", "", "公式のスケジュール(PDF)");
  link.href = ev.source;
  link.target = "_blank";
  link.rel = "noopener";
  eventInfo.appendChild(link);
}

function renderChips() {
  const ev = currentEvent();
  chipsBox.replaceChildren();
  Object.keys(ev.members).forEach(function (name) {
    const label = el("label", "chip");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = name;
    label.appendChild(input);
    label.appendChild(el("span", "", name));
    chipsBox.appendChild(label);
  });
  searchBox.value = "";
}

function render() {
  const names = selectedNames();
  selectedCount.textContent = names.length + "人 選んでいます";
  resultBox.replaceChildren();

  if (names.length === 0) {
    resultBox.appendChild(el("p", "pending", "メンバーを選ぶと、ここにプランが表示されます。"));
    return;
  }

  const ev = currentEvent();
  const capacity = currentCapacity();
  const result = assign(names, ev, capacity);

  // 結果のメッセージ
  if (result.unplaced.length === 0) {
    resultBox.appendChild(
      el("div", "ok-box", "全員に会えるプランができました🎉 下の部の参加権利を取りましょう。")
    );
  } else {
    const box = el("div", "warn-box");
    box.appendChild(
      el(
        "p",
        "",
        "「" + result.unplaced.join("、") + "」は、いまの設定(1部に" + capacity + "人まで)では入れられませんでした。"
      )
    );
    const need = neededCapacity(names, ev, capacity + 1);
    if (need !== null && need <= 3) {
      box.appendChild(el("span", "", "1部に" + need + "人まで入れてよければ、全員に会えます。"));
      box.appendChild(el("br"));
      const button = el("button", "", "1部に" + need + "人までにする");
      button.type = "button";
      button.addEventListener("click", function () {
        document.querySelector('input[name="capacity"][value="' + need + '"]').checked = true;
        render();
      });
      box.appendChild(button);
    } else {
      box.appendChild(el("span", "", "会いたい人数を少し減らしてみてください。"));
    }
    resultBox.appendChild(box);
  }

  // 部ごとのカード
  ev.parts.forEach(function (part) {
    const list = result.assigned[part.no];
    const card = el("div", "result-part" + (list.length ? "" : " empty"));

    const badge = el("div", "part-badge", "第" + part.no + "部");
    badge.appendChild(el("small", "", part.time));
    card.appendChild(badge);

    const body = el("div", "part-body");
    if (list.length) {
      list.forEach(function (name) {
        body.appendChild(el("span", "tag", name));
      });
    } else {
      body.appendChild(el("span", "muted", "この部は使いません"));
    }
    body.appendChild(el("span", "sub", "受付 " + part.reception + "(受付が終わると参加できません)"));
    card.appendChild(body);

    resultBox.appendChild(card);
  });

  // 参考: 選んだメンバーが出る部の一覧
  resultBox.appendChild(el("h3", "", "選んだメンバーが出る部"));
  const table = el("table");
  const head = el("tr");
  head.appendChild(el("th", "", "メンバー"));
  head.appendChild(el("th", "", "出る部(太字が上のプランで使う部)"));
  table.appendChild(head);
  names.forEach(function (name) {
    const row = el("tr");
    row.appendChild(el("td", "", name));
    const cell = el("td");
    const picked = ev.parts.find(function (part) {
      return result.assigned[part.no].indexOf(name) !== -1;
    });
    ev.members[name].forEach(function (no) {
      const isPicked = picked && picked.no === no;
      cell.appendChild(el("span", "mini" + (isPicked ? " picked" : ""), "第" + no + "部"));
    });
    row.appendChild(cell);
    table.appendChild(row);
  });
  resultBox.appendChild(table);
}

// ------------------------------------------------------------
// スタート
// ------------------------------------------------------------
EVENTS.forEach(function (ev) {
  eventSelect.appendChild(el("option", "", ev.title));
});

eventSelect.addEventListener("change", function () {
  renderEventInfo();
  renderChips();
  render();
});

// メンバー名の検索(一致しないメンバーを隠す)
searchBox.addEventListener("input", function () {
  const keyword = searchBox.value.trim();
  chipsBox.querySelectorAll(".chip").forEach(function (chip) {
    chip.hidden = keyword !== "" && chip.textContent.indexOf(keyword) === -1;
  });
});

// メンバーを選んだ / 人数の設定を変えたら、計算しなおす
chipsBox.addEventListener("change", render);
document.querySelectorAll('input[name="capacity"]').forEach(function (radio) {
  radio.addEventListener("change", render);
});

clearButton.addEventListener("click", function () {
  chipsBox.querySelectorAll("input:checked").forEach(function (input) {
    input.checked = false;
  });
  render();
});

renderEventInfo();
renderChips();
render();
