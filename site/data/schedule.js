// ============================================================
// イベントの一覧(直近の予定 と 過去の公演)
//
// ここに書いたイベントが、次の場所に自動で並びます。
//   - トップ・ライブ・握手会の「直近の予定」(これから開催されるもの)
//   - 「過去の公演」(past.html。開催が終わったもの)
//   - 各ガイドのページの上の「開催終了」の帯と、終了後に隠す「販売中」などの表示
//
// 【方針】終わったイベントは、消さずに残します(過去の公演として、当時の情報につなげる)。
//
// 【終了の決まり方】(schedule.js が、見た人のパソコンやスマホの時計で判断します)
//   1. ended: true を書くと、すぐに「開催終了」になる(手で終わらせるとき)
//   2. endsAt(終了の日時)があれば、その日時を過ぎたら終了
//   3. lastDay(最終日)があれば、その日が終わったら(翌日0時を過ぎたら)終了
//   4. どれもなければ、自動では終了にしない(開始の時刻を過ぎただけでは、終わったことにしない)
//   ※ 公式に終了時刻が出ていないイベントは、3 の lastDay を使う。
//   ※ まだ開催されていないイベントを、動作確認のために ended: true にしない。
//
// 【形】
// {
//   id: "英数字のID(ページの data-event-status / data-active-only / data-ended-only と同じにする)",
//   kind: "live" / "handshake" / "theater",
//   title: "名前",
//   dateLabel: "2026年9月26日(土)・27日(日)",   // 表示用の日付
//   start: "2026-09-26",                          // 開始日(並べ替えと「開催中」の判定に使う)
//   lastDay: "2026-09-27",                        // 最終日(終了の判定に使う)
//   endsAt: "2026-09-27T21:00:00+09:00",          // 終了の日時がわかるときだけ(任意)
//   ended: true,                                  // 手で終わらせるときだけ(任意)
//   venue: "会場",
//   summary: "ひとことの説明(当時の概要)",
//   guide: { label: "ガイドを見る", href: "live.html#three" },   // 当時のガイド
//   setlist: { href: "live.html#setlist", published: false },    // セットリスト(ライブだけ)
//   voices: { href: "report.html#voices" },                      // 感想(あれば)
//   extra: [ { label: "当日の変更", href: "national.html#change" } ],   // このサイト内の関連リンク
//   official: [ { label: "公式の案内", url: "https://..." } ]          // 公式リンク
// }
//
// 【更新の手順】
//   新しいイベントが公式に発表されたら、下に足す。終わったら、消さずに、そのままにする
//   (終了は自動で判定される)。セットリストを載せたら published: true にする。
// ============================================================

const SCHEDULE = [
  {
    id: "three-concepts-live",
    kind: "live",
    title: "AKB48 THREE CONCEPTS LIVE",
    dateLabel: "2026年9月26日(土)・27日(日)",
    start: "2026-09-26",
    lastDay: "2026-09-27",
    endsAt: "2026-09-27T22:00:00+09:00", // 終演時刻は未発表。9/27の最終公演(16:00開演)が、この時刻までには終わっている想定の目安(ページには表示しない、内部の切り替え用)
    venue: "Kアリーナ横浜",
    summary: "3つのコンセプトの全3公演(9/26 12:30・9/26 18:30・9/27 16:00)。",
    guide: { label: "公演の概要・チケット・入場のルール", href: "live.html#three" },
    extra: [
      { label: "会場ガイド(Kアリーナ横浜の行き方・宿泊)", href: "venues.html#k-arena" },
      { label: "初参加者の声まとめ", href: "report.html#first" }
    ],
    setlist: { href: "live.html#setlist", published: false },
    voices: { href: "report.html#voices" },
    official: [
      { label: "特設ページ(公式)", url: "https://www.akb48.co.jp/lp/akb3concon/" },
      { label: "開催のお知らせ(公式)", url: "https://www.akb48.co.jp/news/detailpage/459093448" }
    ]
  },
  {
    id: "tokyo-national-handshake",
    kind: "handshake",
    title: "東京握手会(初回限定盤の握手会)",
    dateLabel: "2026年10月4日(日)",
    start: "2026-10-04",
    lastDay: "2026-10-04",
    venue: "幕張メッセ 展示ホール1・2",
    summary: "ライブパフォーマンスのあとに、グループ握手会とまとめ出し個別握手会があります。",
    guide: { label: "東京握手会の予定", href: "national.html#tokyo" },
    extra: [{ label: "会場ガイド(幕張メッセの行き方・宿泊)", href: "venues.html#makuhari" }],
    official: [
      { label: "東京握手会のご案内(公式)", url: "https://www.universal-music.co.jp/akb48/news/2026-08-14-5/" },
      { label: "初回限定盤の握手会の案内(公式)", url: "https://www.akb48.co.jp/lp/68th-single/event_limited-edition.html" }
    ]
  },
  {
    id: "fukuoka-national-handshake",
    kind: "handshake",
    title: "福岡握手会(初回限定盤の握手会)",
    dateLabel: "2026年9月21日(月・祝)",
    start: "2026-09-21",
    lastDay: "2026-09-21",
    venue: "福岡国際会議場 多目的ホール",
    summary: "当日、台風の影響で、まとめ出し個別握手会が第1部・第2部の2回に変更されました。",
    guide: { label: "福岡握手会の1日(例)", href: "national.html#day" },
    extra: [{ label: "当日の変更の内容", href: "national.html#change" }],
    official: [
      { label: "福岡握手会 詳細のご案内(公式)", url: "https://www.universal-music.co.jp/akb48/news/2026-09-18/" },
      { label: "福岡握手会 変更のお知らせ(公式ブログ)", url: "https://ameblo.jp/akihabara48/entry-12979336560.html" }
    ]
  },
  {
    id: "kobetsu-68th",
    kind: "handshake",
    title: "68thシングル Official Shop盤 個別握手会(全7日程)",
    dateLabel: "2026年6月20日(土)〜9月13日(日)",
    start: "2026-06-20",
    lastDay: "2026-09-13",
    venue: "有明GYM-EX / パシフィコ横浜 / 幕張メッセ / インテックス大阪",
    summary: "6月20・21日 有明、8月1・2日 パシフィコ横浜、9月5・6日 幕張メッセ、9月13日 インテックス大阪(公式の案内より)。",
    guide: { label: "個別握手会ガイド", href: "handshake.html" },
    extra: [
      { label: "部割プランナー(9/5幕張の部割で試せます)", href: "planner.html" },
      { label: "申し込みの流れ(68thの例)", href: "apply.html#kobetsu" }
    ],
    official: [
      { label: "個別握手会の案内(公式)", url: "https://www.akb48.co.jp/lp/68th-single/os_offline_index.html" }
    ]
  }
];
