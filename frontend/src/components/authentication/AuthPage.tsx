import { createSignal } from "solid-js";
import LoginPage from "./Login";
import RegisterPage from "./Register";

function AuthPage(props: { isLogin?: boolean }) {
  const startingValue = props.isLogin === undefined ? true : props.isLogin;
  const [isLoginPage, _] = createSignal(startingValue);

  return <>{isLoginPage() ? <LoginPage /> : <RegisterPage />}</>;
}

export default AuthPage;
