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
//     // 曲の行(タップすると、配信サービスを探すシートが開く)。
//     // 一覧には center だけを出し(スマホで読めるように)、歌唱メンバー全員(detail)はシートの中に出す。
//     { track: "M01", type: "song", songId: 18, center: "センター：〇〇", detail: "センター：〇〇／△△・□□" },
//     // 曲でない行(MC・映像・影アナなど。タップできない。noteは補足の一言、任意)
//     { track: "—", type: "note", name: "MC1", detail: "工藤華純・橋本恵理子" }
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
      { track: "M01", type: "song", songId: 18, center: "センター：伊藤百花", detail: "センター：伊藤百花／佐藤綺星・八木愛月" },
      { track: "M02", type: "song", songId: 19, center: "センター：倉野尾成美", detail: "センター：倉野尾成美／小栗有以・山内瑞葵" },
      { track: "M03", type: "song", songId: 20, center: "センター：秋山由奈", detail: "センター：秋山由奈／下尾みう・近藤沙樹・新井彩永" },
      { track: "M04", type: "song", songId: 21, center: "センター：川村結衣", detail: "センター：川村結衣／水島美結・長友彩海" },
      { track: "M05", type: "song", songId: 22, center: "センター：千葉恵里", detail: "センター：千葉恵里／工藤華純・橋本恵理子" },
      { track: "M06", type: "song", songId: 23, center: "スクールバック計画", detail: "スクールバック計画" },
      { track: "M07", type: "song", songId: 24, center: "センター：森川優", detail: "U-19選抜／センター：森川優" },
      { track: "M08", type: "song", songId: 25, center: "センター：成田香姫奈", detail: "アンダーガールズ／センター：成田香姫奈" },
      { track: "M09", type: "song", songId: 26, center: "センター：大賀彩姫", detail: "20期生／センター：大賀彩姫" },
      { track: "M10", type: "song", songId: 27, center: "センター：新井彩永", detail: "選抜／センター：新井彩永" },
      { track: "M11", type: "song", songId: 28, center: "センター：橋本恵理子・長友彩海", detail: "選抜／センター：橋本恵理子・長友彩海" },
      { track: "M12", type: "song", songId: 29, center: "センター：佐藤綺星", detail: "当時の選抜＋全員／センター：佐藤綺星" },
      { track: "M13", type: "song", songId: 30, center: "センター：八木愛月", detail: "当時の選抜＋全員／センター：八木愛月" },
      { track: "M14", type: "song", songId: 31, center: "センター：伊藤百花", detail: "現在の選抜＋全員／センター：伊藤百花" },
      { track: "—", type: "note", name: "MC1", detail: "工藤華純・橋本恵理子・坂川陽香・新井彩永" },
      { track: "M15", type: "song", songId: 32, center: "2代目SONE", detail: "2代目SONE", note: "ZONEのカバー" },
      { track: "M16", type: "song", songId: 33, center: "センター：山内瑞葵・長友彩海", detail: "グループ1／センター：山内瑞葵・長友彩海" },
      { track: "M17", type: "song", songId: 34, center: "センター：佐藤綺星・川村結衣", detail: "グループ1／センター：佐藤綺星・川村結衣" },
      { track: "M18", type: "song", songId: 35, center: "センター：八木愛月・新井彩永", detail: "グループ2／センター：八木愛月・新井彩永" },
      { track: "M19", type: "song", songId: 36, center: "センター：小栗有以", detail: "グループ2／センター：小栗有以" },
      { track: "M20", type: "song", songId: 37, center: "センター：伊藤百花", detail: "グループ3／センター：伊藤百花" },
      { track: "M21", type: "song", songId: 38, center: "センター：下尾みう", detail: "グループ3／センター：下尾みう" },
      { track: "—", type: "note", name: "映像1：22期生の紹介", detail: "" },
      { track: "M22", type: "song", songId: 39, center: "22期生", detail: "22期生(大西ゆな・山内利乃明・前田衣澄・長谷川百々花)" },
      { track: "—", type: "note", name: "MC2", detail: "倉野尾成美・八木愛月・22期生" },
      { track: "M23", type: "song", songId: 40, center: "全員", detail: "全員／掛け声：倉野尾成美" },
      { track: "M24", type: "song", songId: 41, center: "センター：正鋳真優・山根涼羽", detail: "全員／センター：正鋳真優・山根涼羽" },
      { track: "M25", type: "song", songId: 42, center: "センター：坂川陽香・徳永羚海", detail: "全員／センター：坂川陽香・徳永羚海" },
      { track: "M26", type: "song", songId: 12, center: "全員", detail: "全員／歌い出し：小栗有以・倉野尾成美・下尾みう・永野芹佳" },
      { track: "M27", type: "song", songId: 43, center: "全員", detail: "全員／歌い出し：秋山由奈・八木愛月" },
      { track: "—", type: "note", name: "MC3", detail: "全員" },
      { track: "M28", type: "song", songId: 44, center: "センター：伊藤百花", detail: "全員／センター：伊藤百花" },
      { track: "—", type: "note", name: "ENCORE", detail: "" },
      { track: "En1", type: "song", songId: 45, center: "センター：千葉恵里", detail: "選抜／センター：千葉恵里" },
      { track: "En2", type: "song", songId: 46, center: "センター：近藤沙樹", detail: "選抜／センター：近藤沙樹" },
      { track: "En3", type: "song", songId: 47, center: "全員", detail: "全員　練り歩き" },
      { track: "En4", type: "song", songId: 48, center: "全員", detail: "全員　練り歩き" },
      { track: "—", type: "note", name: "MC4", detail: "今日の感想：佐藤綺星・伊藤百花" },
      { track: "En5", type: "song", songId: 49, center: "センター：伊藤百花", detail: "全員／歌い出し：佐藤綺星　センター：伊藤百花" },
      { track: "—", type: "note", name: "終演後 影アナ", detail: "近藤沙樹" }
    ]
  },
  {
    id: "three-concepts-0926-yoru",
    category: "live",
    group: "three-concepts-live",
    tabLabel: "9/26 夜",
    title: "AKB48 THREE CONCEPTS LIVE(2026年9月26日 夜公演/全員「好きish」コンサート)",
    officialUrl: "",
    checkedAt: "2026年9月27日",
    pending: false,
    items: [
      { track: "—", type: "note", name: "開演前 影アナ", detail: "山根涼羽・徳永羚海" },
      { track: "—", type: "note", name: "overture 2.0", detail: "" },
      { track: "M01", type: "song", songId: 50, center: "センター：倉野尾成美", detail: "全員／センター：倉野尾成美" },
      { track: "M02", type: "song", songId: 51, center: "センター：徳永羚海", detail: "全員／センター：徳永羚海" },
      { track: "M03", type: "song", songId: 52, center: "センター：長友彩海", detail: "全員／センター：長友彩海" },
      { track: "M04", type: "song", songId: 53, center: "センター：橋本陽菜", detail: "全員／センター：橋本陽菜" },
      { track: "M05", type: "song", songId: 54, center: "センター：黒須遥香", detail: "全員／センター：黒須遥香" },
      { track: "M06", type: "song", songId: 55, center: "センター：近藤沙樹", detail: "センター：近藤沙樹／八木愛月・秋山由奈・山口結愛" },
      { track: "M07", type: "song", songId: 56, center: "センター：岩立沙穂", detail: "センター：岩立沙穂／大賀彩姫・丸山ひなた・髙橋舞桜・田中沙友利・牧戸愛茉・森川優" },
      { track: "M08", type: "song", songId: 57, center: "センター：下尾みう", detail: "センター：下尾みう／水島美結・成田香姫奈・山﨑空" },
      { track: "M09-1", type: "song", songId: 58, center: "センター：工藤華純", detail: "センター：工藤華純／橋本恵理子・正鋳真優・布袋百椛" },
      { track: "M09-2", type: "note", name: "ほんまやで☆なんでやねん☆しらんけど(モナキ)", detail: "工藤華純・橋本恵理子・正鋳真優・布袋百椛" },
      { track: "M10", type: "song", songId: 59, center: "センター：永野芹佳", detail: "センター：永野芹佳／武藤小麟・黒須遥香・畠山希美・小栗有以・山内瑞葵・迫由芽実" },
      { track: "M11", type: "song", songId: 60, center: "センター：奥本カイリ", detail: "センター：奥本カイリ(Vo&Gt)／新井彩永・坂川陽香・倉野尾成美・伊藤百花" },
      { track: "M12", type: "song", songId: 61, center: "センター：髙橋彩音", detail: "センター：髙橋彩音／長友彩海・近藤沙樹・徳永羚海・千葉恵里・行天優莉奈・川村結衣" },
      { track: "M13", type: "song", songId: 62, center: "センター：山根涼羽", detail: "センター：山根涼羽／平田侑希・久保姫菜乃・(近藤沙樹)" },
      { track: "—", type: "note", name: "DANCE BREAK", detail: "" },
      { track: "M14", type: "song", songId: 63, center: "センター：山口結愛", detail: "センター：山口結愛／倉野尾成美・八木愛月・秋山由奈・下尾みう・永野芹佳・山内瑞葵・正鋳真優・山﨑空" },
      { track: "M15", type: "song", songId: 64, center: "センター：八木愛月", detail: "センター：八木愛月／山口結愛・倉野尾成美・秋山由奈・下尾みう・永野芹佳・山内瑞葵・正鋳真優・山﨑空" },
      { track: "M16", type: "song", songId: 65, center: "センター：髙橋舞桜", detail: "センター：髙橋舞桜／伊藤百花・橋本恵理子・久保姫菜乃・佐藤綺星・畠山希美・川村結衣・徳永羚海・橋本陽菜・布袋百椛・太田有紀・牧戸愛茉" },
      { track: "M17", type: "song", songId: 66, center: "センター：川村結衣", detail: "センター：川村結衣／伊藤百花・橋本恵理子・久保姫菜乃・佐藤綺星・畠山希美・徳永羚海・橋本陽菜・布袋百椛・太田有紀・髙橋舞桜・牧戸愛茉" },
      { track: "M18", type: "song", songId: 67, center: "センター：布袋百椛", detail: "センター：布袋百椛／伊藤百花・橋本恵理子・久保姫菜乃・佐藤綺星・畠山希美・徳永羚海・橋本陽菜・川村結衣・太田有紀・髙橋舞桜・牧戸愛茉" },
      { track: "M19", type: "song", songId: 68, center: "センター：小栗有以", detail: "センター：小栗有以／行天優莉奈・成田香姫奈・福岡聖菜・千葉恵里・水島美結・岩立沙穂・長友彩海・髙橋彩音・平田侑希・大賀彩姫・森川優" },
      { track: "M20", type: "song", songId: 69, center: "センター：平田侑希", detail: "センター：平田侑希／小栗有以・行天優莉奈・成田香姫奈・千葉恵里・水島美結・岩立沙穂・長友彩海・福岡聖菜・髙橋彩音・大賀彩姫・森川優" },
      { track: "M21", type: "song", songId: 70, center: "センター：森川優", detail: "センター：森川優／平田侑希・小栗有以・行天優莉奈・千葉恵里・水島美結・岩立沙穂・長友彩海・成田香姫奈・福岡聖菜・髙橋彩音・大賀彩姫" },
      { track: "M22", type: "song", songId: 71, center: "センター：丸山ひなた", detail: "センター：丸山ひなた／奥本カイリ・迫由芽実・新井彩永・近藤沙樹・工藤華純・田中沙友利・武藤小麟・黒須遥香・山根涼羽" },
      { track: "M23", type: "song", songId: 72, center: "センター：迫由芽実", detail: "センター：迫由芽実／丸山ひなた・奥本カイリ・新井彩永・近藤沙樹・工藤華純・田中沙友利・武藤小麟・黒須遥香・山根涼羽" },
      { track: "M24", type: "song", songId: 73, center: "センター：渡邉葵心", detail: "センター：渡邉葵心(映像・なまはげ)／迫由芽実・丸山ひなた・奥本カイリ・新井彩永・近藤沙樹・工藤華純・田中沙友利・武藤小麟・黒須遥香・山根涼羽" },
      { track: "M25", type: "song", songId: 74, center: "センター：佐藤綺星", detail: "センター：佐藤綺星／髙橋彩音・橋本恵理子・橋本陽菜・布袋百椛" },
      { track: "M26", type: "song", songId: 75, center: "センター：大賀彩姫", detail: "センター：大賀彩姫／秋山由奈・川村結衣" },
      { track: "M27", type: "song", songId: 76, center: "センター：山﨑空", detail: "センター：山﨑空／福岡聖菜・新井彩永" },
      { track: "M28", type: "song", songId: 77, center: "センター：行天優莉奈", detail: "センター：行天優莉奈／千葉恵里・久保姫菜乃・工藤華純・山口結愛・平田侑希・八木愛月" },
      { track: "M29", type: "song", songId: 78, center: "センター：水島美結", detail: "センター：水島美結／成田香姫奈・山根涼羽・坂川陽香・黒須遥香・丸山ひなた・畠山希美" },
      { track: "M30", type: "song", songId: 79, center: "センター：太田有紀", detail: "センター：太田有紀／長友彩海・徳永羚海・髙橋舞桜・田中沙友利・牧戸愛茉・森川優" },
      { track: "M31", type: "song", songId: 80, center: "センター：山内瑞葵", detail: "センター：山内瑞葵／下尾みう・武藤小麟・倉野尾成美・小栗有以・正鋳真優・永野芹佳・佐藤綺星" },
      { track: "M32", type: "song", songId: 81, center: "センター：成田香姫奈", detail: "18期生・19期生／センター：成田香姫奈" },
      { track: "M33", type: "song", songId: 82, center: "センター：久保姫菜乃", detail: "18期生・19期生／センター：久保姫菜乃" },
      { track: "M34", type: "song", songId: 83, center: "センター：畠山希美", detail: "16期生・17期生／センター：畠山希美" },
      { track: "M35", type: "song", songId: 84, center: "センター：武藤小麟", detail: "16期生・17期生／センター：武藤小麟" },
      { track: "M36", type: "song", songId: 85, center: "センター：千葉恵里", detail: "13期生・15期生・ドラフト2期生・元チーム8／センター：千葉恵里" },
      { track: "M37", type: "song", songId: 86, center: "センター：福岡聖菜", detail: "13期生・15期生・ドラフト2期生・元チーム8／センター：福岡聖菜" },
      { track: "M38", type: "song", songId: 87, center: "センター：田中沙友利", detail: "20期生・21期生／センター：田中沙友利" },
      { track: "M39", type: "song", songId: 88, center: "センター：牧戸愛茉", detail: "20期生・21期生／センター：牧戸愛茉" },
      { track: "M40", type: "song", songId: 89, center: "センター：橋本恵理子", detail: "13〜19期生・ドラフト2期生・元チーム8／センター：橋本恵理子" },
      { track: "M41", type: "song", songId: 90, center: "センター：正鋳真優", detail: "13〜19期生・ドラフト2期生・元チーム8／センター：正鋳真優" },
      { track: "M42", type: "song", songId: 91, center: "センター：坂川陽香", detail: "13〜19期生・ドラフト2期生・元チーム8／センター：坂川陽香" },
      { track: "M43", type: "song", songId: 92, center: "センター：秋山由奈", detail: "全員／センター：秋山由奈" },
      { track: "M44", type: "song", songId: 93, center: "センター：新井彩永", detail: "全員／センター：新井彩永" },
      { track: "M45", type: "song", songId: 94, center: "センター：伊藤百花", detail: "全員／センター：伊藤百花" },
      { track: "—", type: "note", name: "MC1", detail: "全員／今日の感想：八木愛月・山内瑞葵" },
      { track: "M46", type: "song", songId: 14, center: "全員", detail: "全員／歌い出し：岩立沙穂・福岡聖菜" },
      { track: "—", type: "note", name: "ENCORE", detail: "" },
      { track: "En1", type: "song", songId: 31, center: "センター：伊藤百花", detail: "全員／センター：伊藤百花" },
      { track: "En2", type: "song", songId: 95, center: "センター：佐藤綺星", detail: "全員／センター：佐藤綺星" },
      { track: "—", type: "note", name: "MC2", detail: "全員／今日の感想：小栗有以" },
      { track: "En3", type: "song", songId: 96, center: "全員", detail: "全員／歌い出し：千葉恵里・伊藤百花・小栗有以・秋山由奈" },
      { track: "—", type: "note", name: "終演後 影アナ", detail: "秋山由奈" }
    ]
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
