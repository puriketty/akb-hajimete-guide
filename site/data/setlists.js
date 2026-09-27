// ============================================================
// セットリスト(公演ごとのデータ)。劇場公演(setlist.html)とライブ(live-setlist.html)の、
// 両方のページで共通に使う。曲そのもののデータは data/songs.js にある。
//
// 新しい公演を追加するときの手順は、Notionの「📝 開発ログ(Claude Codeが書く)」に書いてある。
//
// 【category】"theater"(劇場公演) か "live"(ライブ)。ページの絞り込みに使う。
//
// 【劇場公演の形(そのままシンプルな曲順のリスト)】
// {
//   id: "kokokarada",                 // URLの ?stage= に使う短い英字のID
//   category: "theater",
//   title: "AKB48劇場「ここからだ」公演",
//   officialUrl: "https://...",       // 公式のセットリストページ
//   checkedAt: "2026年9月23日",        // 公式ページを確認した日
//   songIds: [1, 2, 3, ...]           // data/songs.js の id を、歌われた順番に並べる
// }
//
// 【ライブの形(MC・映像なども行として入るので、詳しいitemsを持つ)】
// {
//   id: "three-concepts-0926-hiru",   // URLの ?stage= に使う短い英字のID
//   category: "live",
//   group: "three-concepts-live",     // 同じライブの、公演違いをタブでまとめるための目印
//   tabLabel: "9/26 昼",               // タブに出す短い文字
//   title: "AKB48 THREE CONCEPTS LIVE(2026年9月26日 昼公演)",
//   officialUrl: "",                  // 出典が決まったら入れる(空のうちは、ページ下部に出典を出さない)
//   checkedAt: "2026年9月27日",
//   pending: false,                   // true にすると「準備中です」だけを出す(itemsは無視される)
//   items: [
//     // 曲の行(タップすると、配信サービスを探すシートが開く)
//     { track: "M01", type: "song", songId: 18, detail: "センター：〇〇" },
//     // 曲でない行(MC・映像・影アナなど。タップできない。noteは補足の一言、任意)
//     { track: "—", type: "note", name: "MC1", detail: "工藤華純・橋本恵理子", note: "" }
//   ]
// }
// ============================================================

