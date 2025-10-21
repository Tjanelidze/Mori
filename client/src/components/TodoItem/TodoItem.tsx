import { useState } from "react";
import type { Todos } from "../../App";

interface TodoItemProps {
  todo: Todos;
  selectedTodo?: Todos;
  setEditTodo: React.Dispatch<React.SetStateAction<Todos | undefined>>;
  setTodos: React.Dispatch<React.SetStateAction<Todos[]>>;
  onDelete: (todoId: string) => void;
  onEdit: (todoId: string) => void;
}

export const TodoItem = ({
  todo,
  onDelete,
  onEdit,
  selectedTodo,
  setEditTodo,
  setTodos,
}: TodoItemProps) => {
  const [isEdit, setIsEdit] = useState(false);

  if (isEdit)
    return (
      <form
        className="flex justify-between p-2"
        onSubmit={(e) => {
          e.preventDefault();

          setIsEdit(false);
          setTodos((prev) => {
            return prev.map((item) => {
              if (item.id === selectedTodo!.id) {
                return selectedTodo!;
              }

              return item;
            });
          });
        }}
      >
        <input
          type="text"
          value={selectedTodo?.title ?? ""}
          onChange={(e) => {
            setEditTodo((prev) =>
              prev ? { ...prev, title: e.target.value } : prev,
            );
          }}
        />

        <button className="cursor-pointer text-red-600">X</button>
      </form>
    );

  return (
    <div className="flex justify-between p-2">
      <p className="text-indigo-700">{todo.title}</p>

      <div className="flex gap-7">
        <button
          className="cursor-pointer font-bold text-emerald-800"
          onClick={() => {
            setIsEdit(true);
            onEdit(todo.id);
          }}
        >
          /
        </button>

        <button
          className="cursor-pointer text-red-600"
          onClick={() => onDelete(todo.id)}
        >
          X
        </button>
      </div>
    </div>
  );
};
