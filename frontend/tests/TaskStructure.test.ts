import {
  countTaskCompletion,
  taskAlertMessage,
} from "../src/components/todoList/TaskStructure";

import { describe, expect, test } from "@jest/globals";

describe("tests Task functions", () => {
  test("test the count completion of tasks", () => {
    const tasks = [
      { name: "whatever", is_done: true },
      { name: "not done!!", is_done: false },
      { name: "finished yesterday!", is_done: true },
    ];

    const [completed, incomplete] = countTaskCompletion(tasks);

    expect(completed).toBe(2);
    expect(incomplete).toBe(1);
  });

  test("tests if the right message is returned when the status code is 409", () => {
    const res = taskAlertMessage(409);
    expect(res).toBe("Já existe uma tarefa com esse nome.");
  });

  test("tests if the right message is returned when the status code is 422", () => {
    const res = taskAlertMessage(422);
    expect(res).toBe("A sua entrada não é válida.");
  });

  test("tests if the right message is returned when the status code is 404", () => {
    const res = taskAlertMessage(404);
    expect(res).toBe("Essa tarefa não existe.");
  });

  test("tests if the right message is returned when the status code is in the error interval", () => {
    let res = taskAlertMessage(500);
    expect(res).toBe("Erro inesperado no servidor.");

    res = taskAlertMessage(503);
    expect(res).toBe("Erro inesperado no servidor.");
  });

  test("tests if the right message is returned when the status code message should not exist", () => {
    let res = taskAlertMessage(200);
    expect(res).toBe("");

    res = taskAlertMessage(201);
    expect(res).toBe("");
  });
});
