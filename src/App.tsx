import { useState } from "react";
import { TaskInput } from "./components/TaskInput/TaskInput";
import { TodoItem } from "./components/TodoItem/TodoItem";

function App() {
  const [todos, setTodos] = useState<string[]>([]);
  const [taskInput, setTaskInput] = useState("");

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskInput(e.currentTarget.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTodos = [...(todos as string[]), taskInput];

    setTaskInput("");
    setTodos(newTodos);
  };

  const handleDelete = (todoId: number) => {
    setTodos((todos) => todos.filter((_, i) => i !== todoId));
  };

  return (
    <>
      <h1 className="text-3xl font-bold">Mori</h1>

      <div className="h-96 w-3xs border-2 border-amber-300">
        {todos?.map((todo, i) => (
          <TodoItem key={i} todoId={i} todo={todo} onDelete={handleDelete} />
        ))}
      </div>

      <TaskInput
        onSubmit={handleSubmit}
        onTaskChange={handleTaskChange}
        taskInput={taskInput}
      />
    </>
  );
}

export default App;
