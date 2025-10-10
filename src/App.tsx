import { useState } from "react";

function App() {
  const [todos, setTodos] = useState<string[]>([]);
  const [taskInput, setTaskInput] = useState("");

  const onTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskInput(e.currentTarget.value);
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const newTodos = [...(todos as string[]), taskInput];

    setTodos(newTodos);
  };

  console.log(todos);

  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>

      <div className="h-96 w-3xs border-2 border-amber-300">
        {todos?.map((todo) => (
          <p className="bg-red-400">{todo}</p>
        ))}
      </div>

      <form>
        <input
          type="text"
          placeholder="Write task..."
          onChange={onTaskChange}
        />

        <button onClick={handleConfirm}>Add Task</button>
      </form>
    </>
  );
}

export default App;
