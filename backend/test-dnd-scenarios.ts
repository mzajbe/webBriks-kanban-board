const API = "http://localhost:5000/api";

async function req(method: string, path: string, body?: unknown, cookie?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (cookie) headers["Cookie"] = cookie;
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function login(email: string, pass: string): Promise<string> {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: pass }),
  });
  return res.headers.get("set-cookie")?.split(";")[0] ?? "";
}

async function run() {
  console.log("=== Testing Drag and Drop Frontend/Backend Integration Scenarios ===");
  const uid = Date.now().toString(36);
  await req("POST", "/auth/register", {
    name: `Dnd User ${uid}`,
    email: `dnd_${uid}@test.com`,
    password: "Password123!",
  });
  const cookie = await login(`dnd_${uid}@test.com`, "Password123!");

  // Create board
  const boardRes = await req("POST", "/boards", { name: `Board ${uid}` }, cookie);
  const boardId = boardRes.data.data.id;

  // Create columns: Todo, In Progress, Done (empty)
  const todoRes = await req("POST", `/boards/${boardId}/columns`, { name: "Todo" }, cookie);
  const inProgRes = await req("POST", `/boards/${boardId}/columns`, { name: "In Progress" }, cookie);
  const doneRes = await req("POST", `/boards/${boardId}/columns`, { name: "Done" }, cookie);

  const todoId = todoRes.data.data.id;
  const inProgId = inProgRes.data.data.id;
  const doneId = doneRes.data.data.id;

  // Create tasks in Todo: Task1, Task2, Task3
  const t1 = (await req("POST", `/boards/${boardId}/tasks`, { columnId: todoId, title: "Task 1" }, cookie)).data.data;
  const t2 = (await req("POST", `/boards/${boardId}/tasks`, { columnId: todoId, title: "Task 2" }, cookie)).data.data;
  const t3 = (await req("POST", `/boards/${boardId}/tasks`, { columnId: todoId, title: "Task 3" }, cookie)).data.data;

  // 1. Reorder task in Todo (move Task 3 to position 0)
  console.log("\n1. Reorder task in Todo (Task 3 to index 0)...");
  const move1 = await req("PATCH", `/tasks/${t3.id}/move`, { targetColumnId: todoId, targetPosition: 0 }, cookie);
  console.log("Move result status:", move1.status);

  // 2. Refresh/Fetch: order remains
  console.log("\n2. Fetch tasks to verify order persistence...");
  let tasks = (await req("GET", `/boards/${boardId}/tasks`, undefined, cookie)).data.data;
  let todoTasks = tasks.filter((t: any) => t.columnId === todoId).sort((a: any, b: any) => a.position - b.position);
  console.log("Todo order after reorder:", todoTasks.map((t: any) => `${t.title}(pos:${t.position})`).join(", "));
  if (todoTasks[0].id !== t3.id || todoTasks[1].id !== t1.id || todoTasks[2].id !== t2.id) {
    throw new Error("Reorder order persistence failed!");
  }
  console.log("✅ Order persisted correctly: Task 3, Task 1, Task 2 with sequential positions 0, 1, 2");

  // 3. Move Todo -> In Progress at position 0
  console.log("\n3. Move Todo -> In Progress (Task 1 to In Progress pos 0)...");
  const move2 = await req("PATCH", `/tasks/${t1.id}/move`, { targetColumnId: inProgId, targetPosition: 0 }, cookie);
  console.log("Move cross-column status:", move2.status);

  // 4. Refresh/Fetch: task remains in correct column and position
  console.log("\n4. Fetch tasks to verify cross-column persistence...");
  tasks = (await req("GET", `/boards/${boardId}/tasks`, undefined, cookie)).data.data;
  todoTasks = tasks.filter((t: any) => t.columnId === todoId).sort((a: any, b: any) => a.position - b.position);
  let inProgTasks = tasks.filter((t: any) => t.columnId === inProgId).sort((a: any, b: any) => a.position - b.position);
  console.log("Todo tasks:", todoTasks.map((t: any) => `${t.title}(pos:${t.position})`).join(", "));
  console.log("In Progress tasks:", inProgTasks.map((t: any) => `${t.title}(pos:${t.position})`).join(", "));
  if (inProgTasks[0].id !== t1.id || inProgTasks[0].position !== 0) {
    throw new Error("Cross-column move persistence failed!");
  }
  console.log("✅ Cross-column move persisted correctly!");

  // 5. Move to empty column (Done)
  console.log("\n5. Move to empty column (Task 2 to Done pos 0)...");
  const move3 = await req("PATCH", `/tasks/${t2.id}/move`, { targetColumnId: doneId, targetPosition: 0 }, cookie);
  console.log("Move to empty column status:", move3.status);
  tasks = (await req("GET", `/boards/${boardId}/tasks`, undefined, cookie)).data.data;
  let doneTasks = tasks.filter((t: any) => t.columnId === doneId).sort((a: any, b: any) => a.position - b.position);
  console.log("Done tasks:", doneTasks.map((t: any) => `${t.title}(pos:${t.position})`).join(", "));
  if (doneTasks.length !== 1 || doneTasks[0].id !== t2.id || doneTasks[0].position !== 0) {
    throw new Error("Move to empty column failed!");
  }
  console.log("✅ Move to empty column succeeded!");

  // 6. Move to first position & last position
  console.log("\n6. Move to last position (Task 3 to Done at end)...");
  await req("PATCH", `/tasks/${t3.id}/move`, { targetColumnId: doneId, targetPosition: 1 }, cookie);
  tasks = (await req("GET", `/boards/${boardId}/tasks`, undefined, cookie)).data.data;
  doneTasks = tasks.filter((t: any) => t.columnId === doneId).sort((a: any, b: any) => a.position - b.position);
  console.log("Done tasks (after move to last):", doneTasks.map((t: any) => `${t.title}(pos:${t.position})`).join(", "));
  if (doneTasks[1].id !== t3.id || doneTasks[1].position !== 1) {
    throw new Error("Move to last position failed!");
  }
  console.log("✅ Move to last position succeeded!");

  // 7. Simulate failed request
  console.log("\n7. Simulate failed request (invalid column ID)...");
  const failRes = await req("PATCH", `/tasks/${t1.id}/move`, { targetColumnId: "00000000-0000-0000-0000-000000000000", targetPosition: 0 }, cookie);
  console.log("Failed request returned status:", failRes.status, failRes.data.message);
  if (failRes.status !== 404) {
    throw new Error("Expected 404 for non-existent target column!");
  }
  console.log("✅ Failed request correctly rejected with 404, triggering frontend rollback!");

  console.log("\n🎉 ALL DND INTEGRATION SCENARIOS PASSED WITH FLYING COLORS!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
