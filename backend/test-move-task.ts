const API = "http://localhost:5000/api";

// ---- helpers ----
async function request(method: string, path: string, body?: unknown, cookie?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (cookie) headers["Cookie"] = cookie;
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  return { status: res.status, data, headers: res.headers };
}

async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const setCookie = res.headers.get("set-cookie");
  return setCookie?.split(";")[0] ?? "";
}

// ---- state ----
let cookie = "";
let boardId = "";
let columns: { id: string; name: string }[] = [];
let tasks: { id: string; title: string; columnId: string; position: number }[] = [];

const unique = Date.now().toString(36);

async function setup() {
  // Register + login
  await request("POST", "/auth/register", {
    name: `MoveTest ${unique}`,
    email: `movetest_${unique}@test.com`,
    password: "Test1234!",
  });
  cookie = await login(`movetest_${unique}@test.com`, "Test1234!");

  // Create board
  const boardRes = await request("POST", "/boards", { name: `MoveBoard ${unique}` }, cookie);
  boardId = boardRes.data.data.id;

  // Create 3 columns: Todo, InProgress, Done
  for (const name of ["Todo", "InProgress", "Done"]) {
    const colRes = await request("POST", `/boards/${boardId}/columns`, { name }, cookie);
    columns.push({ id: colRes.data.data.id, name });
  }

  // Create tasks in Todo: A(0), B(1), C(2), D(3)
  for (const title of ["A", "B", "C", "D"]) {
    const taskRes = await request(
      "POST",
      `/boards/${boardId}/tasks`,
      { columnId: columns[0].id, title },
      cookie
    );
    tasks.push({
      id: taskRes.data.data.id,
      title: taskRes.data.data.title,
      columnId: taskRes.data.data.columnId,
      position: taskRes.data.data.position,
    });
  }

  // Create tasks in InProgress: E(0), F(1)
  for (const title of ["E", "F"]) {
    const taskRes = await request(
      "POST",
      `/boards/${boardId}/tasks`,
      { columnId: columns[1].id, title },
      cookie
    );
    tasks.push({
      id: taskRes.data.data.id,
      title: taskRes.data.data.title,
      columnId: taskRes.data.data.columnId,
      position: taskRes.data.data.position,
    });
  }

  console.log("Setup complete: board, 3 columns, 6 tasks created.");
}

async function getColumnTasks(columnId: string): Promise<{ id: string; title: string; position: number }[]> {
  const res = await request("GET", `/boards/${boardId}/tasks`, undefined, cookie);
  const allTasks = res.data.data as { id: string; title: string; position: number; columnId: string }[];
  return allTasks
    .filter((t) => t.columnId === columnId)
    .sort((a, b) => a.position - b.position);
}

function verifyPositions(
  testName: string,
  actual: { title: string; position: number }[],
  expected: string[]
) {
  let pass = true;
  if (actual.length !== expected.length) {
    console.log(`  ❌ ${testName}: expected ${expected.length} tasks, got ${actual.length}`);
    return false;
  }
  for (let i = 0; i < expected.length; i++) {
    if (actual[i].title !== expected[i] || actual[i].position !== i) {
      pass = false;
      break;
    }
  }
  if (pass) {
    console.log(`  ✅ ${testName}`);
  } else {
    console.log(`  ❌ ${testName}`);
    console.log(`     Expected: ${expected.join(",")}`);
    console.log(`     Actual:   ${actual.map((t) => `${t.title}(${t.position})`).join(",")}`);
  }
  return pass;
}

// ---- tests ----
let passed = 0;
let failed = 0;

function result(ok: boolean) {
  if (ok) passed++;
  else failed++;
}

async function testSameColumnLastToFirst() {
  console.log("\n--- Same Column: last -> first ---");
  // Current Todo: A(0), B(1), C(2), D(3). Move D to position 0
  const taskD = tasks.find((t) => t.title === "D")!;
  const res = await request(
    "PATCH",
    `/tasks/${taskD.id}/move`,
    { targetColumnId: columns[0].id, targetPosition: 0 },
    cookie
  );
  result(res.status === 200);
  console.log(`  Status: ${res.status} ${res.status === 200 ? "✅" : "❌"}`);

  const col = await getColumnTasks(columns[0].id);
  result(verifyPositions("Order", col, ["D", "A", "B", "C"]));
}

async function testSameColumnFirstToLast() {
  console.log("\n--- Same Column: first -> last ---");
  // Current Todo: D(0), A(1), B(2), C(3). Move D to position 3
  const taskD = tasks.find((t) => t.title === "D")!;
  await request(
    "PATCH",
    `/tasks/${taskD.id}/move`,
    { targetColumnId: columns[0].id, targetPosition: 3 },
    cookie
  );
  const col = await getColumnTasks(columns[0].id);
  result(verifyPositions("Order", col, ["A", "B", "C", "D"]));
}

async function testSameColumnMiddleToMiddle() {
  console.log("\n--- Same Column: middle -> middle ---");
  // Current Todo: A(0), B(1), C(2), D(3). Move A to position 2
  const taskA = tasks.find((t) => t.title === "A")!;
  await request(
    "PATCH",
    `/tasks/${taskA.id}/move`,
    { targetColumnId: columns[0].id, targetPosition: 2 },
    cookie
  );
  const col = await getColumnTasks(columns[0].id);
  result(verifyPositions("Order", col, ["B", "C", "A", "D"]));
  // Restore: move A back to 0
  await request(
    "PATCH",
    `/tasks/${taskA.id}/move`,
    { targetColumnId: columns[0].id, targetPosition: 0 },
    cookie
  );
}

