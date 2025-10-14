import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { TaskInput } from "./components/TaskInput/TaskInput";
import { TodoItem } from "./components/TodoItem/TodoItem";

import getFetch from "./utils/getFetch";

export interface Todos {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
}

const PAGE_SIZE = 4;

function App() {
  const [todos, setTodos] = useState<Todos[]>([]);
  const [taskInput, setTaskInput] = useState("");
  const [page, setPage] = useState(0);
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const paginationTodos = todos.slice(start, end);

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskInput(e.currentTarget.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTodo: Todos = {
      id: uuidv4(),
      userId: uuidv4(),
      title: taskInput,
      completed: false,
    };
    const newTodos = [...todos, newTodo];

    setTaskInput("");
    setTodos(newTodos);
  };

  const handleDelete = (todoId: string) => {
    setTodos((todos) => todos.filter((todo) => todo.id !== todoId));
  };

  // TODO: implement edit mode
  const handleEdit = (todoId: string) => {};

  useEffect(() => {
    const fetchTodos = async () => {
      const data = await getFetch("https://jsonplaceholder.typicode.com/todos");

      setTodos(data);
    };

    fetchTodos();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold">Mori</h1>

      <div className="h-96 w-3xs border-2 border-amber-300">
        {paginationTodos?.map((todo) => (
          <TodoItem
            key={todo.id}
            todoId={todo.id}
            todo={todo}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>

      <TaskInput
        onSubmit={handleSubmit}
        onTaskChange={handleTaskChange}
        taskInput={taskInput}
      />

      <div className="flex gap-6">
        <button
          onClick={() =>
            setPage((currentPage) => {
              if (currentPage < 1) return currentPage;
              return currentPage - 1;
            })
          }
        >
          Prev
        </button>
        <button
          onClick={() =>
            setPage((currentPage) => {
              return currentPage + 1;
            })
          }
        >
          Next
        </button>
      </div>
    </>
  );
}

export default App;
