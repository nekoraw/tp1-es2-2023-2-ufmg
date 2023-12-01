import { createSignal } from "solid-js";
import LoginPage from "./Login";
import RegisterPage from "./Register";
import { evaluatePossiblyUndefinedBoolean } from "./AuthStructure";

function AuthPage(props: { isLogin?: boolean }) {
  const startingValue = evaluatePossiblyUndefinedBoolean(props.isLogin);
  const [isLoginPage, _] = createSignal(startingValue);

  return <>{isLoginPage() ? <LoginPage /> : <RegisterPage />}</>;
}

export default AuthPage;
