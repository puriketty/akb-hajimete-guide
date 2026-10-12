// ============================================================
// セットリスト(公演ごとのデータ)。劇場公演(setlist.html)とライブ(live-setlist.html)の、
// 両方のページ(と、live.html のセットリスト欄)で共通に使う。曲そのもののデータは data/songs.js にある。
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
// 【ライブの形(MC以外の流れ・発表も行として入るので、詳しいitemsを持つ)】
// {
//   id: "three-concepts-0926-hiru",   // URLの ?stage= に使う短い英字のID
//   category: "live",
//   group: "three-concepts-live",     // 同じライブの、公演違いをタブでまとめるための目印
//   tabLabel: "9/26 昼",               // タブに出す短い文字
//   title: "AKB48 THREE CONCEPTS LIVE(2026年9月26日 昼公演)",
//   officialUrl: "https://...",       // 公式の公演ページ(曲のシートの「公式の公演ページを見る」に使う)
//   checkedAt: "2026年10月12日",       // 出典を確認した日
//   pending: false,                   // true にすると「準備中です」だけを出す(itemsは無視される)
//   orderNote: "...",                 // 曲順についての注記(任意)
//   intro: { text: "...", src: ["official"] },   // 公演の仕組みの説明(任意)
//   items: [
//     // 曲の行(タップすると、配信サービスを探すシートが開く)。
//     // 一覧には center だけを出し、歌唱メンバーの詳しい説明(detail)はシートの中に出す。
//     // src は、その行の出典(下の SETLIST_SOURCES のキー)。行ごとに出典リンクを付ける。
//     { track: "1", type: "song", songId: 18, center: "センター：〇〇", detail: "...", src: ["tv1"] },
//     // 曲でない行(見出しなど。タップできない)
//     { track: "—", type: "note", name: "アンコール", detail: "" }
//   ],
//   notices: [   // 公演中に発表されたこと
//     { text: "...", note: "(任意の注記)", src: ["tv1"] }
//   ]
// }
//
// 【載せ方の決まり】公式・報道で確認できたものだけ。歌唱メンバーは、出典に書かれているものだけ。
// MCの内容は書かない。歌詞・写真・映像は載せない。
// ============================================================

