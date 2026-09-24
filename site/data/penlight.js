// ============================================================
// メンバーのペンライトカラー(45名)
//
// 【出典】
// - source: "official2022" … AKB48公式サイトの「AKB48メンバー『ペンライトカラー』一覧」(2022年10月5日)
// - source: "fan"          … ファン有志の一覧を参考に、運営者が確認したもの(2022年以降に加入したメンバー)
// - nickname               … AKB48公式サイトの、メンバーごとのプロフィールページ(2026年9月23日に、全員分を個別に確認)。
//                             2026年9月24日、THREE CONCEPTS LIVE(Kアリーナ横浜)の公式コールネーム・ペンライトカラー一覧
//                             (ぱちゃ提供)と全員分を照合し、11名分のニックネームの表記を、そちらに合わせて更新した
//                             (色はcolors・sourceとも変更なし)。
//
// 【ルール】
// - 色は変わることがある。公式や本人の発表が、いつでも優先。
// - 色の並びは、出典の並びのまま(左から)。
// - 新しいメンバーが入ったら、members に足す。卒業したら消す。
// - 色の名前は colorHex にあるものだけを使う(ないときは、colorHex に足す)。
// ============================================================

const PENLIGHT = {
  checkedAt: "2026年9月21日",

  colorHex: {
    "赤": "#e53935",
    "オレンジ": "#ff9800",
    "黄": "#ffeb00",
    "黄緑": "#9acd32",
    "緑": "#2e9e3f",
    "水色": "#9fd6ec",
    "青": "#1e40ff",
    "紫": "#7b1fa2",
    "ピンク": "#ff8fb3",
    "濃いピンク": "#ff1493",
    "薄いピンク": "#ffd6e6",
    "白": "#ffffff"
  },

  // 表示する順番のグループ
  groups: ["Team8", "13期〜ドラフト2期", "16期生", "17期生", "18期生", "19期生", "20期研究生", "21期研究生"],

  members: [
    // ---- Team8 ----
    { name: "小栗有以", nickname: "ゆいゆい", group: "Team8", colors: ["黄", "ピンク"], source: "official2022" },
    { name: "行天優莉奈", nickname: "ゆりな", group: "Team8", colors: ["ピンク", "ピンク"], source: "official2022" },
    { name: "倉野尾成美", nickname: "なるちゃん", group: "Team8", colors: ["赤", "緑"], source: "official2022" },
    { name: "坂川陽香", nickname: "ひゆか", group: "Team8", colors: ["赤", "オレンジ"], source: "official2022" },
    { name: "下尾みう", nickname: "みうちゃん", group: "Team8", colors: ["白", "紫"], source: "official2022" },
    { name: "髙橋彩音", nickname: "あやね", group: "Team8", colors: ["水色", "赤"], source: "official2022" },
    { name: "徳永羚海", nickname: "れみたん", group: "Team8", colors: ["ピンク", "青"], source: "official2022" },
    { name: "永野芹佳", nickname: "せりか", group: "Team8", colors: ["白", "白", "白"], source: "official2022" },
    { name: "橋本陽菜", nickname: "はるpyon", group: "Team8", colors: ["ピンク", "白"], source: "official2022" },

    // ---- 13期〜ドラフト2期 ----
    { name: "岩立沙穂", nickname: "さっほー", group: "13期〜ドラフト2期", colors: ["青", "白", "赤"], source: "official2022" },
    { name: "福岡聖菜", nickname: "せいちゃん", group: "13期〜ドラフト2期", colors: ["青", "白"], source: "official2022" },
    { name: "千葉恵里", nickname: "えりい", group: "13期〜ドラフト2期", colors: ["黄", "青"], source: "official2022" },

    // ---- 16期生 ----
    { name: "黒須遥香", nickname: "はーちゃん", group: "16期生", colors: ["黄"], source: "official2022" },
    { name: "長友彩海", nickname: "あやみん", group: "16期生", colors: ["黄", "水色"], source: "official2022" },
    { name: "武藤小麟", nickname: "おりん", group: "16期生", colors: ["水色", "濃いピンク"], source: "official2022" },
    { name: "山内瑞葵", nickname: "ずっきー", group: "16期生", colors: ["ピンク", "黄"], source: "official2022" },
    { name: "山根涼羽", nickname: "ずんちゃん", group: "16期生", colors: ["ピンク", "緑"], source: "official2022" },

    // ---- 17期生 ----
    { name: "太田有紀", nickname: "ゆきたん", group: "17期生", colors: ["水色", "紫"], source: "official2022" },
    { name: "佐藤綺星", nickname: "あいちゃん", group: "17期生", colors: ["赤", "白"], source: "official2022" },
    { name: "橋本恵理子", nickname: "えりこ", group: "17期生", colors: ["赤", "黄"], source: "official2022" },
    { name: "畠山希美", nickname: "のんちゃん", group: "17期生", colors: ["紫", "青"], source: "official2022" },
    { name: "平田侑希", nickname: "ゆきちゃん", group: "17期生", colors: ["白", "紫"], source: "official2022" },
    { name: "布袋百椛", nickname: "ほてちゃん", group: "17期生", colors: ["ピンク", "赤"], source: "official2022" },
    { name: "正鋳真優", nickname: "まゆう", group: "17期生", colors: ["白", "白"], source: "official2022" },
    { name: "水島美結", nickname: "みずみん", group: "17期生", colors: ["水色", "ピンク"], source: "official2022" },
    { name: "山﨑空", nickname: "そらら", group: "17期生", colors: ["紫", "ピンク"], source: "official2022" },

    // ---- 18期生 ----
    { name: "秋山由奈", nickname: "ゆなちゃん", group: "18期生", colors: ["水色", "水色"], source: "fan" },
    { name: "新井彩永", nickname: "さえちゃん", group: "18期生", colors: ["黄", "黄"], source: "fan" },
    { name: "工藤華純", nickname: "かすみん", group: "18期生", colors: ["赤", "緑"], source: "fan" },
    { name: "久保姫菜乃", nickname: "ひなちゃん", group: "18期生", colors: ["濃いピンク", "薄いピンク"], source: "fan" },
    { name: "迫由芽実", nickname: "ゆめみん", group: "18期生", colors: ["白", "水色"], source: "fan" },
    { name: "成田香姫奈", nickname: "こひな", group: "18期生", colors: ["紫", "黄"], source: "fan" },
    { name: "八木愛月", nickname: "あづちゃん", group: "18期生", colors: ["ピンク", "黄"], source: "fan" },
    { name: "山口結愛", nickname: "ゆいち", group: "18期生", colors: ["赤", "オレンジ"], source: "fan" },

    // ---- 19期生 ----
    { name: "伊藤百花", nickname: "ももか", group: "19期生", colors: ["薄いピンク", "薄いピンク"], source: "fan" },
    { name: "奥本カイリ", nickname: "カイリ", group: "19期生", colors: ["水色", "青"], source: "fan" },
    { name: "川村結衣", nickname: "かわゆい", group: "19期生", colors: ["赤", "紫"], source: "fan" },

    // ---- 20期研究生 ----
    { name: "大賀彩姫", nickname: "さーちゃん", group: "20期研究生", colors: ["青", "黄緑"], source: "fan" },
    { name: "近藤沙樹", nickname: "こさき", group: "20期研究生", colors: ["オレンジ", "緑"], source: "fan" },
    { name: "丸山ひなた", nickname: "まるちゃん", group: "20期研究生", colors: ["濃いピンク", "青"], source: "fan" },

    // ---- 21期研究生 ----
    { name: "髙橋舞桜", nickname: "まーたん", group: "21期研究生", colors: ["紫", "紫"], source: "fan" },
    { name: "田中沙友利", nickname: "さゆりん", group: "21期研究生", colors: ["水色", "黄緑"], source: "fan" },
    { name: "牧戸愛茉", nickname: "えまちゃん", group: "21期研究生", colors: ["濃いピンク", "濃いピンク"], source: "fan" },
    { name: "森川優", nickname: "ゆーゆ", group: "21期研究生", colors: ["水色", "オレンジ"], source: "fan" },
    { name: "渡邉葵心", nickname: "きこちゃん", group: "21期研究生", colors: ["青", "青"], source: "fan" }
  ],

  // ---- 特定のライブに出演するメンバー(絞り込みボタン用) ----
  // 公式の特設ページの「出演メンバー」欄と、name を1文字ずつ照合して作った(推測ではない)。
  // 22期研究生は、この公演(9/26 12:30)からお披露目されるが、公演の前は名前が非公開のため、載せていない
  // (色も、載せていない。発表され次第、members に足す)。
  eventCasts: {
    "three-concepts-live": {
      label: "THREE CONCEPTS LIVE(9/26・27)出演メンバー",
      checkedAt: "2026年9月22日",
      source: "https://www.akb48.co.jp/lp/akb3concon/",
      names: [
        "岩立沙穂", "福岡聖菜", "小栗有以", "行天優莉奈", "倉野尾成美", "坂川陽香", "下尾みう", "髙橋彩音",
        "徳永羚海", "永野芹佳", "橋本陽菜", "千葉恵里", "黒須遥香", "長友彩海", "武藤小麟", "山内瑞葵",
        "山根涼羽", "太田有紀", "佐藤綺星", "橋本恵理子", "畠山希美", "平田侑希", "布袋百椛", "正鋳真優",
        "水島美結", "山﨑空", "秋山由奈", "新井彩永", "工藤華純", "久保姫菜乃", "迫由芽実", "成田香姫奈",
        "八木愛月", "山口結愛", "伊藤百花", "奥本カイリ", "川村結衣", "大賀彩姫", "近藤沙樹", "丸山ひなた",
        "髙橋舞桜", "田中沙友利", "牧戸愛茉", "森川優", "渡邉葵心"
      ]
    }
  }
};
