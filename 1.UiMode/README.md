# 第1章 UI モード

Playwright の **UI モード**（`npx playwright test --ui`）の使い方を学ぶ章。

テストは普通に実行すると結果が○×で出るだけだが、UI モードを使うと、どの操作で何が起きたかを画面つきで1ステップずつ見返せる。最初に覚えておくと、以降の章でつまずいたときの調べ方になる。

- アプリ構成: **A. 素の HTML/CSS/JS**（ビルド不要・依存は Playwright だけ）
- 対象アプリ: `app/` にある「やることリスト」

## セットアップ

```bash
cd 1.UiMode
npm install
npx playwright install chromium
```

`npx playwright install` でダウンロードするブラウザは、パソコン全体で共通の場所に入る。**他の章で改めて実行する必要はない**（初回の1回だけでよい）。

## 実行する

```bash
# UI モードで開く（この章の主役）
npm run test:ui

# 普通に実行する（結果だけ見たいとき）
npm test
```

アプリのサーバーは Playwright が自動で起動するので、自分で立ち上げなくてよい。
アプリだけをブラウザで見たいときは `npm start` で http://localhost:3000 が開く。

## UI モードで試してみること

`npm run test:ui` で開いた画面で、次を順に触ってみる。

1. **テストを実行する** — 左のリストでテストを選び、▶ を押す。
2. **時間旅行する** — 実行後、上部のタイムラインや左下のステップ一覧をクリックすると、その時点の画面が右側に表示される。`やることを追加できる` の途中に出る「保存中...」の瞬間も見返せる。
3. **監視モードにする** — 目のアイコン（Watch）をオンにすると、テストやアプリのコードを保存するたびに自動で再実行される。`tests/todo.spec.ts` の文言を書き換えて保存し、失敗する様子を見てみる。
4. **ロケータを拾う** — 「Pick locator」を押して画面上の要素をクリックすると、その要素を指すコード（`getByRole(...)` など）が表示される。そのままテストに貼り付けられる。
5. **失敗の理由を読む** — わざと `expect(page.getByText("残タスク 5 件"))` などに書き換えて保存し、Errors タブに何が出るか見てみる。

## この章で出てくる書き方

- `page.getByLabel("やること")` — `<label for>` と結びついた入力欄を指す
- `page.getByRole("button", { name: "追加" })` — ボタンをその表示名で指す
- `expect(...).toBeVisible()` — 表示されるまで**自動で待つ**ので、待機処理を自分で書かなくてよい

## ファイル構成

```
1.UiMode/
  app/                  テスト対象のアプリ本体
    index.html
    style.css
    main.js
  tests/
    todo.spec.ts        テストコード
  playwright.config.ts  Playwright の設定
  server.mjs            app/ を配信するだけの小さなサーバー（学習対象ではない）
  package.json
```

## 公式ドキュメント

- UI モード: https://playwright.dev/docs/test-ui-mode
- ロケータ: https://playwright.dev/docs/locators
- 自動待機の仕組み: https://playwright.dev/docs/actionability
- 設定ファイル: https://playwright.dev/docs/test-configuration
