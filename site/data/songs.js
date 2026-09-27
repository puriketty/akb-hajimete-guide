// ============================================================
// 劇場公演のセットリストで使う、曲のデータ
//
// 同じ曲が、複数の公演で歌われることがあるため、曲のデータと、公演のデータ(data/setlists.js)を分けている。
// 新しい公演を追加するときの手順は、Notionの「📝 開発ログ(Claude Codeが書く)」に書いてある。
//
// 【1曲の形】
// {
//   id: 1,                          // 連番(1から。あとで足すときは、いちばん大きい番号の次の数字にする)
//   title: "曲名",                   // 公式の表記のまま(全角・半角・記号もそろえる)
//   kana: "",                       // 読み(任意。空文字でよい)
//   searchTerm: "",                 // 検索に使う語(任意。空なら title をそのまま使う)
//   lyricist: "",                   // 作詞(いなければ空文字。overtureなど)
//   composer: "",                   // 作曲
//   links: {}                       // 直リンク(任意)。あれば検索より優先される。
//                                    //   例: { apple: "https://...", spotify: "https://...", youtube: "https://..." }
// }
//
// 【出典】AKB48公式サイト「劇場公演セットリスト」(2026年9月23日に確認)
//
// id 18以降は、L(ライブのセットリスト。THREE CONCEPTS LIVE)で追加した曲。
// ライブのページでは作詞・作曲を表示しないため、lyricist/composerは調べておらず空にしてある
// (劇場公演のセットリストに載せることになったら、そのとき公式で確認して埋める)。
// 曲名の表記は、公式サイト・複数の楽曲データベースで確認したもの(2026年9月27日)。
// ============================================================

const SONGS = [
  { id: 1, title: "overture 2.0", kana: "", searchTerm: "", lyricist: "", composer: "山口勇人", links: {} },
  { id: 2, title: "ここからだ", kana: "ここからだ", searchTerm: "", lyricist: "秋元康", composer: "笠井快樹", links: {} },
  { id: 3, title: "恋愛カンニング", kana: "れんあいかんにんぐ", searchTerm: "", lyricist: "秋元康", composer: "谷村庸平", links: {} },
  { id: 4, title: "ロマンティック男爵", kana: "ろまんてぃっくだんしゃく", searchTerm: "", lyricist: "秋元康", composer: "吉野貴雄", links: {} },
  { id: 5, title: "劇場へ　ようこそ！", kana: "げきじょうへようこそ", searchTerm: "劇場へ ようこそ", lyricist: "秋元康", composer: "河田貴央", links: {} },
  { id: 6, title: "Lollipop", kana: "", searchTerm: "", lyricist: "秋元康", composer: "youwhich", links: {} },
  { id: 7, title: "風の待ち伏せ", kana: "かぜのまちぶせ", searchTerm: "", lyricist: "秋元康", composer: "宮島律子", links: {} },
  { id: 8, title: "クリスマスリング", kana: "くりすますりんぐ", searchTerm: "", lyricist: "秋元康", composer: "池澤聡", links: {} },
  { id: 9, title: "２月のMermaid", kana: "にがつのまーめいど", searchTerm: "2月のMermaid", lyricist: "秋元康", composer: "cAnON.", links: {} },
  { id: 10, title: "振り向きざまのキッス", kana: "ふりむきざまのきっす", searchTerm: "", lyricist: "秋元康", composer: "DEN with LY9.8", links: {} },
  { id: 11, title: "夜中過ぎのアウトロー", kana: "よなかすぎのあうとろー", searchTerm: "", lyricist: "秋元康", composer: "石井 健太郎", links: {} },
  { id: 12, title: "奇跡が消えても", kana: "きせきがきえても", searchTerm: "", lyricist: "秋元康", composer: "福田貴史", links: {} },
  { id: 13, title: "シクラメンが咲く頃", kana: "しくらめんがさくころ", searchTerm: "", lyricist: "秋元康", composer: "伊藤心太郎", links: {} },
  { id: 14, title: "まだ見たことのない景色へ", kana: "まだみたことのないけしきへ", searchTerm: "", lyricist: "秋元康", composer: "KaSHIMURA", links: {} },
  { id: 15, title: "緞帳を上げてくれ！", kana: "どんちょうをあげてくれ", searchTerm: "緞帳を上げてくれ", lyricist: "秋元康", composer: "金崎真士", links: {} },
  { id: 16, title: "そんなに好きだったら", kana: "そんなにすきだったら", searchTerm: "", lyricist: "秋元康", composer: "藤本貴則", links: {} },
  { id: 17, title: "Hungry love", kana: "", searchTerm: "", lyricist: "秋元康", composer: "石井亮輔", links: {} },

  // ---- ここから、ライブ(THREE CONCEPTS LIVE)で追加した曲 ----
  { id: 18, title: "LOVE修行", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 19, title: "純愛のクレッシェンド", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 20, title: "涙の表面張力", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 21, title: "パジャマドライブ", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 22, title: "キリギリス人", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 23, title: "クッキーキス", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 24, title: "酸っぱすぎるレモネード", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 25, title: "渦の巻き方", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 26, title: "君のDoodle", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 27, title: "言い訳Maybe", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 28, title: "希望的リフレイン", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 29, title: "恋　詰んじゃった", kana: "", searchTerm: "恋 詰んじゃった", lyricist: "", composer: "", links: {} },
  { id: 30, title: "まさかのConfession", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 31, title: "好きish", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 32, title: "secret base〜君がくれたもの〜", kana: "", searchTerm: "secret base 君がくれたもの", lyricist: "", composer: "", links: {} },
  { id: 33, title: "Baby! Baby! Baby!", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 34, title: "正義の味方じゃないヒーロー", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 35, title: "摩天楼の距離", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 36, title: "必然性", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 37, title: "誰のことを一番　愛してる？", kana: "", searchTerm: "誰のことを一番 愛してる", lyricist: "", composer: "", links: {} },
  { id: 38, title: "家出の夜", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 39, title: "ポニーテールとシュシュ", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 40, title: "RIVER", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 41, title: "君のことが好きだから", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 42, title: "BINGO!", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 43, title: "Only today", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 44, title: "名残り桜", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 45, title: "重力シンパシー", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 46, title: "ヘビーローテーション", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 47, title: "そばかすのキス", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 48, title: "久しぶりのリップグロス", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} },
  { id: 49, title: "大声ダイヤモンド", kana: "", searchTerm: "", lyricist: "", composer: "", links: {} }
];
