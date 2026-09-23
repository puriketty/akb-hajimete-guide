// ============================================================
// フォームの送信を、ページ遷移なしで行う(Netlify Forms・AJAX送信)。
// このサイトの全フォーム(みんなの声・お楽しみ投票・お問い合わせ・ペンライトの訂正・削除のお願い)で共通に使う。
//
// やっていること:
//  1. 送信ボタンを押した瞬間に「送信中…」にして、二重送信を防ぐ。
//  2. 必須項目が空のときは、ブラウザ標準の注意書き(スマホだと画面外に出て気づけないことがある)の代わりに、
//     その項目までスクロールして、日本語で「入力してください」と表示する。
//  3. 成功したら、ページ遷移せずに、フォームの場所に大きく「送信ありがとうございました」を出す。
//  4. 失敗したら「送信できませんでした。時間をおいてもう一度お試しください」と出す(黙って終わらせない)。
//  5. ものすごく短い時間(1.5秒未満)で送信された場合は、機械的な送信の可能性が高いため、
//     人が読んでいる時間を置いてから、もう一度お試しくださいと伝える(reCAPTCHAは使わない、簡易な対策)。
//
// フォーム側の決まり:
//  - <form> に data-netlify="true" があるものを、自動でこの仕組みの対象にする。
//  - 送信ボタンは、フォーム内の button[type="submit"] とする。
//  - 送信に成功したとき・失敗したときに、ほかのスクリプト(vote.js など)が追加の処理をしたい場合は、
//    フォーム要素で "ajaxform:success" / "ajaxform:error" イベントを購読する。
// ============================================================

"use strict";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// ラジオ・チェックボックスのグループは、個々の選択肢のラベルではなく、
// グループ全体の見出し(role="radiogroup" の aria-labelledby)を優先して使う
function groupLabel(field) {
  const group = field.closest('[role="radiogroup"]') || field.closest(".field");
  if (!group) return null;
  const labelledBy = group.getAttribute("aria-labelledby");
  if (labelledBy) {
    const node = document.getElementById(labelledBy);
    if (node) return node.textContent.trim();
  }
  return null;
}

function fieldLabel(field) {
  if (field.type === "radio" || field.type === "checkbox") {
    const label = groupLabel(field);
    if (label) return label;
  }
  if (field.labels && field.labels.length > 0) return field.labels[0].textContent.trim();
  const labelledBy = field.getAttribute("aria-labelledby");
  if (labelledBy) {
    const node = document.getElementById(labelledBy);
    if (node) return node.textContent.trim();
  }
  return "この項目";
}

function showFieldError(field) {
  clearFieldError(field);
  let message;
  if (field.type === "email" && field.validity.typeMismatch) {
    message = "メールアドレスの形式で入力してください。";
  } else if (field.type === "radio" || field.type === "checkbox") {
    message = fieldLabel(field) + "を選んでください。";
  } else {
    message = fieldLabel(field) + "を入力してください。";
  }
  const error = el("p", "field-error", message);
  error.setAttribute("role", "alert");
  // ラジオ・チェックボックスは、グループ(.checks や .field)のうしろに出す
  const group = field.closest(".field") || field.parentNode;
  group.appendChild(error);
  field.setAttribute("aria-invalid", "true");
}

function clearFieldError(field) {
  const group = field.closest(".field") || field.parentNode;
  const existing = group.querySelector(".field-error");
  if (existing) existing.remove();
  field.removeAttribute("aria-invalid");
}

function firstInvalidField(form) {
  const fields = form.querySelectorAll("input, textarea, select");
  for (const field of fields) {
    if (field.name === "bot-field") continue;
    if (typeof field.checkValidity === "function" && !field.checkValidity()) return field;
  }
  return null;
}

function setupForm(form) {
  const submitButton = form.querySelector('button[type="submit"]');
  if (!submitButton) return;
  const originalLabel = submitButton.textContent;
  const loadedAt = Date.now();

  form.setAttribute("novalidate", "novalidate");

  const successBox = el("div", "form-result form-success");
  successBox.setAttribute("role", "status");
  successBox.hidden = true;
  successBox.appendChild(el("p", "form-result-title", "送信ありがとうございました"));

  const errorBox = el("div", "form-result form-error");
  errorBox.setAttribute("role", "alert");
  errorBox.hidden = true;
  errorBox.appendChild(el("p", "", "送信できませんでした。時間をおいてもう一度お試しください。"));

  form.insertAdjacentElement("afterend", errorBox);
  form.insertAdjacentElement("afterend", successBox);

  form.querySelectorAll("input, textarea, select").forEach(function (field) {
    field.addEventListener("input", function () {
      clearFieldError(field);
    });
    field.addEventListener("change", function () {
      clearFieldError(field);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    errorBox.hidden = true;

    // 短すぎる時間での送信は、機械的な送信の可能性が高い(reCAPTCHAを使わない、簡易な対策)
    if (Date.now() - loadedAt < 1500) {
      errorBox.querySelector("p").textContent = "少し時間をおいてから、もう一度お試しください。";
      errorBox.hidden = false;
      errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const invalid = firstInvalidField(form);
    if (invalid) {
      showFieldError(invalid);
      invalid.scrollIntoView({ behavior: "smooth", block: "center" });
      if (typeof invalid.focus === "function") invalid.focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "送信中…";

    const body = new URLSearchParams(new FormData(form)).toString();

    fetch(form.getAttribute("action") || location.pathname, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body
    })
      .then(function (res) {
        if (!res.ok) throw new Error("status " + res.status);
        form.hidden = true;
        successBox.hidden = false;
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
        form.dispatchEvent(new CustomEvent("ajaxform:success"));
      })
      .catch(function () {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel;
        errorBox.querySelector("p").textContent = "送信できませんでした。時間をおいてもう一度お試しください。";
        errorBox.hidden = false;
        errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
        form.dispatchEvent(new CustomEvent("ajaxform:error"));
      });
  });
}

document.querySelectorAll('form[data-netlify="true"]').forEach(setupForm);
