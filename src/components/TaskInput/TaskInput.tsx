interface TaskInputProps {
  onSubmit: (e: React.FormEvent) => void;
  onTaskChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  taskInput: string;
}

export const TaskInput = ({
  onSubmit,
  onTaskChange,
  taskInput,
}: TaskInputProps) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Write task..."
        value={taskInput}
        onChange={onTaskChange}
      />

      <button>Add Task</button>
    </form>
  );
};