// 出典。items・notices・intro の src から、キーで参照する。
const SETLIST_SOURCES = {
  official: { label: "AKB48公式 特設ページ「AKB48 THREE CONCEPTS LIVE in K-Arena Yokohama」", url: "https://www.akb48.co.jp/lp/akb3concon/" },
  tv1: { label: "WEBザテレビジョン「AKB48、3つのコンセプトからなる3公演が開幕 22期研究生のお披露目も」", url: "https://thetv.jp/news/detail/1443813/" },
  tv2: { label: "WEBザテレビジョン「AKB48が“全員センター”の圧巻45曲ノンストップライブ 小栗有以「歴史のあるAKB48が誇り」」", url: "https://thetv.jp/news/detail/1443867/" },
  tv3: { label: "WEBザテレビジョン「AKB48推し席ランキング第1位は佐藤綺星、逆転にどよめき 二日間3公演で怒涛の111曲を披露」", url: "https://thetv.jp/news/detail/1443932/" },
  mdpr1: { label: "モデルプレス「AKB48、22期研究生4人お披露目 元メンバー・長谷川百々花が再加入」", url: "https://mdpr.jp/news/detail/4850196" },
  mdpr2: { label: "モデルプレス「AKB48、2027年春に新冠番組決定 MCはエバース」", url: "https://mdpr.jp/news/detail/4849934" },
  natalie: { label: "お笑いナタリー「AKB48の冠レギュラー番組が2027年春に日本テレビで放送決定、MCはエバース」", url: "https://natalie.mu/owarai/news/691105" },
  ameba: { label: "Ameba News「AKB48、Kアリーナ横浜3公演を完走！来年2月20日に国立代々木競技場第一体育館公演も決定！［ライブレポート］」", url: "https://news.ameba.jp/entry/20260928-80383799/" },
  realsound: { label: "Real Sound「『ずっとAKB48の味方でいてください』 美しい涙が証明した“推し”との相思相愛の関係性 アリーナ公演でも変わらない原点」", url: "https://realsound.jp/2026/10/post-2539453.html" },
  nikkan: { label: "日刊スポーツ「AKB48、2・20代々木第一体育館でライブ開催「成長した私たちでお会い出来るように」」", url: "https://news.yahoo.co.jp/articles/7eccd5d3f8252e5d0f7a739f3dbe41c65eed3cfe" }
};

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
    officialUrl: "https://www.akb48.co.jp/lp/akb3concon/",
    checkedAt: "2026年10月12日",
    pending: false,
    orderNote: "曲順は、報道に出た曲名を、並んでいた順に写したものです。確定した曲順ではありません(全曲とは限りません)。",
    items: [
      { track: "—", type: "note", name: "本編", detail: "" },
      { track: "—", type: "song", songId: 18, src: ["tv1"] },
      { track: "—", type: "song", songId: 19, src: ["tv1"] },
      { track: "—", type: "song", songId: 20, src: ["tv1"] },
      { track: "—", type: "song", songId: 21, src: ["tv1"] },
      { track: "—", type: "song", songId: 22, src: ["tv1"] },
      { track: "—", type: "song", songId: 23, center: "スクールバッグ計画", detail: "スクールバッグ計画による演奏", src: ["tv1"] },
      { track: "—", type: "song", songId: 26, src: ["tv1"] },
      { track: "—", type: "song", songId: 29, src: ["tv1"] },
      { track: "—", type: "song", songId: 30, src: ["tv1"] },
      { track: "—", type: "song", songId: 31, center: "センター：伊藤百花", detail: "センター：伊藤百花", src: ["tv1"] },
      { track: "—", type: "song", songId: 39, center: "22期研究生", detail: "22期研究生", src: ["tv1"] },
      { track: "—", type: "song", songId: 44, src: ["tv1"] },
      { track: "—", type: "note", name: "アンコール", detail: "" },
      { track: "—", type: "song", songId: 45, src: ["tv1"] },
      { track: "—", type: "song", songId: 46, src: ["tv1"] },
      { track: "—", type: "song", songId: 49, src: ["tv1"] }
    ],
    notices: [
      { text: "22期研究生4人(長谷川百々花・大西ゆな・前田衣澄・山内利乃明)のお披露目がありました。", src: ["tv1","mdpr1"] }
    ]
  },
  {
    id: "three-concepts-0926-yoru",
    category: "live",
    group: "three-concepts-live",
    tabLabel: "9/26 夜",
    title: "AKB48 THREE CONCEPTS LIVE(2026年9月26日 夜公演/全員「好きish」コンサート)",
    officialUrl: "https://www.akb48.co.jp/lp/akb3concon/",
    checkedAt: "2026年10月12日",
    pending: false,
    orderNote: "曲名と各曲のセンターを、報道に書かれていた順に写したものです。公式のセットリストの発表ではありません。22期研究生は、センターに含まれていません。",
    items: [
      { track: "—", type: "note", name: "本編", detail: "" },
      { track: "1", type: "song", songId: 50, center: "センター：倉野尾成美", src: ["tv2"] },
      { track: "2", type: "song", songId: 51, center: "センター：徳永羚海", src: ["tv2"] },
      { track: "3", type: "song", songId: 52, center: "センター：長友彩海", src: ["tv2"] },
      { track: "4", type: "song", songId: 53, center: "センター：橋本陽菜", src: ["tv2"] },
      { track: "5", type: "song", songId: 54, center: "センター：黒須遥香", src: ["tv2"] },
      { track: "6", type: "song", songId: 55, center: "センター：近藤沙樹", src: ["tv2"] },
      { track: "7", type: "song", songId: 56, center: "センター：岩立沙穂", src: ["tv2"] },
      { track: "8", type: "song", songId: 57, center: "センター：下尾みう", src: ["tv2"] },
      { track: "9", type: "song", songId: 58, center: "センター：工藤華純", src: ["tv2"] },
      { track: "10", type: "song", songId: 59, center: "センター：永野芹佳", src: ["tv2"] },
      { track: "11", type: "song", songId: 60, center: "センター：奥本カイリ", src: ["tv2"] },
      { track: "12", type: "song", songId: 61, center: "センター：髙橋彩音", src: ["tv2"] },
      { track: "13", type: "song", songId: 62, center: "センター：山根涼羽", src: ["tv2"] },
      { track: "14", type: "song", songId: 63, center: "センター：山口結愛", src: ["tv2"] },
      { track: "15", type: "song", songId: 64, center: "センター：八木愛月", src: ["tv2"] },
      { track: "16", type: "song", songId: 65, center: "センター：髙橋舞桜", src: ["tv2"] },
      { track: "17", type: "song", songId: 66, center: "センター：川村結衣", src: ["tv2"] },
      { track: "18", type: "song", songId: 67, center: "センター：布袋百椛", src: ["tv2"] },
      { track: "19", type: "song", songId: 68, center: "センター：小栗有以", src: ["tv2"] },
      { track: "20", type: "song", songId: 69, center: "センター：平田侑希", src: ["tv2"] },
      { track: "21", type: "song", songId: 70, center: "センター：森川優", src: ["tv2"] },
      { track: "22", type: "song", songId: 71, center: "センター：丸山ひなた", src: ["tv2"] },
      { track: "23", type: "song", songId: 72, center: "センター：迫由芽実", src: ["tv2"] },
      { track: "24", type: "song", songId: 73, center: "センター：渡邉葵心", note: "映像での出演", src: ["tv2"] },
      { track: "25", type: "song", songId: 74, center: "センター：佐藤綺星", src: ["tv2"] },
      { track: "26", type: "song", songId: 75, center: "センター：大賀彩姫", src: ["tv2"] },
      { track: "27", type: "song", songId: 76, center: "センター：山﨑空", src: ["tv2"] },
      { track: "28", type: "song", songId: 77, center: "センター：行天優莉奈", src: ["tv2"] },
      { track: "29", type: "song", songId: 78, center: "センター：水島美結", src: ["tv2"] },
      { track: "30", type: "song", songId: 79, center: "センター：太田有紀", src: ["tv2"] },
      { track: "31", type: "song", songId: 80, center: "センター：山内瑞葵", src: ["tv2"] },
      { track: "32", type: "song", songId: 81, center: "センター：成田香姫奈", src: ["tv2"] },
      { track: "33", type: "song", songId: 82, center: "センター：久保姫菜乃", src: ["tv2"] },
      { track: "34", type: "song", songId: 83, center: "センター：畠山希美", src: ["tv2"] },
      { track: "35", type: "song", songId: 84, center: "センター：武藤小麟", src: ["tv2"] },
      { track: "36", type: "song", songId: 85, center: "センター：千葉恵里", src: ["tv2"] },
      { track: "37", type: "song", songId: 86, center: "センター：福岡聖菜", src: ["tv2"] },
      { track: "38", type: "song", songId: 87, center: "センター：田中沙友利", src: ["tv2"] },
      { track: "39", type: "song", songId: 88, center: "センター：牧戸愛茉", src: ["tv2"] },
      { track: "40", type: "song", songId: 89, center: "センター：橋本恵理子", src: ["tv2"] },
      { track: "41", type: "song", songId: 90, center: "センター：正鋳真優", src: ["tv2"] },
      { track: "42", type: "song", songId: 91, center: "センター：坂川陽香", src: ["tv2"] },
      { track: "43", type: "song", songId: 92, center: "センター：秋山由奈", src: ["tv2"] },
      { track: "44", type: "song", songId: 93, center: "センター：新井彩永", src: ["tv2"] },
      { track: "45", type: "song", songId: 94, center: "センター：伊藤百花", src: ["tv2"] },
      { track: "本編ラスト", type: "song", songId: 14, center: "全員で歌唱", src: ["tv2"] },
      { track: "—", type: "note", name: "アンコール", detail: "" },
      { track: "—", type: "song", songId: 31, src: ["tv2"] },
      { track: "—", type: "song", songId: 95, src: ["tv2"] }
    ],
    notices: [
      { text: "お笑いコンビ「エバース」とAKB48による新しい冠番組が、2027年春から日本テレビで放送されると発表されました(2クール予定)。", src: ["tv2","mdpr2","natalie"] }
    ]
  },
  {
    id: "three-concepts-0927",
    category: "live",
    group: "three-concepts-live",
    tabLabel: "9/27",
    title: "AKB48 THREE CONCEPTS LIVE(2026年9月27日 推しが「好きish」コンサート)",
    officialUrl: "https://www.akb48.co.jp/lp/akb3concon/",
    checkedAt: "2026年10月12日",
    pending: false,
    orderNote: "曲順は、報道2件(Ameba News・Real Sound)で一致した順に写したものです。公式のセットリストの発表ではありません。歌唱メンバーは、出典に書かれているものだけを載せています。",
    intro: { text: "推し席とは、応援したいメンバーを1人選んで買う席のことです。席はメンバーごとのブロックに分かれ、メンバーごとのチケットの応募枚数に応じて、楽曲の立ち位置・参加曲数が決まる公演です。", src: ["official"] },
    items: [
      { track: "—", type: "note", name: "本編", detail: "" },
      { track: "1", type: "song", songId: 1, src: ["ameba","realsound"] },
      { track: "2", type: "song", songId: 31, detail: "各メンバーが、それぞれの推し席に立って披露", src: ["realsound"] },
      { track: "3", type: "song", songId: 97, detail: "客席の通路を使って、ファンの近くで披露", src: ["realsound"] },
      { track: "4", type: "song", songId: 98, detail: "客席の通路を使って、ファンの近くで披露", src: ["realsound"] },
      { track: "5", type: "song", songId: 99, src: ["ameba","realsound"] },
      { track: "6", type: "song", songId: 100, src: ["ameba","realsound"] },
      { track: "7", type: "song", songId: 101, center: "センター：佐藤綺星", detail: "推し席ランキング上位16名で披露／センター：佐藤綺星", src: ["ameba","realsound"] },
      { track: "—", type: "note", name: "ユニット枠(推し席ランキング16位→6位の順)", detail: "" },
      { track: "8", type: "song", songId: 102, center: "長友彩海(16位)", src: ["realsound","tv3"] },
      { track: "9", type: "song", songId: 103, center: "山﨑空(15位)", src: ["realsound","tv3"] },
      { track: "10", type: "song", songId: 104, center: "川村結衣(14位)", src: ["realsound","tv3"] },
      { track: "11", type: "song", songId: 105, center: "秋山由奈(13位)", src: ["realsound","tv3"] },
      { track: "12", type: "song", songId: 106, center: "下尾みう(12位)", src: ["realsound","tv3"] },
      { track: "13", type: "song", songId: 107, center: "平田侑希(11位)", src: ["realsound","tv3"] },
      { track: "14", type: "song", songId: 108, center: "新井彩永(10位)", src: ["realsound","tv3"] },
      { track: "15", type: "song", songId: 109, center: "武藤小麟(9位)", src: ["realsound","tv3"] },
      { track: "16", type: "song", songId: 110, center: "千葉恵里(8位)", src: ["realsound","tv3"] },
      { track: "17", type: "song", songId: 111, center: "徳永羚海(7位)", src: ["realsound","tv3"] },
      { track: "18", type: "song", songId: 112, center: "八木愛月(6位)", src: ["realsound","tv3"] },
      { track: "—", type: "note", name: "ソロ枠(推し席ランキング5位→1位の順)", detail: "" },
      { track: "19", type: "song", songId: 113, center: "山内瑞葵(5位)", src: ["ameba","realsound","tv3"] },
      { track: "20", type: "song", songId: 114, center: "倉野尾成美(4位)", src: ["ameba","realsound","tv3"] },
      { track: "21", type: "song", songId: 115, center: "伊藤百花(3位)", src: ["ameba","realsound","tv3"] },
      { track: "22", type: "song", songId: 116, center: "小栗有以(2位)", src: ["ameba","realsound","tv3"] },
      { track: "23", type: "song", songId: 117, center: "佐藤綺星(1位)", src: ["ameba","realsound","tv3"] },
      { track: "—", type: "note", name: "そのほかの本編", detail: "" },
      { track: "24", type: "song", songId: 118, detail: "推し席の位置(上段・センター・下段)ごとにメンバーをグループ分けして披露", src: ["realsound"] },
      { track: "25", type: "song", songId: 119, detail: "推し席の位置(上段・センター・下段)ごとにメンバーをグループ分けして披露", src: ["realsound"] },
      { track: "26", type: "song", songId: 120, detail: "推し席の位置(上段・センター・下段)ごとにメンバーをグループ分けして披露", src: ["realsound"] },
      { track: "27", type: "song", songId: 121, detail: "推し席の位置(上段・センター・下段)ごとにメンバーをグループ分けして披露", src: ["realsound"] },
      { track: "28", type: "song", songId: 122, detail: "推し席の位置(上段・センター・下段)ごとにメンバーをグループ分けして披露", src: ["realsound"] },
      { track: "29", type: "song", songId: 123, src: ["ameba","realsound"] },
      { track: "—", type: "note", name: "アンコール", detail: "" },
      { track: "—", type: "song", songId: 124, src: ["ameba","realsound"] },
      { track: "—", type: "song", songId: 125, src: ["ameba","realsound"] },
      { track: "—", type: "song", songId: 126, src: ["ameba","realsound"] },
      { track: "—", type: "song", songId: 127, detail: "メンバーが再び、それぞれの推し席に戻って披露", src: ["realsound"] },
      { track: "—", type: "song", songId: 31, src: ["ameba","realsound"] }
    ],
    notices: [
      { text: "推し席ランキングの最終結果が発表され、1位は佐藤綺星でした。中間発表の4位からの逆転と報じられています。1〜16位の担当曲は、上の曲の行に載せています。", src: ["tv3","ameba","realsound"] },
      { text: "2027年2月20日(土)に、国立代々木競技場第一体育館でコンサートを開催することが、この公演で発表されました。", note: "報道による情報です。公式の告知が出たら差し替えます。", src: ["ameba","tv3","nikkan"] }
    ]
  }
];
