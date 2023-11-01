import { createSignal } from "solid-js";
import styles from "./login.module.css"

function InvalidUserMessage() {
  return (
    <>
      <div class={`${styles.error_message} ${styles.bottom_form_text}}`}>Usuário não existe.</div>
    </>
  )
}

function InvalidPasswordMessage() {
  return (
    <>
      <div class={`${styles.error_message} ${styles.bottom_form_text}}`}>Senha incorreta.</div>
    </>
  )
}

function LoginPage() {
  const [validUser, setValidUser] = createSignal(true);
  const [validPassword, setValidPassword] = createSignal(true);

  const userIsValid = () => {
    setValidUser(true);
  }

  const userIsInvalid = () => {
    setValidUser(false);
  }

  const passwordIsValid = () => {
    setValidPassword(true);
  }

  const passwordIsInvalid = () => {
    setValidPassword(false);
  }

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
                onBeforeInput={userIsValid}
                placeholder="nome de usuário"
              />
              {!validUser() && <InvalidUserMessage/>}
            </div>

            <div class={styles.password_field}>
              <input
                name="password"
                type="password"
                class={`${styles.password_input} ${!validPassword() && styles.error}`}
                onBeforeInput={passwordIsValid}
                placeholder="senha"
              />
              {!validPassword() && <InvalidPasswordMessage/>}
            </div>

            <div class={styles.login_submit}>
              <input type="button" class={styles.submit_button} onClick={passwordIsInvalid} value="Entrar" />
            </div>
          </form>

          <div class={styles.bottom_form_text}>
            Não possui uma conta?
            <a href="">Registre-se agora!</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
