import type { Todos } from "../../App";

interface TodoItemProps {
  todo: Todos;
  todoId: string;
  onDelete: (todoId: string) => void;
  onEdit: (todoId: string) => void;
}

export const TodoItem = ({ todo, todoId, onDelete, onEdit }: TodoItemProps) => {
  return (
    <div className="flex justify-between p-2">
      <p className="text-indigo-700">{todo.title}</p>

      <div className="flex gap-7">
        <button
          className="cursor-pointer font-bold text-emerald-800"
          onClick={() => onEdit(todoId)}
        >
          /
        </button>

        <button
          className="cursor-pointer text-red-600"
          onClick={() => onDelete(todoId)}
        >
          X
        </button>
      </div>
    </div>
  );
};
