import Cookies from "js-cookie";
import { Setter } from "solid-js";
import { taskAlertMessage } from "./TaskStructure";
import { Task } from "./TaskStructure";
import { Tasks } from "./TaskStructure";
import styles from "./todopage.module.css";

export function TaskComponent(props: { setTasks: Setter<Tasks>; task: Task }) {
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
      const message = taskAlertMessage(response.status);
      if (message !== "") {
        window.alert(message);
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