const SETLISTS = [
  {
    id: "kokokarada",
    category: "theater",
    title: "AKB48劇場「ここからだ」公演",
    officialUrl: "https://www.akb48.co.jp/about/song/list?stage=72",
    checkedAt: "2026年9月23日",
    songIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
  },
  {
    id: "three-concepts-0926-hiru",
    category: "live",
    group: "three-concepts-live",
    tabLabel: "9/26 昼",
    title: "AKB48 THREE CONCEPTS LIVE(2026年9月26日 昼公演/新曲「好きish」コンサート)",
    officialUrl: "",
    checkedAt: "2026年9月27日",
    pending: false,
    items: [
      { track: "—", type: "note", name: "開演前 影アナ", detail: "伊藤百花" },
      { track: "—", type: "note", name: "overture 2.0", detail: "" },
      { track: "M01", type: "song", songId: 18, detail: "センター：伊藤百花／佐藤綺星・八木愛月" },
      { track: "M02", type: "song", songId: 19, detail: "センター：倉野尾成美／小栗有以・山内瑞葵" },
      { track: "M03", type: "song", songId: 20, detail: "センター：秋山由奈／下尾みう・近藤沙樹・新井彩永" },
      { track: "M04", type: "song", songId: 21, detail: "センター：川村結衣／水島美結・長友彩海" },
      { track: "M05", type: "song", songId: 22, detail: "センター：千葉恵里／工藤華純・橋本恵理子" },
      { track: "M06", type: "song", songId: 23, detail: "スクールバック計画" },
      { track: "M07", type: "song", songId: 24, detail: "U-19選抜／センター：森川優" },
      { track: "M08", type: "song", songId: 25, detail: "アンダーガールズ／センター：成田香姫奈" },
      { track: "M09", type: "song", songId: 26, detail: "20期生／センター：大賀彩姫" },
      { track: "M10", type: "song", songId: 27, detail: "選抜／センター：新井彩永" },
      { track: "M11", type: "song", songId: 28, detail: "選抜／センター：橋本恵理子・長友彩海" },
      { track: "M12", type: "song", songId: 29, detail: "当時の選抜＋全員／センター：佐藤綺星" },
      { track: "M13", type: "song", songId: 30, detail: "当時の選抜＋全員／センター：八木愛月" },
      { track: "M14", type: "song", songId: 31, detail: "現在の選抜＋全員／センター：伊藤百花" },
      { track: "—", type: "note", name: "MC1", detail: "工藤華純・橋本恵理子・坂川陽香・新井彩永" },
      { track: "M15", type: "song", songId: 32, detail: "2代目SONE", note: "ZONEのカバー" },
      { track: "M16", type: "song", songId: 33, detail: "グループ1／センター：山内瑞葵・長友彩海" },
      { track: "M17", type: "song", songId: 34, detail: "グループ1／センター：佐藤綺星・川村結衣" },
      { track: "M18", type: "song", songId: 35, detail: "グループ2／センター：八木愛月・新井彩永" },
      { track: "M19", type: "song", songId: 36, detail: "グループ2／センター：小栗有以" },
      { track: "M20", type: "song", songId: 37, detail: "グループ3／センター：伊藤百花" },
      { track: "M21", type: "song", songId: 38, detail: "グループ3／センター：下尾みう" },
      { track: "—", type: "note", name: "映像1：22期生の紹介", detail: "" },
      { track: "M22", type: "song", songId: 39, detail: "22期生(大西ゆな・山内利乃明・前田衣澄・長谷川百々花)" },
      { track: "—", type: "note", name: "MC2", detail: "倉野尾成美・八木愛月・22期生" },
      { track: "M23", type: "song", songId: 40, detail: "全員／掛け声：倉野尾成美" },
      { track: "M24", type: "song", songId: 41, detail: "全員／センター：正鋳真優・山根涼羽" },
      { track: "M25", type: "song", songId: 42, detail: "全員／センター：坂川陽香・徳永羚海" },
      { track: "M26", type: "song", songId: 12, detail: "全員／歌い出し：小栗有以・倉野尾成美・下尾みう・永野芹佳" },
      { track: "M27", type: "song", songId: 43, detail: "全員／歌い出し：秋山由奈・八木愛月" },
      { track: "—", type: "note", name: "MC3", detail: "全員" },
      { track: "M28", type: "song", songId: 44, detail: "全員／センター：伊藤百花" },
      { track: "—", type: "note", name: "ENCORE", detail: "" },
      { track: "En1", type: "song", songId: 45, detail: "選抜／センター：千葉恵里" },
      { track: "En2", type: "song", songId: 46, detail: "選抜／センター：近藤沙樹" },
      { track: "En3", type: "song", songId: 47, detail: "全員　練り歩き" },
      { track: "En4", type: "song", songId: 48, detail: "全員　練り歩き" },
      { track: "—", type: "note", name: "MC4", detail: "今日の感想：佐藤綺星・伊藤百花" },
      { track: "En5", type: "song", songId: 49, detail: "全員／歌い出し：佐藤綺星　センター：伊藤百花" },
      { track: "—", type: "note", name: "終演後 影アナ", detail: "近藤沙樹" }
    ]
  },
  {
    id: "three-concepts-0926-yoru",
    category: "live",
    group: "three-concepts-live",
    tabLabel: "9/26 夜",
    title: "AKB48 THREE CONCEPTS LIVE(2026年9月26日 夜公演)",
    officialUrl: "",
    checkedAt: "",
    pending: true,
    items: []
  },
  {
    id: "three-concepts-0927",
    category: "live",
    group: "three-concepts-live",
    tabLabel: "9/27",
    title: "AKB48 THREE CONCEPTS LIVE(2026年9月27日)",
    officialUrl: "",
    checkedAt: "",
    pending: true,
    items: []
  }
];
