# AGENTS.md

## このリポジトリについて

YouTube の Playwright 入門講座で使うチュートリアル用リポジトリ。**視聴者が clone して、動画と同じ手順を自分の手元で再現できること**が最優先。

読者は Playwright 未経験者。動画を見ながら順に進める。

現時点ではまだ空で、`1.UiMode/` ディレクトリだけが存在する。

## 最優先の原則

1. **章フォルダは完全に独立させる。** 視聴者が第5章だけ見に来ても、そのフォルダだけで完結すること。章をまたぐ import、共通の設定ファイル、ルートの `package.json` は作らない。同じコードの重複は積極的に許容する。
2. **clone してすぐ動く。** 各章の README のとおりに実行して失敗する状態を残さない。外部サイト、ログイン、APIキー、有料サービスには依存しない。
3. **動画と手元の結果が一致する。** 視聴者が見るのは収録時点の画面。バージョン差で挙動が変わると未経験者は原因を切り分けられないので、依存は**完全固定**（`^` や `~` を付けない）。
4. **未経験者が読んで分かる。** 説明的な日本語コメントを添える。省略記法や凝った書き方より、冗長でも素直なコードを選ぶ。

## テスト対象アプリは各章に同梱する

テストコードには対象となるプロダクションコードが要る。外部の公開サイトを対象にすると仕様変更でテストが壊れ、視聴者が原因不明で詰まるため、**対象アプリのソースを章フォルダの中に置き、`playwright.config.ts` の `webServer` でローカル起動する。**

構成は章の題材に応じて使い分ける。**どちらを使ったかを各章の README の冒頭に必ず書く。**

### A. 素の HTML/CSS/JS（既定）

ビルド不要。依存は `@playwright/test` と `@types/node` だけ。序盤の章や、単純な画面で足りる題材はこちら。

```
1.UiMode/
  app/
    index.html
    style.css
    main.js
  tests/
    todo.spec.ts
  playwright.config.ts   # webServer: npm start
  server.mjs             # app/ を配信するだけの静的サーバー
  package.json
  README.md
```

静的配信に `serve` などの npm パッケージを使わない。バージョンが固定できず、実行時にダウンロードが走るため。代わりに Node 標準の `node:http` だけで書いた `server.mjs` を各章にコピーして置く（章の独立を優先し、共有はしない）。`server.mjs` は学習対象ではない旨をファイル冒頭のコメントと README に書く。

### B. Vite + React

フォーム、認証フロー、非同期通信の待機など、現実的な題材が必要な章だけこちら。素の HTML で無理なく書けるなら A を選ぶ。

```
7.NetworkMock/
  src/
    App.tsx
    components/
  index.html
  vite.config.ts
  tests/
    example.spec.ts
  playwright.config.ts   # webServer: npm run dev
  package.json           # react, vite, @playwright/test（完全固定）
  README.md
```

アプリ側のコードは**題材として必要な最小限**にとどめる。凝った UI やディレクトリ構成は、視聴者にとって Playwright 学習の雑音になる。

## ディレクトリ構成

動画の章ごとに `<連番>.<トピック名>/` を切る。

```
1.UiMode/        UI モード（npx playwright test --ui）
2.Codegen/       （以降、章の進行に合わせて追加）
```

- 連番は動画の章番号と一致させる。公開後は既存の番号を振り直さない（動画側と食い違うため）。
- トピック名は PascalCase（`UiMode`, `Codegen`, `Trace`）。
- 各章に `README.md` を置き、次を書く：その章で扱うこと／アプリ構成が A か B か／セットアップと実行コマンド／公式ドキュメントの該当 URL。

## 環境

- Node.js v24（確認時 v24.10.0）/ npm 11
- Playwright は執筆時点で 1.63.0。全章で同じバージョンに揃え、キャレットなしの完全固定で書く。
- 各章のセットアップは章フォルダの中で行う：
  ```bash
  cd 1.UiMode
  npm install
  npx playwright install   # ブラウザバイナリは ~/.cache/ms-playwright に共通で入るので初回1回でよい
  npx playwright test
  ```
  この手順を各章の README にそのまま載せる。「初回1回でよい」も書く（章ごとに毎回必要だと誤解させないため）。
- **まだ git リポジトリになっていない。** 公開前に `git init` とリモート設定が要る。`node_modules/`、`test-results/`、`playwright-report/`、`blob-report/`、`.last-run.json`、`dist/` を `.gitignore` に入れる。

## テストコードを書くときの方針

- **完成して動くコードを書く。** 穴埋め教材ではないので、`npx playwright test` が通る状態でコミットする。
- **抽象化しない。** Page Object Model、共通ヘルパー、フィクスチャの自作は、それ自体を扱う章になるまで導入しない。早い章では `page.goto()` から `expect()` までを1つのテストに素直に並べる。
- **ロケータは推奨順で。** `getByRole` / `getByLabel` / `getByText` を使う。CSS セレクタや XPath は「なぜ避けるか」を教える文脈以外では使わない。アプリ側の HTML も、適切なロケータが自然に書けるようにセマンティックに作る（`<button>`、`<label for>`、見出しタグ）。
- **待機は自動待機に任せる。** `waitForTimeout` を書かない（アンチパターンとして紹介する場合を除く）。
- 公式ドキュメントを参照したら、該当ページの URL（https://playwright.dev/docs/...）を README かコメントに残す。

## 変更を加えるとき

- **公開済みの章は原則いじらない。** 動画と食い違うため。修正が必要なら、何がどう変わるかを先に報告して判断を仰ぐ。
- Playwright のバージョンを上げる提案は、全章への影響とセットで出す。
- 新しい章を追加するときは、既存章の README とディレクトリ構成の書式に合わせる。
