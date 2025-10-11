interface TodoItemProps {
  todo: string;
  todoId: number;
  onDelete: (todoId: number) => void;
}

export const TodoItem = ({ todo, onDelete, todoId }: TodoItemProps) => {
  return (
    <div className="flex justify-between p-2">
      <p className="text-indigo-700">{todo}</p>
      <button
        className="cursor-pointer text-red-600"
        onClick={() => onDelete(todoId)}
      >
        X
      </button>
    </div>
  );
};
