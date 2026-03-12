import { useEffect, useState } from "react";
import { v4 as uuid4 } from "uuid";

import { TaskInput } from "./components/TaskInput/TaskInput";
import { TodoItem } from "./components/TodoItem/TodoItem";

import getFetch from "./utils/getFetch";

export interface Todos {
  _id: string;
  user: string;
  title: string;
  isFinished: boolean;
  priority?: "low" | "medium" | "high";
  reps?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const PAGE_SIZE = 4;

function App() {
  const [todos, setTodos] = useState<Todos[]>([]);
  const [taskInput, setTaskInput] = useState("");
  const [page, setPage] = useState(0);
  const [editTodo, setEditTodo] = useState<Todos>();
  const [priority] = useState<string>("");
  const [isFinished] = useState<boolean | undefined>(undefined);
  const [searchTitle] = useState<string>("");

  console.log(todos);
  const paginationTodos = todos;

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskInput(e.currentTarget.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTodo: Todos = {
      _id: uuid4(),
      user: uuid4(),
      title: taskInput,
      isFinished: false,
    };
    const newTodos = [...todos, newTodo];

    setTaskInput("");
    setTodos(newTodos);
  };

  const handleDelete = (todoId: string) => {
    setTodos((todos) => todos.filter((todo) => todo._id !== todoId));
  };

  const handleEdit = (todoId: string) => {
    const selectedTodo = todos.find((todo) => todo._id === todoId);
    setEditTodo(selectedTodo);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      const params = new URLSearchParams({
        limit: PAGE_SIZE.toString(),
        page: (page + 1).toString(),
      });

      if (priority) params.append("priority", priority);
      if (isFinished !== undefined) {
        params.append("isFinished", String(isFinished));
      }
      if (searchTitle) params.append("title", searchTitle);

      const url = `http://localhost:3000/api/v1/todos?${params.toString()}`;

      const data = await getFetch(url);

      setTodos(data.data.todos);
    };

    fetchTodos();
  }, [isFinished, page, priority, searchTitle]);

  return (
    <>
      <h1 className="text-3xl font-bold">Mori</h1>

      <div className="h-96 w-3xs border-2 border-amber-300">
        {paginationTodos?.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            selectedTodo={editTodo}
            setEditTodo={setEditTodo}
            setTodos={setTodos}
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
