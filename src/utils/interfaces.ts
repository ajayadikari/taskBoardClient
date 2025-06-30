import { SetStateAction } from "react";

interface TaskInt {
  id: number;
  task: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface DraggedElement {
  task: TaskInt;
  container: number;
}

interface TaskContextInt {
  todoTasks: TaskInt[];
  setTodoTasks: React.Dispatch<SetStateAction<TaskInt[]>>;
  inProgressTasks: TaskInt[];
  setInProgressTasks: React.Dispatch<SetStateAction<TaskInt[]>>;
  doneTasks: TaskInt[];
  setDoneTasks: React.Dispatch<SetStateAction<TaskInt[]>>;
}

export type { TaskInt, DraggedElement, TaskContextInt };