async function testCrossColumnMove() {
  console.log("\n--- Cross Column: Todo -> InProgress ---");
  // Todo: A(0), B(1), C(2), D(3). InProgress: E(0), F(1)
  // Move B to InProgress at position 1
  const taskB = tasks.find((t) => t.title === "B")!;
  await request(
    "PATCH",
    `/tasks/${taskB.id}/move`,
    { targetColumnId: columns[1].id, targetPosition: 1 },
    cookie
  );
  const todo = await getColumnTasks(columns[0].id);
  const inprog = await getColumnTasks(columns[1].id);
  result(verifyPositions("Todo after move", todo, ["A", "C", "D"]));
  result(verifyPositions("InProgress after move", inprog, ["E", "B", "F"]));
}

async function testCrossColumnToPosition0() {
  console.log("\n--- Cross Column: to position 0 ---");
  // Move C (from Todo) to InProgress at position 0
  const taskC = tasks.find((t) => t.title === "C")!;
  await request(
    "PATCH",
    `/tasks/${taskC.id}/move`,
    { targetColumnId: columns[1].id, targetPosition: 0 },
    cookie
  );
  const todo = await getColumnTasks(columns[0].id);
  const inprog = await getColumnTasks(columns[1].id);
  result(verifyPositions("Todo after move", todo, ["A", "D"]));
  result(verifyPositions("InProgress after move", inprog, ["C", "E", "B", "F"]));
}

async function testMoveIntoEmptyColumn() {
  console.log("\n--- Cross Column: move into empty column (Done) ---");
  // Done column is empty. Move D there at position 0
  const taskDone = tasks.find((t) => t.title === "D")!;
  await request(
    "PATCH",
    `/tasks/${taskDone.id}/move`,
    { targetColumnId: columns[2].id, targetPosition: 0 },
    cookie
  );
  const todo = await getColumnTasks(columns[0].id);
  const done = await getColumnTasks(columns[2].id);
  result(verifyPositions("Todo after move", todo, ["A"]));
  result(verifyPositions("Done after move", done, ["D"]));
}

async function testMoveToEnd() {
  console.log("\n--- Cross Column: move to end (clamped) ---");
  // Move A to Done at position 999 (should clamp to end = position 1)
  const taskA = tasks.find((t) => t.title === "A")!;
  await request(
    "PATCH",
    `/tasks/${taskA.id}/move`,
    { targetColumnId: columns[2].id, targetPosition: 999 },
    cookie
  );
  const done = await getColumnTasks(columns[2].id);
  result(verifyPositions("Done after clamp", done, ["D", "A"]));
}

async function testSecurityUnauthorized() {
  console.log("\n--- Security: unauthenticated user ---");
  const taskA = tasks.find((t) => t.title === "A")!;
  const res = await request("PATCH", `/tasks/${taskA.id}/move`, {
    targetColumnId: columns[2].id,
    targetPosition: 0,
  });
  result(res.status === 401);
  console.log(`  Status: ${res.status} ${res.status === 401 ? "✅" : "❌"}`);
}

async function testSecurityCrossBoard() {
  console.log("\n--- Security: cannot move to another board's column ---");
  // Create another board + column
  const board2Res = await request("POST", "/boards", { name: `Other ${unique}` }, cookie);
  const board2Id = board2Res.data.data.id;
  const col2Res = await request("POST", `/boards/${board2Id}/columns`, { name: "Other" }, cookie);
  const otherColumnId = col2Res.data.data.id;

  const taskA = tasks.find((t) => t.title === "A")!;
  const res = await request(
    "PATCH",
    `/tasks/${taskA.id}/move`,
    { targetColumnId: otherColumnId, targetPosition: 0 },
    cookie
  );
  result(res.status === 400);
  console.log(`  Status: ${res.status} ${res.status === 400 ? "✅" : "❌"}`);
}

async function testSecurityOtherUser() {
  console.log("\n--- Security: other user cannot move task ---");
  // Register a new user
  await request("POST", "/auth/register", {
    name: `Other ${unique}`,
    email: `other_${unique}@test.com`,
    password: "Test1234!",
  });
  const otherCookie = await login(`other_${unique}@test.com`, "Test1234!");

  const taskA = tasks.find((t) => t.title === "A")!;
  const res = await request(
    "PATCH",
    `/tasks/${taskA.id}/move`,
    { targetColumnId: columns[2].id, targetPosition: 0 },
    otherCookie
  );
  result(res.status === 403);
  console.log(`  Status: ${res.status} ${res.status === 403 ? "✅" : "❌"}`);
}

async function main() {
  await setup();

  await testSameColumnLastToFirst();
  await testSameColumnFirstToLast();
  await testSameColumnMiddleToMiddle();
  await testCrossColumnMove();
  await testCrossColumnToPosition0();
  await testMoveIntoEmptyColumn();
  await testMoveToEnd();
  await testSecurityUnauthorized();
  await testSecurityCrossBoard();
  await testSecurityOtherUser();

  console.log(`\n=============================`);
  console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed}`);
  console.log(`=============================`);

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
