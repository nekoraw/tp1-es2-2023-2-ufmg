import Cookies from "js-cookie";
import { createSignal, Setter } from "solid-js";
import { taskAlertMessage } from "./TaskStructure";
import { Task } from "./TaskStructure";
import { Tasks } from "./TaskStructure";
import styles from "./todopage.module.css";

export function AddTaskComponent(props: { setTasks: Setter<Tasks> }) {
  const [taskName, setTaskName] = createSignal("");
  const [taskIsCompleted, setTaskIsCompleted] = createSignal(false);

  const addTask = (name: string, is_done: boolean) => {
    name = name.trim();
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
      const message = taskAlertMessage(response.status);
      if (message !== "") {
        window.alert(message);
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
