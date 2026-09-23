// ============================================================
// メンバーの出身地(45名)
//
// 【出典】AKB48公式サイトのメンバープロフィール(https://www.akb48.co.jp/about/members/)。
// 各メンバーの詳細ページ(?mid=)を、1人ずつ個別に確認した(2026年9月23日)。
//
// 【ルール】
// - 出身地は、公式プロフィールの記載のとおりに書く(推測で埋めない)。
// - 卒業・加入があったら、members を更新する。
// - ペンライトカラー(data/penlight.js)と同じ形の、名前・所属期のデータを持たせてあるので、
//   将来「メンバー早見表」を作るときに、同じデータを使い回せる。
// ============================================================

const HOMETOWN = {
  checkedAt: "2026年9月23日",
  sourceUrl: "https://www.akb48.co.jp/about/members/",

  // 地方ごとの、都道府県の並び(0人の県も、この並びに含める)
  regions: [
    { name: "北海道・東北", prefectures: ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"] },
    { name: "関東", prefectures: ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"] },
    { name: "中部", prefectures: ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"] },
    { name: "近畿", prefectures: ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"] },
    { name: "中国・四国", prefectures: ["鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県"] },
    { name: "九州・沖縄", prefectures: ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"] }
  ],

  // group: プロフィールの「期」の表示(公式サイトの並び順のグループ)
  // mid: 公式プロフィールのURL(https://www.akb48.co.jp/about/members/detail?mid=)の番号
  members: [
    { name: "岩立沙穂", group: "13期生", pref: "神奈川県", mid: 110 },
    { name: "福岡聖菜", group: "15期生", pref: "神奈川県", mid: 152 },
    { name: "小栗有以", group: "Team8", pref: "東京都", mid: 180 },
    { name: "行天優莉奈", group: "Team8", pref: "香川県", mid: 204 },
    { name: "倉野尾成美", group: "Team8", pref: "熊本県", mid: 210 },
    { name: "坂川陽香", group: "Team8", pref: "福井県", mid: 1073 },
    { name: "下尾みう", group: "Team8", pref: "山口県", mid: 202 },
    { name: "髙橋彩音", group: "Team8", pref: "埼玉県", mid: 178 },
    { name: "徳永羚海", group: "Team8", pref: "鳥取県", mid: 1069 },
    { name: "永野芹佳", group: "Team8", pref: "大阪府", mid: 192 },
    { name: "橋本陽菜", group: "Team8", pref: "富山県", mid: 183 },
    { name: "千葉恵里", group: "ドラフト2期生", pref: "神奈川県", mid: 289 },
    { name: "黒須遥香", group: "16期生", pref: "埼玉県", mid: 1010 },
    { name: "長友彩海", group: "16期生", pref: "神奈川県", mid: 1016 },
    { name: "武藤小麟", group: "16期生", pref: "東京都", mid: 1022 },
    { name: "山内瑞葵", group: "16期生", pref: "東京都", mid: 1024 },
    { name: "山根涼羽", group: "16期生", pref: "兵庫県", mid: 1025 },
    { name: "太田有紀", group: "17期生", pref: "神奈川県", mid: 1074 },
    { name: "佐藤綺星", group: "17期生", pref: "千葉県", mid: 1076 },
    { name: "橋本恵理子", group: "17期生", pref: "大阪府", mid: 1077 },
    { name: "畠山希美", group: "17期生", pref: "埼玉県", mid: 1079 },
    { name: "平田侑希", group: "17期生", pref: "埼玉県", mid: 1080 },
    { name: "布袋百椛", group: "17期生", pref: "兵庫県", mid: 1081 },
    { name: "正鋳真優", group: "17期生", pref: "埼玉県", mid: 1082 },
    { name: "水島美結", group: "17期生", pref: "北海道", mid: 1083 },
    { name: "山﨑空", group: "17期生", pref: "東京都", mid: 1084 },
    { name: "秋山由奈", group: "18期生", pref: "千葉県", mid: 1085 },
    { name: "新井彩永", group: "18期生", pref: "東京都", mid: 1086 },
    { name: "工藤華純", group: "18期生", pref: "大分県", mid: 1087 },
    { name: "久保姫菜乃", group: "18期生", pref: "長野県", mid: 1088 },
    { name: "迫由芽実", group: "18期生", pref: "埼玉県", mid: 1089 },
    { name: "成田香姫奈", group: "18期生", pref: "北海道", mid: 1090 },
    { name: "八木愛月", group: "18期生", pref: "東京都", mid: 1091 },
    { name: "山口結愛", group: "18期生", pref: "長崎県", mid: 1092 },
    { name: "伊藤百花", group: "19期生", pref: "埼玉県", mid: 1093 },
    { name: "奥本カイリ", group: "19期生", pref: "東京都", mid: 1094 },
    { name: "川村結衣", group: "19期生", pref: "北海道", mid: 1095 },
    { name: "大賀彩姫", group: "20期研究生", pref: "福島県", mid: 1098 },
    { name: "近藤沙樹", group: "20期研究生", pref: "愛知県", mid: 1099 },
    { name: "丸山ひなた", group: "20期研究生", pref: "新潟県", mid: 1100 },
    { name: "髙橋舞桜", group: "21期研究生", pref: "北海道", mid: 1101 },
    { name: "田中沙友利", group: "21期研究生", pref: "埼玉県", mid: 1102 },
    { name: "牧戸愛茉", group: "21期研究生", pref: "愛知県", mid: 1103 },
    { name: "森川優", group: "21期研究生", pref: "兵庫県", mid: 1104 },
    { name: "渡邉葵心", group: "21期研究生", pref: "秋田県", mid: 1105 }
  ]
};
