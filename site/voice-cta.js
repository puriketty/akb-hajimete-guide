// ============================================================
// トップページの「感想を送る」バナー(期間限定)
// ライブ当日〜直後だけ、トップの一番上に表示する。
// 受付期間(日本時間): 2026-09-26 12:00 〜 2026-09-30 23:59
// URLの末尾に ?preview=voice を付けると、日付に関係なく表示できる(確認用)。
// お楽しみ投票(vote.js)と同じ、日付で自動的に表示を切り替える仕組み。
// ============================================================

"use strict";

const VOICE_CTA_START = new Date("2026-09-26T12:00:00+09:00");
const VOICE_CTA_END = new Date("2026-09-30T23:59:59+09:00");

const voiceCtaBanner = document.getElementById("voice-cta-banner");

function isVoiceCtaPreview() {
  try {
    return new URLSearchParams(location.search).get("preview") === "voice";
  } catch (e) {
    return false;
  }
}

function renderVoiceCta() {
  if (isVoiceCtaPreview()) {
    voiceCtaBanner.hidden = false;
    return;
  }
  const now = new Date();
  voiceCtaBanner.hidden = !(now >= VOICE_CTA_START && now <= VOICE_CTA_END);
}

renderVoiceCta();
