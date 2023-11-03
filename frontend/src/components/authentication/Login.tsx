import { createSignal, onMount } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import styles from "./login.module.css";
import Cookies from "js-cookie";

function InvalidUserMessage() {
  return (
    <>
      <div class={`${styles.error_message} ${styles.bottom_form_text}}`}>
        Usuário não existe.
      </div>
    </>
  );
}

function InvalidPasswordMessage() {
  return (
    <>
      <div class={`${styles.error_message} ${styles.bottom_form_text}}`}>
        Senha incorreta.
      </div>
    </>
  );
}

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  username: string;
  session: string;
  expires_in: number;
}

function LoginPage() {
  const [validUser, setValidUser] = createSignal(true);
  const [validPassword, setValidPassword] = createSignal(true);
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const navigate = useNavigate();

  onMount(async () => {
    if (Cookies.get("$session") !== undefined) {
      navigate("/", { replace: true });
    }
  });

  const handleLogin = () => {
    const data: LoginRequest = { username: username(), password: password() };
    fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (response) => {
      const data: LoginResponse = await response.json();
      if (response.status === 403) {
        setValidPassword(false);
      } else if (response.status === 404) {
        setValidUser(false);
      } else if (response.status === 200) {
        // tem q definir mais coisas em produção para nao ter problemas de csrf e tals
        document.cookie = `$session=${data.session}; expires=${new Date(
          data.expires_in * 1000
        ).toUTCString()}; path=/;`;
        window.alert("Logado com sucesso.");
        navigate("/home", { replace: true });
      } else {
        window.alert("Erro interno de servidor.");
      }
    });
  };

  return (
    <>
      <div class={styles.login_frame}>
        <div class={styles.login_form}>
          <div class={styles.login_header}>
            <h1>Login</h1>
          </div>

          <form action="post" autocomplete="off">
            <div class={styles.login_field}>
              <input
                name="username"
                type="text"
                class={`${styles.text_input} ${!validUser() && styles.error}`}
                onInput={(obj) => setUsername(obj.target.value)}
                onBeforeInput={() => setValidUser(true)}
                placeholder="nome de usuário"
                maxlength="16"
              />
              {!validUser() && <InvalidUserMessage />}
            </div>

            <div class={styles.password_field}>
              <input
                name="password"
                type="password"
                class={`${styles.password_input} ${
                  !validPassword() && styles.error
                }`}
                onInput={(obj) => setPassword(obj.target.value)}
                onBeforeInput={() => setValidPassword(true)}
                placeholder="senha"
              />
              {!validPassword() && <InvalidPasswordMessage />}
            </div>

            <div class={styles.login_submit}>
              <input
                type="button"
                class={styles.submit_button}
                onClick={handleLogin}
                value="Entrar"
              />
            </div>
          </form>

          <div class={styles.bottom_form_text}>
            Não possui uma conta?
            <A href="/register" class={styles.change_auth_page}>
              Registre-se agora!
            </A>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
