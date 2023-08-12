import { For, createSignal } from "solid-js";
import { useTodos } from "../hooks/useTodo";
import axios from "axios";

interface TodoSchema {
  operation: "add" | "remove" | "change";
  todo: {
    id: string;
    title: string;
    content: string;
  };
}

function Todo() {
  const { getTodos, addTodo, removeTodo, changeTodoTitle } = useTodos();

  const [message, setMessage] = createSignal<string>("");

  async function handleSend() {
    recognition.stop();

    const { data } = await axios.post("/api/chat", {
      message: message(),
      todos: JSON.stringify(getTodos()),
    });

    // mock

    // const data: TodoSchema = {
    //   operation: "change",
    //   todo: {
    //     id: "1",
    //     title: "明天和小蔡去吃饭",
    //     content: "",
    //   },
    // };

    const { operation, todo } = data;

    switch (operation) {
      case "add":
        addTodo(todo.title);
        break;
      case "remove":
        removeTodo(todo.id);
        break;
      case "change":
        changeTodoTitle(todo.id, todo.title);
        break;
      default:
        break;
    }
  }

  function handleSpeech() {
    console.log("speech");

    recognition.start();
    recognition.onresult = function (e) {
      setMessage(e.results[0][0].transcript);
    };
  }

  return (
    <div>
      <input
        value={message()}
        type="text"
        onchange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSend}>send</button>
      <button onClick={handleSpeech}>🔊</button>
      <div>
        <ul>
          <For each={getTodos()}>{(todo) => <li>{todo.title}</li>}</For>
        </ul>
      </div>
    </div>
  );
}

export default Todo;
