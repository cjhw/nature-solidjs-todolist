import { createEffect } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";

interface Todo {
  id: string;
  title: string;
  content: string;
}

interface TodoStore {
  todos: Todo[];
}

const todos: Todo[] = [];
let id = 0;

function createTodosStore(
  initState: Todo[]
): [TodoStore, SetStoreFunction<TodoStore>] {
  const [state, setState] = createStore({ todos: initState });
  if (localStorage.todos) setState(JSON.parse(localStorage.todos));
  createEffect(() => (localStorage.todos = JSON.stringify(state)));
  return [state, setState];
}

export function useTodos() {
  const [state, setState] = createTodosStore(todos);

  const getTodos = () => {
    return state.todos;
  };

  const addTodo = (title: string) => {
    setState((s) => ({
      todos: [
        ...s.todos,
        {
          id: String(id++),
          title,
          content: "",
        },
      ],
    }));
  };

  const removeTodo = (id: string) => {
    setState("todos", (t) => t.filter((t) => t.id !== id));
  };

  const changeTodoTitle = (id: string, newTitle: string) => {
    setState(
      "todos",
      state.todos.findIndex((t) => t.id === id),
      {
        title: newTitle,
      }
    );
  };

  return { getTodos, addTodo, removeTodo, changeTodoTitle };
}
