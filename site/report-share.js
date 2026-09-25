// ============================================================
// 「みんなの声」感想フォームの送信後、Xでシェアする機能(P)
//
// - voice-form(感想フォーム)の送信成功時だけに反応する。
//   投票(vote-form)・お問い合わせ・削除依頼などの送信成功では、何もしない。
// - Xへの共有はボタンを押したときだけ行う(自動投稿・自動遷移はしない)。
// - 「Xで感想をシェア」は<a href>ではなく<button>にしてwindow.openで開く
//   (analytics.jsは<a href>の外部リンククリックだけを記録するため、感想の本文を
//   URLごとアクセス解析に渡してしまわないようにするため)。
// - 年代・性別・IPアドレスは、投稿文にも画像にも一切含めない。
// ============================================================

"use strict";

const shareVoiceForm = document.getElementById("voice-form");
const voiceShareBox = document.getElementById("voice-share");

if (shareVoiceForm && voiceShareBox) {
  const SITE_URL = "https://akb-hajimete-guide.netlify.app/report";
  const HASHTAGS = "#AKBサンコンコン #AKBが好きish";
  const SHOW_LABELS = {
    "9/26 12:30 新曲「好きish」コンサート": "9/26(土)昼公演",
    "9/26 18:30 全員「好きish」コンサート": "9/26(土)夜公演",
    "9/27 16:00 推しが「好きish」コンサート": "9/27(日)公演"
  };
  const TWEET_TARGET_LENGTH = 260; // 目安。URLは実際はXが短縮するので、多少の余裕を持たせている

  const previewText = document.getElementById("voice-share-preview");
  const previewLength = document.getElementById("voice-share-length");
  const xButton = document.getElementById("voice-share-x");
  const cardButton = document.getElementById("voice-share-card");
  const cardSection = document.getElementById("voice-card-section");
  const cardCanvas = document.getElementById("voice-card-canvas");
  const cardPreviewImg = document.getElementById("voice-card-preview-img");
  const cardAdjust = document.getElementById("voice-card-adjust");
  const cardAdjustText = document.getElementById("voice-card-text");
  const cardSaveAdjusted = document.getElementById("voice-card-save-adjusted");

  let submitted = null; // { show, place, message }

  function showLabelFor(show) {
    return SHOW_LABELS[show] || show;
  }

  function excerpt(text, budget) {
    if (text.length <= budget) return text;
    return text.slice(0, budget).trimEnd() + "…";
  }

  function buildTweetText(data) {
    const header = "AKB48 THREE CONCEPTS LIVE(" + showLabelFor(data.show) + ")に行きました!\n\n";
    const footer = "\n\n" + HASHTAGS + "\n" + SITE_URL;
    const budget = Math.max(20, TWEET_TARGET_LENGTH - header.length - footer.length - 2);
    return header + "「" + excerpt(data.message, budget) + "」" + footer;
  }

  function syncPreviewLength() {
    previewLength.textContent = String(previewText.value.length);
  }

  // 送信成功時: フォームの値(まだ画面上は隠れているだけで、値は残っている)から、共有用の文面を作る
  shareVoiceForm.addEventListener("ajaxform:success", function () {
    const showInput = shareVoiceForm.querySelector('input[name="show"]:checked');
    const placeInput = shareVoiceForm.querySelector('input[name="style"]:checked');
    const messageField = document.getElementById("message");
    submitted = {
      show: showInput ? showInput.value : "",
      place: placeInput ? placeInput.value : "",
      message: messageField ? messageField.value : ""
    };

    previewText.value = buildTweetText(submitted);
    syncPreviewLength();

    cardSection.hidden = true;
    cardAdjust.hidden = true;
    cardAdjustText.value = "";

    voiceShareBox.hidden = false;
    voiceShareBox.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  previewText.addEventListener("input", syncPreviewLength);

  xButton.addEventListener("click", function () {
    const text = previewText.value;
    const url = "https://x.com/intent/post?text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener");
  });

  // ---- 感想カード(画像) ----

  function cssVar(name, fallback) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // 改行を保ちつつ、1文字ずつ幅を見て折り返す(絵文字も1文字として壊れないよう、for...ofで数える)
  function wrapLines(ctx, text, maxWidth) {
    const paragraphs = text.split(/\r?\n/);
    const lines = [];
    paragraphs.forEach(function (para) {
      if (para === "") {
        lines.push("");
        return;
      }
      let line = "";
      for (const ch of para) {
        const test = line + ch;
        if (line !== "" && ctx.measureText(test).width > maxWidth) {
          lines.push(line);
          line = ch;
        } else {
          line = test;
        }
      }
      lines.push(line);
    });
    return lines;
  }

  // 大きめの文字から少しずつ縮めて、指定した幅・高さに収まる大きさを探す
  function fitText(ctx, text, maxWidth, maxHeight) {
    const maxSize = 52;
    const minSize = 28;
    for (let size = maxSize; size >= minSize; size -= 2) {
      ctx.font = "500 " + size + "px 'Zen Maru Gothic', sans-serif";
      const lineHeight = Math.round(size * 1.55);
      const lines = wrapLines(ctx, text, maxWidth);
      if (lines.length * lineHeight <= maxHeight) {
        return { size: size, lines: lines, lineHeight: lineHeight, fits: true };
      }
    }
    // 最小サイズでも収まらない場合は、入る分だけにして、最後の行を「…」で切る
    ctx.font = "500 " + minSize + "px 'Zen Maru Gothic', sans-serif";
    const lineHeight = Math.round(minSize * 1.55);
    const maxLines = Math.max(1, Math.floor(maxHeight / lineHeight));
    let lines = wrapLines(ctx, text, maxWidth);
    const truncated = lines.length > maxLines;
    if (truncated) {
      lines = lines.slice(0, maxLines);
      let last = lines[maxLines - 1];
      while (last.length > 0 && ctx.measureText(last + "…").width > maxWidth) {
        last = last.slice(0, -1);
      }
      lines[maxLines - 1] = last + "…";
    }
    return { size: minSize, lines: lines, lineHeight: lineHeight, fits: !truncated };
  }

  function drawCard(text) {
    const size = 1080;
    cardCanvas.width = size;
    cardCanvas.height = size;
    const ctx = cardCanvas.getContext("2d");

    const pink = cssVar("--pink", "#ff5c9d");
    const pinkDeep = cssVar("--pink-deep", "#e0337a");
    const pinkLight = cssVar("--pink-light", "#fff0f6");
    const pinkSoft = cssVar("--pink-soft", "#ffd3e6");
    const textColor = cssVar("--text", "#43303a");
    const gray = cssVar("--gray", "#86727c");

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = pinkLight;
    ctx.fillRect(0, 0, size, size);

    const pad = 48;
    roundRect(ctx, pad, pad, size - pad * 2, size - pad * 2, 32);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.setLineDash([6, 8]);
    ctx.lineWidth = 4;
    ctx.strokeStyle = pinkSoft;
    ctx.stroke();
    ctx.setLineDash([]);

    const innerPad = pad + 56;
    ctx.textBaseline = "top";

    ctx.fillStyle = pinkDeep;
    ctx.font = "700 32px 'Zen Maru Gothic', sans-serif";
    ctx.fillText("初めてのAKB48ガイド ・ みんなの声", innerPad, innerPad);

    // バッジ(公演・現地/配信)
    const badgeY = innerPad + 58;
    ctx.font = "700 26px 'Zen Maru Gothic', sans-serif";
    function drawBadge(label, x, background, color) {
      const w = ctx.measureText(label).width + 44;
      roundRect(ctx, x, badgeY, w, 48, 24);
      ctx.fillStyle = background;
      ctx.fill();
      ctx.fillStyle = color;
      ctx.fillText(label, x + 22, badgeY + 11);
      return w;
    }
    let bx = innerPad;
    bx += drawBadge(showLabelFor(submitted.show), bx, pink, "#ffffff") + 12;
    if (submitted.place) drawBadge(submitted.place, bx, "#ffffff", pinkDeep);

    const textTop = badgeY + 90;
    const textAreaWidth = size - innerPad * 2;
    const textAreaHeight = size - pad - 120 - textTop;
    const fit = fitText(ctx, text, textAreaWidth, textAreaHeight);

    ctx.fillStyle = textColor;
    let ty = textTop;
    fit.lines.forEach(function (line) {
      ctx.fillText(line, innerPad, ty);
      ty += fit.lineHeight;
    });

    ctx.font = "500 24px 'Zen Maru Gothic', sans-serif";
    ctx.fillStyle = gray;
    ctx.textBaseline = "bottom";
    ctx.fillText("非公式ファンサイト ・ " + SITE_URL.replace("https://", ""), innerPad, size - pad - 40);

    return fit;
  }

  function saveDataUrl(dataUrl) {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "akb-voice-card.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function renderCardAndSave(text) {
    return document.fonts.ready.then(function () {
      const fit = drawCard(text);
      const dataUrl = cardCanvas.toDataURL("image/png");
      cardPreviewImg.src = dataUrl;
      cardSection.hidden = false;

      if (!fit.fits) {
        cardAdjust.hidden = false;
        if (!cardAdjustText.value) cardAdjustText.value = fit.lines.join("\n");
      } else {
        cardAdjust.hidden = true;
      }

      saveDataUrl(dataUrl);
      return fit;
    });
  }

  cardButton.addEventListener("click", function () {
    if (!submitted) return;
    renderCardAndSave(submitted.message);
  });

  cardSaveAdjusted.addEventListener("click", function () {
    renderCardAndSave(cardAdjustText.value);
  });
}
