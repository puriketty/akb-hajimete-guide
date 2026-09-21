# 初めてのAKB48ガイド(非公式ファンサイト)

AKB48の劇場公演・握手会に初めて行く人向けの、非公式ファンサイト。HTML / CSS / JavaScript だけで作っていて、ビルドは不要。

## ユーザーについて
- プログラミング未経験、Claude Code は初めて。日本語で、専門用語は言い換えて、やさしく説明する。
- 手をなるべく動かさず、Claude が自律的に進めるのを望んでいる。ただし、アカウント登録・パスワード入力・セキュリティ設定の変更は、ユーザー本人にやってもらう。

## ファイル
サイト本体は `site/` の中だけ(ここだけが公開される)。`CLAUDE.md` `README.md` `netlify.toml` は公開されない。
- `site/index.html` `theater.html` `handshake.html` `planner.html`: 各ページ
- `site/style.css`: 全ページ共通の見た目(色は先頭の `:root` で変える。ピンク基調)
- `site/planner.js`: 部割プランナーの計算。データは `site/data/events.js` にあり、新しい握手会は `EVENTS` に同じ形で足すだけ

## 情報の扱い
- ルールや申し込み方法は変わる。必ず公式の原文で確認し、各ページに確認日と公式リンクを載せる。
- 部割は公式のスケジュール(PDF・画像)を読み取ったもの。誤読の恐れがあるので、公開前にユーザーに確認してもらう。
- 公式の写真・ロゴ・歌詞は載せない。「非公式」と明記する。

## 公開(「公開して」と言われたら)
公開先は Netlify。GitHub リポジトリ(https://github.com/puriketty/akb-hajimete-guide)と連携済み。
プロジェクト名 `akb-hajimete-guide`(サイトID `d259c98c-bcac-4871-aa53-92eaa09a9fca`)、公開URL: https://akb-hajimete-guide.netlify.app

- **`main` にマージすると、本番に自動で公開される。** PR ごとに、確認用のデプロイプレビューが自動で作られる。
- 更新の流れ: ブランチを作る → 直す → push → PR を作る → プレビューを確認する → `main` にマージする。
- 公開するのは `netlify.toml` で指定した `site/` だけ。`CLAUDE.md` `README.md` はサイトとしては公開されない。
- 「公開して」と言われたら、上の流れで PR を作り、プレビューを確認してから、ユーザーに確認してマージする。
- 公開後は、URL をブラウザで開いて、表示と部割プランナーの動きを確認する。

### 注意
- **このリポジトリは公開(PUBLIC)。** `CLAUDE.md` も誰でも読める。鍵・パスワード・トークン・個人のメールアドレス・パソコン内の個人フォルダの場所は書かない。
- 非公開にしていたときは、Netlify の無料プランが「非公開リポジトリのビルドは確認済みメンバーのみ」と判断してビルドを止めた(Unrecognized Git contributor)。非公開に戻すと、同じ問題が出る可能性がある。
- git と gh は、winget で入れた直後のセッションでは PATH を読み直す:
  `$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")`
- 新しい Netlify プロジェクトは初期設定が非公開(Team protection)。公開の切り替え(Project configuration > General > Visitor access > Project visibility)は、セキュリティ設定なのでユーザー本人にやってもらう。
