import { createSignal } from "solid-js";

function TodoPage(props: { verifyCookies: () => void }) {
  props.verifyCookies();

  return <>pagina inicial</>;
}

export default TodoPage;
