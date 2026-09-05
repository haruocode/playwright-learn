// テスト対象のアプリ本体。やることを追加・完了・削除できるだけの小さな画面。
// この章の主役は Playwright の UI モードなので、アプリ側はあえて素の JavaScript で短く書いている。

const form = document.querySelector("#new-todo-form");
const input = document.querySelector("#new-todo");
const status = document.querySelector("#status");
const list = document.querySelector("#todo-list");
const remaining = document.querySelector("#remaining");

let nextId = 1;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (text === "") return;

  // 実際のアプリでサーバーに保存する場面を模した待ち時間。
  // Playwright は要素が出てくるまで自動で待つので、テスト側に待機処理は要らない。
  // UI モードの時間旅行で、この「保存中...」の瞬間を見返せる。
  status.hidden = false;
  await new Promise((resolve) => setTimeout(resolve, 500));
  status.hidden = true;

  addTodo(text);
  input.value = "";
  updateRemaining();
});

function addTodo(text) {
  const id = `todo-${nextId++}`;

  const item = document.createElement("li");

  // チェックボックスと <label for> を組にすると、
  // テスト側から getByRole("checkbox", { name: text }) で指せるようになる。
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = id;
  checkbox.addEventListener("change", updateRemaining);

  const label = document.createElement("label");
  label.htmlFor = id;
  label.textContent = text;

  // アイコンではなく文字を持たないボタンなので、aria-label で名前を付ける。
  // これで getByRole("button", { name: "牛乳を買う を削除" }) と指定できる。
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.textContent = "削除";
  deleteButton.setAttribute("aria-label", `${text} を削除`);
  deleteButton.addEventListener("click", () => {
    item.remove();
    updateRemaining();
  });

  item.append(checkbox, label, deleteButton);
  list.append(item);
}

// 未完了の件数を数え直して表示する
function updateRemaining() {
  const all = list.querySelectorAll("input[type='checkbox']");
  const done = list.querySelectorAll("input[type='checkbox']:checked");
  remaining.textContent = `残タスク ${all.length - done.length} 件`;
}
