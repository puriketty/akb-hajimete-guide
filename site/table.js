// ============================================================
// 表の見出しを、各セルに「ラベル」として付けます。
// スマホの幅では、この情報を使って、表を「カード」の形に組み替えます
// (style.css の table.stack)。パソコンでは、今までどおりの表です。
// ============================================================

"use strict";

document.querySelectorAll("main table").forEach(function (table) {
  const rows = table.rows;
  if (rows.length < 2) return;

  // 1行目が、すべて見出し(th)の表だけを対象にする
  const heads = Array.from(rows[0].cells);
  if (!heads.every(function (cell) { return cell.tagName === "TH"; })) return;

  const labels = heads.map(function (cell) {
    return cell.textContent.trim();
  });

  // 時刻だけのセル(例: 15:45〜)は、途中で折り返さないようにする(style.css の td.nowrap)
  table.querySelectorAll("td").forEach(function (cell) {
    if (/^[0-9:〜~\s]+$/.test(cell.textContent.trim())) cell.classList.add("nowrap");
  });

  for (let i = 1; i < rows.length; i++) {
    Array.from(rows[i].cells).forEach(function (cell, index) {
      if (labels[index]) cell.setAttribute("data-label", labels[index]);
    });
  }
  table.classList.add("stack");
});
