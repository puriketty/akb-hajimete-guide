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
//     // center: 公式・報道で確認できたセンター・歌唱者(強調して表示)。detail: 公式・報道で確認できた補足。
//     // fan: 「ファンの声」(個人ブログなど)だけが根拠の共演メンバー・センター。画面に「ファンの声」と明記して出す。
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
// 【載せ方の決まり】曲順は、報道と、ファンのまとめ複数件で一致したものを載せる。
// 歌唱メンバーは、報道で確認できたものは通常表示、個人ブログ1件だけが根拠のものは「ファンの声」と明記する。
// MCの内容は書かない。歌詞・写真・映像は載せない。
// ============================================================

// 出典。items・notices・intro・orderSrc の src から、キーで参照する。fan: true は個人ブログ・まとめサイト(ファンの声)。
const SETLIST_SOURCES = {
  official: { label: "AKB48公式 特設ページ「AKB48 THREE CONCEPTS LIVE in K-Arena Yokohama」", url: "https://www.akb48.co.jp/lp/akb3concon/" },
  tv1: { label: "WEBザテレビジョン「AKB48、3つのコンセプトからなる3公演が開幕 22期研究生のお披露目も」", url: "https://thetv.jp/news/detail/1443813/" },
  tv2: { label: "WEBザテレビジョン「AKB48が“全員センター”の圧巻45曲ノンストップライブ 小栗有以「歴史のあるAKB48が誇り」」", url: "https://thetv.jp/news/detail/1443867/" },
  tv3: { label: "WEBザテレビジョン「AKB48推し席ランキング第1位は佐藤綺星、逆転にどよめき 二日間3公演で怒涛の111曲を披露」", url: "https://thetv.jp/news/detail/1443932/" },
  ntlHiru: { label: "音楽ナタリー「AKB48のKアリーナコンサート開幕！最新シングル選抜メンバーが歴代の王道曲で魅了、22期研究生のお披露目も」(Yahoo!ニュース転載)", url: "https://news.yahoo.co.jp/articles/092851ee474f65d7d075b43104be3eab6d40d610" },
  ntlYoru: { label: "音楽ナタリー「AKB48全メンバーが主役となって輝いたKアリーナ公演、45曲ノンストップの怒涛のステージ」(JOYSOUNDニュース転載)", url: "https://news.joysound.com/article/691763" },
  jcast: { label: "J-CASTニュース「AKB48「推し席」が生んだ逆転劇 佐藤綺星が中間4位から1位、小栗有以「2位」にどよめき」", url: "https://www.j-cast.com/2026/09/28518160.html?p=all" },
  mdpr1: { label: "モデルプレス「AKB48、22期研究生4人お披露目 元メンバー・長谷川百々花が再加入」", url: "https://mdpr.jp/news/detail/4850196" },
  mdpr2: { label: "モデルプレス「AKB48、2027年春に新冠番組決定 MCはエバース」", url: "https://mdpr.jp/news/detail/4849934" },
  natalie: { label: "お笑いナタリー「AKB48の冠レギュラー番組が2027年春に日本テレビで放送決定、MCはエバース」", url: "https://natalie.mu/owarai/news/691105" },
  ameba: { label: "Ameba News「AKB48、Kアリーナ横浜3公演を完走！来年2月20日に国立代々木競技場第一体育館公演も決定！［ライブレポート］」", url: "https://news.ameba.jp/entry/20260928-80383799/" },
  realsound: { label: "Real Sound「『ずっとAKB48の味方でいてください』 美しい涙が証明した“推し”との相思相愛の関係性 アリーナ公演でも変わらない原点」", url: "https://realsound.jp/2026/10/post-2539453.html" },
  nikkan: { label: "日刊スポーツ「AKB48、2・20代々木第一体育館でライブ開催「成長した私たちでお会い出来るように」」", url: "https://news.yahoo.co.jp/articles/7eccd5d3f8252e5d0f7a739f3dbe41c65eed3cfe" },
  tkondo: { label: "個人ブログ(Ameba)「AKB48「好きish」コンサート 全セットリスト、３コンセプトライブまとめ。出演者コメント」", url: "https://ameblo.jp/tkondo/entry-12980090556.html", fan: true },
  lignea: { label: "LuckyFes「AKB48 セトリ2026｜9月Kアリーナ横浜ライブ情報」(まとめサイト)", url: "https://lignea.co.jp/akb48-setlist/", fan: true },
  mupop: { label: "MUSIC-POP「AKB48セトリ2026横浜ライブ」(個人ブログ)", url: "https://mupop.hatenablog.com/entry/akb48live2026yokohama-setlist", fan: true },
  hatena: { label: "ライブ-セットリスト「【セトリ】AKB48 ライブ 2026 横浜「THREE CONCEPTS LIVE」」(個人ブログ)", url: "https://live-setlist.hatenablog.com/entry/akb48-yokohama-2026-9", fan: true }
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
    orderNote: "曲順は、音楽ナタリーのレポートと、ファンのまとめ(個人ブログ・まとめサイト)3件で一致しています。「ファンの声」と書いたセンター・共演メンバーは、個人ブログ1件の記録です。公式のセットリストの発表ではありません。",
    orderSrc: ["ntlHiru", "tkondo", "lignea", "mupop", "hatena"],
    items: [
      { track: "—", type: "note", name: "overture 2.0", detail: "", fan: true, src: ["tkondo"] },
      { track: "—", type: "note", name: "本編", detail: "" },
      { track: "1", type: "song", songId: 18, center: "星月花(伊藤百花・佐藤綺星・八木愛月)", src: ["ntlHiru","tv1"] },
      { track: "2", type: "song", songId: 19, center: "小栗有以・倉野尾成美・山内瑞葵", fan: "センター：倉野尾成美", src: ["ntlHiru","tkondo"] },
      { track: "3", type: "song", songId: 20, fan: "センター：秋山由奈／新井彩永・近藤沙樹・下尾みう", src: ["tkondo"] },
      { track: "4", type: "song", songId: 21, fan: "センター：川村結衣／水島美結・長友彩海", src: ["tkondo"] },
      { track: "5", type: "song", songId: 22, fan: "センター：千葉恵里／工藤華純・橋本恵理子", src: ["tkondo"] },
      { track: "6", type: "song", songId: 23, center: "スクールバッグ計画(メインボーカル：伊藤百花、コーラス：成田香姫奈・久保姫菜乃)", src: ["tv1","ntlHiru"] },
      { track: "7", type: "song", songId: 24, fan: "U-19選抜／センター：森川優", src: ["tkondo"] },
      { track: "8", type: "song", songId: 25, fan: "アンダーガールズ／センター：成田香姫奈", src: ["tkondo"] },
      { track: "9", type: "song", songId: 26, fan: "20期生／センター：大賀彩姫", src: ["tkondo"] },
      { track: "10", type: "song", songId: 27, fan: "センター：新井彩永", src: ["tkondo"] },
      { track: "11", type: "song", songId: 28, fan: "センター：橋本恵理子・長友彩海", src: ["tkondo"] },
      { track: "12", type: "song", songId: 29, center: "センター：佐藤綺星", src: ["tv1"] },
      { track: "13", type: "song", songId: 30, center: "センター：八木愛月", src: ["tv1"] },
      { track: "14", type: "song", songId: 31, center: "センター：伊藤百花", src: ["tv1","ntlHiru"] },
      { track: "15", type: "song", songId: 32, fan: "新生SONE：工藤華純・橋本恵理子・坂川陽香・新井彩永", note: "ZONEのカバー", src: ["tkondo","lignea"] },
      { track: "16", type: "song", songId: 33, fan: "センター：山内瑞葵", src: ["tkondo"] },
      { track: "17", type: "song", songId: 34, fan: "センター：佐藤綺星", src: ["tkondo"] },
      { track: "18", type: "song", songId: 35, src: ["ntlHiru"] },
      { track: "19", type: "song", songId: 36, fan: "センター：小栗有以", src: ["tkondo"] },
      { track: "20", type: "song", songId: 37, fan: "センター：伊藤百花", src: ["tkondo"] },
      { track: "21", type: "song", songId: 38, fan: "センター：下尾みう", src: ["tkondo"] },
      { track: "22", type: "song", songId: 39, center: "22期研究生(大西ゆな・長谷川百々花・前田衣澄・山内利乃明)", src: ["tv1","ntlHiru"] },
      { track: "23", type: "song", songId: 40, fan: "全員／掛け声：倉野尾成美", src: ["tkondo"] },
      { track: "24", type: "song", songId: 41, fan: "センター：正鋳真優", src: ["tkondo"] },
      { track: "25", type: "song", songId: 42, fan: "センター：坂川陽香・徳永羚海", src: ["tkondo"] },
      { track: "26", type: "song", songId: 12, src: ["ntlHiru"] },
      { track: "27", type: "song", songId: 43, fan: "センター：八木愛月・秋山由奈", src: ["tkondo"] },
      { track: "28", type: "song", songId: 44, center: "センター：伊藤百花", src: ["ntlHiru"] },
      { track: "—", type: "note", name: "アンコール", detail: "" },
      { track: "EN1", type: "song", songId: 45, fan: "センター：千葉恵里", src: ["tkondo"] },
      { track: "EN2", type: "song", songId: 46, fan: "センター：近藤沙樹", src: ["tkondo"] },
      { track: "EN3", type: "song", songId: 47, center: "客席を練り歩いて披露", src: ["ntlHiru"] },
      { track: "EN4", type: "song", songId: 48, center: "客席を練り歩いて披露", src: ["ntlHiru"] },
      { track: "EN5", type: "song", songId: 49, center: "最後の曲", fan: "歌い出し：佐藤綺星", src: ["tv1","tkondo"] }
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
    orderNote: "曲順とセンターは、WEBザテレビジョン・音楽ナタリーのレポートで一致しています(アンコールの「初日」は、音楽ナタリーとファンのまとめ3件)。「ファンの声」と書いた共演メンバーは、個人ブログ1件の記録です。22期研究生は、センターに含まれていません。公式のセットリストの発表ではありません。",
    orderSrc: ["tv2", "ntlYoru", "tkondo", "lignea", "mupop"],
    items: [
      { track: "—", type: "note", name: "overture 2.0", detail: "", fan: true, src: ["tkondo"] },
      { track: "—", type: "note", name: "本編(45曲ノンストップ)", detail: "" },
      { track: "1", type: "song", songId: 50, center: "センター：倉野尾成美", src: ["tv2"] },
      { track: "2", type: "song", songId: 51, center: "センター：徳永羚海", src: ["tv2"] },
      { track: "3", type: "song", songId: 52, center: "センター：長友彩海", src: ["tv2"] },
      { track: "4", type: "song", songId: 53, center: "センター：橋本陽菜", src: ["tv2"] },
      { track: "5", type: "song", songId: 54, center: "センター：黒須遥香", src: ["tv2"] },
      { track: "6", type: "song", songId: 55, center: "センター：近藤沙樹", fan: "共演：八木愛月・秋山由奈・山口結愛", src: ["tv2","tkondo"] },
      { track: "7", type: "song", songId: 56, center: "センター：岩立沙穂", fan: "共演：大賀彩姫・丸山ひなた・髙橋舞桜・田中沙友利・牧戸愛茉・森川優", src: ["tv2","tkondo"] },
      { track: "8", type: "song", songId: 57, center: "センター：下尾みう", fan: "共演：水島美結・成田香姫奈・山﨑空", src: ["tv2","tkondo"] },
      { track: "9", type: "song", songId: 58, center: "センター：工藤華純", fan: "共演：橋本恵理子・正鋳真優・布袋百椛(モナキ衣装)", src: ["tv2","tkondo"] },
      { track: "—", type: "note", name: "ほんまやで☆なんでやねん☆しらんけど(モナキの曲。「天国野郎」の途中で披露)", detail: "", fan: true, src: ["tkondo"] },
      { track: "10", type: "song", songId: 59, center: "センター：永野芹佳", fan: "共演：武藤小麟・黒須遥香・小栗有以・山内瑞葵・畠山希美・迫由芽実", src: ["tv2","tkondo"] },
      { track: "11", type: "song", songId: 60, center: "センター：奥本カイリ(ギター)", fan: "共演：新井彩永・坂川陽香・倉野尾成美・伊藤百花", src: ["tv2","tkondo"] },
      { track: "12", type: "song", songId: 61, center: "センター：髙橋彩音", fan: "共演：川村結衣・近藤沙樹・長友彩海・徳永羚海・行天優莉奈・千葉恵里", src: ["tv2","tkondo"] },
      { track: "13", type: "song", songId: 62, center: "センター：山根涼羽", fan: "共演：久保姫菜乃・平田侑希(最後に近藤沙樹)", src: ["tv2","tkondo"] },
      { track: "—", type: "note", name: "ダンスパート(ダンスメンバー9名)", detail: "", fan: "倉野尾成美・下尾みう・山口結愛・八木愛月・秋山由奈・永野芹佳・山内瑞葵・正鋳真優・山﨑空", src: ["ntlYoru", "tkondo"] },
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
      { track: "24", type: "song", songId: 73, center: "センター：渡邉葵心(映像での出演)", src: ["tv2"] },
      { track: "25", type: "song", songId: 74, center: "センター：佐藤綺星", fan: "共演：髙橋彩音・橋本陽菜・橋本恵理子・布袋百椛", src: ["tv2","tkondo"] },
      { track: "26", type: "song", songId: 75, center: "センター：大賀彩姫", fan: "共演：川村結衣・秋山由奈", src: ["tv2","tkondo"] },
      { track: "27", type: "song", songId: 76, center: "センター：山﨑空", fan: "共演：福岡聖菜・新井彩永", src: ["tv2","tkondo"] },
      { track: "28", type: "song", songId: 77, center: "センター：行天優莉奈", fan: "共演：千葉恵里・工藤華純・八木愛月・平田侑希・久保姫菜乃・山口結愛", src: ["tv2","tkondo"] },
      { track: "29", type: "song", songId: 78, center: "センター：水島美結", fan: "共演：成田香姫奈・山根涼羽・黒須遥香・坂川陽香・畠山希美・丸山ひなた", src: ["tv2","tkondo"] },
      { track: "30", type: "song", songId: 79, center: "センター：太田有紀", fan: "共演：長友彩海・徳永羚海・田中沙友利・髙橋舞桜・牧戸愛茉・森川優", src: ["tv2","tkondo"] },
      { track: "31", type: "song", songId: 80, center: "センター：山内瑞葵", fan: "共演：小栗有以・倉野尾成美・下尾みう・永野芹佳・正鋳真優・武藤小麟・佐藤綺星", src: ["tv2","ntlYoru","tkondo"] },
      { track: "32", type: "song", songId: 81, center: "センター：成田香姫奈", fan: "18期生・19期生", src: ["tv2","tkondo"] },
      { track: "33", type: "song", songId: 82, center: "センター：久保姫菜乃", fan: "18期生・19期生", src: ["tv2","tkondo"] },
      { track: "34", type: "song", songId: 83, center: "センター：畠山希美", fan: "16期生・17期生", src: ["tv2","tkondo"] },
      { track: "35", type: "song", songId: 84, center: "センター：武藤小麟", fan: "16期生・17期生", src: ["tv2","tkondo"] },
      { track: "36", type: "song", songId: 85, center: "センター：千葉恵里", fan: "13期生・15期生・ドラフト2期生・元チーム8", src: ["tv2","tkondo"] },
      { track: "37", type: "song", songId: 86, center: "センター：福岡聖菜", fan: "13期生・15期生・ドラフト2期生・元チーム8", src: ["tv2","tkondo"] },
      { track: "38", type: "song", songId: 87, center: "センター：田中沙友利", fan: "20期生・21期生", src: ["tv2","tkondo"] },
      { track: "39", type: "song", songId: 88, center: "センター：牧戸愛茉", fan: "20期生・21期生", src: ["tv2","tkondo"] },
      { track: "40", type: "song", songId: 89, center: "センター：橋本恵理子", src: ["tv2"] },
      { track: "41", type: "song", songId: 90, center: "センター：正鋳真優", src: ["tv2"] },
      { track: "42", type: "song", songId: 91, center: "センター：坂川陽香", src: ["tv2"] },
      { track: "43", type: "song", songId: 92, center: "センター：秋山由奈", src: ["tv2"] },
      { track: "44", type: "song", songId: 93, center: "センター：新井彩永", src: ["tv2"] },
      { track: "45", type: "song", songId: 94, center: "センター：伊藤百花", src: ["tv2"] },
      { track: "46", type: "song", songId: 14, center: "全員で歌唱(本編のラスト)", src: ["tv2","ntlYoru"] },
      { track: "—", type: "note", name: "アンコール", detail: "" },
      { track: "EN1", type: "song", songId: 31, center: "センター：伊藤百花", src: ["tv2","ntlYoru"] },
      { track: "EN2", type: "song", songId: 95, fan: "センター：佐藤綺星", src: ["tv2","tkondo"] },
      { track: "EN3", type: "song", songId: 96, center: "全員で披露", fan: "円陣の掛け声：倉野尾成美", src: ["ntlYoru","tkondo"] }
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
    orderNote: "曲順は、Ameba News・Real Soundのレポートと、ファンのまとめ3件で一致しています。「ファンの声」と書いた共演メンバーは、個人ブログ1件の記録です。公式のセットリストの発表ではありません。",
    orderSrc: ["ameba", "realsound", "tkondo", "lignea", "mupop"],
    intro: { text: "推し席とは、応援したいメンバーを1人選んで買う席のことです。席はメンバーごとのブロックに分かれ、メンバーごとのチケットの応募枚数に応じて、楽曲の立ち位置・参加曲数が決まる公演です。", src: ["official"] },
    items: [
      { track: "—", type: "note", name: "overture 2.0", detail: "", src: ["ameba"] },
      { track: "—", type: "note", name: "本編", detail: "" },
      { track: "1", type: "song", songId: 31, center: "各メンバーが、それぞれの推し席に立って披露", src: ["realsound","ameba"] },
      { track: "2", type: "song", songId: 97, center: "客席の通路を使って、ファンの近くで披露", src: ["realsound","ameba"] },
      { track: "3", type: "song", songId: 98, center: "客席の通路を使って、ファンの近くで披露", src: ["realsound","ameba"] },
      { track: "4", type: "song", songId: 99, center: "センターステージで披露", fan: "秋山由奈・岩立沙穂・小栗有以・川村結衣・工藤華純・倉野尾成美・黒須遥香・迫由芽実・千葉恵里・成田香姫奈・橋本恵理子・橋本陽菜・畠山希美・水島美結・八木愛月・山口結愛・山﨑空・丸山ひなた・田中沙友利・牧戸愛茉・森川優", src: ["realsound","tkondo"] },
      { track: "5", type: "song", songId: 100, fan: "全員(渡邉葵心を除く)", src: ["ameba","tkondo"] },
      { track: "—", type: "note", name: "推し席ランキングの発表", detail: "", src: ["jcast","tkondo"] },
      { track: "6", type: "song", songId: 101, center: "センター：佐藤綺星", detail: "推し席ランキング上位16名で披露", src: ["ameba","realsound"] },
      { track: "—", type: "note", name: "ユニット枠(推し席ランキング16位→6位の順)", detail: "" },
      { track: "7", type: "song", songId: 102, center: "長友彩海(16位)", fan: "共演：正鋳真優・森川優", src: ["realsound","tv3","tkondo"] },
      { track: "8", type: "song", songId: 103, center: "山﨑空(15位)", fan: "共演：布袋百椛・丸山ひなた", src: ["realsound","tv3","tkondo"] },
      { track: "9", type: "song", songId: 104, center: "川村結衣(14位)", fan: "共演：橋本陽菜・牧戸愛茉", src: ["realsound","tv3","tkondo"] },
      { track: "10", type: "song", songId: 105, center: "秋山由奈(13位)", fan: "共演：近藤沙樹・田中沙友利", src: ["realsound","tv3","tkondo"] },
      { track: "11", type: "song", songId: 106, center: "下尾みう(12位)", fan: "共演：黒須遥香・福岡聖菜", src: ["realsound","tv3","tkondo"] },
      { track: "12", type: "song", songId: 107, center: "平田侑希(11位)", fan: "共演：岩立沙穂・工藤華純", src: ["realsound","tv3","tkondo"] },
      { track: "13", type: "song", songId: 108, center: "新井彩永(10位)", fan: "共演：太田有紀・奥本カイリ・成田香姫奈", src: ["realsound","tv3","tkondo"] },
      { track: "14", type: "song", songId: 109, center: "武藤小麟(9位)", fan: "共演：行天優莉奈・山根涼羽・大賀彩姫・髙橋舞桜", src: ["realsound","tv3","tkondo"] },
      { track: "15", type: "song", songId: 110, center: "千葉恵里(8位)", fan: "共演：迫由芽実・永野芹佳・水島美結・山口結愛", src: ["realsound","tv3","tkondo"] },
      { track: "16", type: "song", songId: 111, center: "徳永羚海(7位)", fan: "共演：髙橋彩音・橋本恵理子・畠山希美", src: ["realsound","tv3","tkondo"] },
      { track: "17", type: "song", songId: 112, center: "八木愛月(6位)", fan: "共演：久保姫菜乃・坂川陽香", src: ["realsound","tv3","tkondo"] },
      { track: "—", type: "note", name: "ソロ枠(推し席ランキング5位→1位の順)", detail: "" },
      { track: "18", type: "song", songId: 113, center: "山内瑞葵(5位)", src: ["ameba","realsound","tv3"] },
      { track: "19", type: "song", songId: 114, center: "倉野尾成美(4位)", src: ["ameba","realsound","tv3"] },
      { track: "20", type: "song", songId: 115, center: "伊藤百花(3位)", src: ["ameba","realsound","tv3"] },
      { track: "21", type: "song", songId: 116, center: "小栗有以(2位)", src: ["ameba","realsound","tv3"] },
      { track: "22", type: "song", songId: 117, center: "佐藤綺星(1位)", src: ["ameba","realsound","tv3"] },
      { track: "—", type: "note", name: "そのほかの本編", detail: "" },
      { track: "23", type: "song", songId: 118, center: "推し席の位置(上段・センター・下段)ごとにメンバーをグループ分けして披露", src: ["realsound","ameba"] },
      { track: "24", type: "song", songId: 119, center: "推し席の位置(上段・センター・下段)ごとにメンバーをグループ分けして披露", src: ["realsound","ameba"] },
      { track: "25", type: "song", songId: 120, center: "推し席の位置(上段・センター・下段)ごとにメンバーをグループ分けして披露", src: ["realsound","ameba"] },
      { track: "26", type: "song", songId: 121, center: "推し席の位置(上段・センター・下段)ごとにメンバーをグループ分けして披露", src: ["realsound","ameba"] },
      { track: "27", type: "song", songId: 122, center: "推し席の位置(上段・センター・下段)ごとにメンバーをグループ分けして披露", src: ["realsound","ameba"] },
      { track: "28", type: "song", songId: 123, src: ["ameba","realsound"] },
      { track: "—", type: "note", name: "アンコール", detail: "" },
      { track: "EN1", type: "song", songId: 124, src: ["ameba","realsound"] },
      { track: "EN2", type: "song", songId: 125, src: ["ameba","realsound"] },
      { track: "EN3", type: "song", songId: 126, src: ["ameba","realsound"] },
      { track: "EN4", type: "song", songId: 127, center: "メンバーが再び、それぞれの推し席に戻って披露", src: ["realsound","ameba"] },
      { track: "EN5", type: "song", songId: 31, fan: "全員(渡邉葵心を除く)・客席を練り歩き", src: ["ameba","tkondo"] }
    ],
    notices: [
      { text: "推し席ランキングの最終結果が発表され、1位は佐藤綺星でした。中間発表の4位からの逆転と報じられています。1〜16位の担当曲は、上の曲の行に載せています。", src: ["tv3","ameba","realsound"] },
      { text: "2027年2月20日(土)に、国立代々木競技場第一体育館でコンサートを開催することが、この公演で発表されました。", note: "報道による情報です。公式の告知が出たら差し替えます。", src: ["ameba","tv3","nikkan"] }
    ]
  }
];
