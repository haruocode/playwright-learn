import { defineConfig, devices } from "@playwright/test";

// 設定ファイル。この章では最小限の項目だけ書いている。
// 公式リファレンス: https://playwright.dev/docs/test-configuration
export default defineConfig({
  // テストファイルが置いてあるフォルダ
  testDir: "./tests",

  // テストの中で page.goto("/") と書けるようにするための基準 URL
  use: {
    baseURL: "http://localhost:3000",
  },

  // この章はブラウザ1つに絞る。視聴者のダウンロード量を抑えるため。
  // https://playwright.dev/docs/test-projects
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // テストを実行する前にアプリを自動で起動してくれる。
  // 自分で npm start しておく必要はない。
  // https://playwright.dev/docs/test-webserver
  webServer: {
    command: "npm start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
  },
});
