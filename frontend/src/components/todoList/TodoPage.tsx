import { createSignal, onMount, For, createEffect } from "solid-js";
import styles from "./todopage.module.css";
import { AddTaskComponent } from "./AddTaskComponent";
import { TaskComponent } from "./TaskComponent";
import { Tasks } from "./TaskStructure";
import { countTaskCompletion } from "./TaskStructure";
import Cookies from "js-cookie";

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
