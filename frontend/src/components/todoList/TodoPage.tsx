import { createSignal, onMount, For, createEffect, Setter } from "solid-js";
import styles from "./todopage.module.css";
import Cookies from "js-cookie";

interface Tasks {
  id: string;
  username: string;
  items: Task[];
}

interface Task {
  name: string;
  is_done: boolean;
}

async function getUserTasks() {
  const response = await fetch("http://127.0.0.1:8000/get_list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Session: `${Cookies.get("$session")}`,
    },
  });
  const data = await response.json();
  return data;
}

function countTaskCompletion(tasks: Task[]) {
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

function AddTaskComponent(props: { setTasks: Setter<Tasks> }) {
  const [taskName, setTaskName] = createSignal("");
  const [taskIsCompleted, setTaskIsCompleted] = createSignal(false);

  const addTask = (name: string, is_done: boolean) => {
    if (name.length === 0) {
      window.alert("O nome não pode ser vazio.");
      return;
    }

    const data: Task = { name, is_done };
    fetch(`http://127.0.0.1:8000/add_item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Session: `${Cookies.get("$session")}`,
      },
      body: JSON.stringify(data),
    }).then(async (response) => {
      const data = await response.json();
      if (response.status === 409) {
        window.alert("Já existe uma tarefa com esse nome.");
        return;
      } else if (response.status === 422) {
        window.alert("A sua entrada não é válida.");
        return;
      } else if (response.status !== 201) {
        window.alert("Erro inesperado no servidor.");
        return;
      }
      props.setTasks(data);
    });
    setTaskName("");
    setTaskIsCompleted(false);
  };

  return (
    <>
      <div class={styles.add_form}>
        <div class={styles.box_header}>Adicionar tarefa</div>
        <form class={styles.add_form}>
          <div class={styles.input_label}>
            Nome da tarefa:
            <input
              type="text"
              value={taskName()}
              class={styles.text_input}
              onInput={(obj) => setTaskName(obj.target.value)}
            />
          </div>
          <div class={styles.buttons}>
            <div class={styles.checkbox}>
              Marcar como concluído:
              <input
                type="checkbox"
                checked={taskIsCompleted()}
                class={styles.checkbox}
                onChange={(obj) => setTaskIsCompleted(obj.target.checked)}
              />
            </div>
            <div class={styles.add_button}>
              <input
                type="button"
                class={styles.add_button}
                onClick={() => {
                  addTask(taskName(), taskIsCompleted());
                }}
                value="Adicionar"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

function TaskComponent(props: { setTasks: Setter<Tasks>; task: Task }) {
  const deleteTask = (item_name: string) => {
    fetch(`http://127.0.0.1:8000/remove_item?item_name=${item_name}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Session: `${Cookies.get("$session")}`,
      },
    }).then(async (response) => {
      const data = await response.json();
      if (response.status === 404) {
        window.alert("Essa tarefa não existe.");
        return;
      } else if (response.status !== 200) {
        window.alert("Erro inesperado no servidor.");
        return;
      }
      props.setTasks(data);
    });
  };

  const changeTaskCompletion = (item_name: string, status: boolean) => {
    fetch(
      `http://127.0.0.1:8000/change_item_status?item_name=${item_name}&status=${status}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Session: `${Cookies.get("$session")}`,
        },
      }
    ).then(async (response) => {
      const data = await response.json();
      if (response.status === 404) {
        window.alert("Essa tarefa não existe.");
        return;
      } else if (response.status !== 200) {
        window.alert("Erro inesperado no servidor.");
        return;
      }
      props.setTasks(data);
    });
  };

  return (
    <>
      <div
        class={`${styles.task} ${
          props.task.is_done ? styles.complete_task : styles.incomplete_task
        }`}
      >
        <div class={styles.item_name}>
          <input
            type="button"
            onclick={() => {
              changeTaskCompletion(props.task.name, !props.task.is_done);
            }}
            class={styles.check_complete_button}
            value="✅"
          />
          {props.task.name}
        </div>
        <div class={styles.item_right}>
          <input
            type="button"
            onclick={() => {
              deleteTask(props.task.name);
            }}
            class={styles.delete_button}
            value="❌"
          />
        </div>
      </div>
    </>
  );
}

function TodoPage(props: { verifyCookies: () => void }) {
  const [tasks, setTasks] = createSignal<Tasks>({
    id: "",
    username: "",
    items: [],
  });
  const [nCompleteTasks, setNCompleteTasks] = createSignal(0);
  const [nIncompleteTasks, setNIncompleteTasks] = createSignal(0);
  const [username, setUsername] = createSignal("");

  onMount(async () => {
    props.verifyCookies();
    setTasks(await getUserTasks());
  });

  createEffect(async () => {
    const [completed, incomplete] = countTaskCompletion(tasks().items);
    setNCompleteTasks(completed);
    setNIncompleteTasks(incomplete);
    setUsername(tasks().username);
  });

  return (
    <>
      <div class={styles.main_page}>
        <div class={styles.header}>
          <div class={styles.header_title}>
            <h2>Lista de tarefas do {username()}</h2>
            <h5>Tarefas concluídas: {nCompleteTasks()}</h5>
            <h5>Tarefas incompletas: {nIncompleteTasks()}</h5>
          </div>
          <AddTaskComponent setTasks={setTasks} />
        </div>

        <hr class={styles.rounded} />

        <div class={styles.tasks}>
          <For each={tasks().items} fallback={<p>Não há itens.</p>}>
            {(task) => <TaskComponent task={task} setTasks={setTasks} />}
          </For>
        </div>
      </div>
    </>
  );
}

export default TodoPage;
