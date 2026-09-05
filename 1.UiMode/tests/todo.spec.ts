import { expect, test } from "@playwright/test";

// 各テストの前に毎回アプリを開き直す。
// テストどうしが影響し合わないよう、常にまっさらな状態から始めるのが基本。
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("最初は何も登録されていない", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "やることリスト" })).toBeVisible();
  await expect(page.getByText("残タスク 0 件")).toBeVisible();
});

test("やることを追加できる", async ({ page }) => {
  // getByLabel は <label for> と結びついた入力欄を探す
  await page.getByLabel("やること").fill("牛乳を買う");
  await page.getByRole("button", { name: "追加" }).click();

  // 追加処理には 500 ミリ秒かかるが、待機処理を書く必要はない。
  // expect(...).toBeVisible() は、表示されるまで自動で待ってくれる。
  // https://playwright.dev/docs/actionability
  await expect(page.getByRole("checkbox", { name: "牛乳を買う" })).toBeVisible();
  await expect(page.getByText("残タスク 1 件")).toBeVisible();

  // 追加したあと入力欄が空に戻っていることも確かめる
  await expect(page.getByLabel("やること")).toHaveValue("");
});

test("完了にすると残タスクが減る", async ({ page }) => {
  await page.getByLabel("やること").fill("洗濯をする");
  await page.getByRole("button", { name: "追加" }).click();
  await expect(page.getByText("残タスク 1 件")).toBeVisible();

  await page.getByRole("checkbox", { name: "洗濯をする" }).check();

  await expect(page.getByRole("checkbox", { name: "洗濯をする" })).toBeChecked();
  await expect(page.getByText("残タスク 0 件")).toBeVisible();
});

test("削除できる", async ({ page }) => {
  await page.getByLabel("やること").fill("ゴミを出す");
  await page.getByRole("button", { name: "追加" }).click();
  await expect(page.getByRole("checkbox", { name: "ゴミを出す" })).toBeVisible();

  // 文字を持たないボタンでも、aria-label を付けておけば名前で指定できる
  await page.getByRole("button", { name: "ゴミを出す を削除" }).click();

  // 「無いこと」の確認は not を挟む
  await expect(page.getByRole("checkbox", { name: "ゴミを出す" })).not.toBeVisible();
  await expect(page.getByText("残タスク 0 件")).toBeVisible();
});
