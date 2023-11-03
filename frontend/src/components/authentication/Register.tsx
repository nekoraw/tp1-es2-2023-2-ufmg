import { createSignal, onMount } from "solid-js";
import styles from "./login.module.css";
import Cookies from "js-cookie";
import { A, useNavigate } from "@solidjs/router";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

function InvalidUserMessage() {
  return (
    <>
      <div class={`${styles.error_message} ${styles.bottom_form_text}}`}>
        Usuário já existe.
      </div>
    </>
  );
}

function InvalidEmailMessage() {
  return (
    <>
      <div class={`${styles.error_message} ${styles.bottom_form_text}}`}>
        E-mail está no formato incorreto.
      </div>
    </>
  );
}

function RegisterPage() {
  const [validUser, setValidUser] = createSignal(true);
  const [validEmail, setValidEmail] = createSignal(true);
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [email, setEmail] = createSignal("");
  const navigate = useNavigate();

  onMount(async () => {
    if (Cookies.get("$session") !== undefined) {
      navigate("/", { replace: true });
    }
  });

  const handleLogin = () => {
    if (!emailRegex.test(email())) {
      setValidEmail(false);
      return;
    }

    const data: RegisterRequest = {
      username: username(),
      password: password(),
      email: email(),
    };
    fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.status === 422) {
        setValidEmail(false);
      } else if (response.status === 409) {
        setValidUser(false);
      } else if (response.status === 201) {
        window.alert("Usuário criado com sucesso.");
        navigate("/login", { replace: true });
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
            <h1>Registro</h1>
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

            <div class={styles.login_field}>
              <input
                name="email"
                type="email"
                class={`${styles.text_input} ${!validEmail() && styles.error}`}
                onInput={(obj) => setEmail(obj.target.value)}
                onBeforeInput={() => setValidEmail(true)}
                placeholder="endereço de e-mail"
              />
              {!validEmail() && <InvalidEmailMessage />}
            </div>

            <div class={styles.password_field}>
              <input
                name="password"
                type="password"
                class={styles.password_input}
                onInput={(obj) => setPassword(obj.target.value)}
                placeholder="senha"
              />
            </div>

            <div class={styles.login_submit}>
              <input
                type="button"
                class={styles.submit_button}
                onClick={handleLogin}
                value="Registrar"
              />
            </div>
          </form>

          <div class={styles.bottom_form_text}>
            Já possui uma conta?
            <A href="/login" class={styles.change_auth_page}>
              Faça login.
            </A>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
