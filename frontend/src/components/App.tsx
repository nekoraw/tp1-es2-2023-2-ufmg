import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import Cookies from "js-cookie";
import TodoPage from "./todoList/TodoPage";

function App() {
  const startingValue = Cookies.get("$session") !== undefined;
  const [cookieExists, _] = createSignal(startingValue);
  const navigate = useNavigate();

  const verifyCookie = () => {
    if (!cookieExists()) {
      navigate("/login", { replace: true });
      return;
    }

    fetch("http://127.0.0.1:8000/get_list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Session: `${Cookies.get("$session")}`,
      },
    }).then((response) => {
      if (response.status === 401) {
        navigate("/login", { replace: true });
      } else if (response.status === 200) {
        navigate("/home", { replace: true });
      } else {
        window.alert("Erro interno de servidor.");
      }
    });
  };

  return (
    <>
      <TodoPage verifyCookies={verifyCookie} />
    </>
  );
}

export default App;
