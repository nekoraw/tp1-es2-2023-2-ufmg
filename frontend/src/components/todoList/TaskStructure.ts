export interface Tasks {
  id: string;
  username: string;
  items: Task[];
}

export interface Task {
  name: string;
  is_done: boolean;
}

export function countTaskCompletion(tasks: Task[]) {
  let completed = 0;
  let incomplete = 0;
  for (let x = 0; x < tasks.length; x++) {
    if (tasks[x].is_done) {
      completed++;
    } else {
      incomplete++;
    }
  }
  return [completed, incomplete];
}

export function taskAlertMessage(statusCode: number): string {
  if (statusCode === 409) {
    return "Já existe uma tarefa com esse nome.";
  } else if (statusCode === 422) {
    return "A sua entrada não é válida.";
  } else if (statusCode === 404) {
    return "Essa tarefa não existe.";
  } else if (statusCode >= 500) {
    return "Erro inesperado no servidor.";
  } else {
    return "";
  }
}
