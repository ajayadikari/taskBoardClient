import { createContext, ReactNode, useState } from "react";
import { TaskContextInt, TaskInt } from "@/utils/interfaces";

// Create context with null default
const TaskContext = createContext<TaskContextInt | null>(null);

const TaskContextProvider = ({ children }: { children: ReactNode }) => {
  const [todoTasks, setTodoTasks] = useState<TaskInt[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<TaskInt[]>([]);
  const [doneTasks, setDoneTasks] = useState<TaskInt[]>([]);

  return (
    <TaskContext.Provider
      value={{
        todoTasks,
        setTodoTasks,
        inProgressTasks,
        setInProgressTasks,
        doneTasks,
        setDoneTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// Export context and provider
export { TaskContext, TaskContextProvider };
