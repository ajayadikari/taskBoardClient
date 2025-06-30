import { TaskContext } from "@/context/taskContext";
import { useContext } from "react";
import { TaskInt } from "./interfaces";
import toast from "react-hot-toast";
import createAxiosInstance from "./axiosInstance";

export const useDeleteTaskHook = () => {
  const TaskState = useContext(TaskContext);
  return (id: number, container: number) => {
    if (container === 1) {
      TaskState?.setTodoTasks((prev) => {
        return prev.filter((task) => {
          return task.id !== id;
        });
      });
    }
    if (container === 2) {
      TaskState?.setInProgressTasks((prev) => {
        return prev.filter((task) => {
          return task.id !== id;
        });
      });
    }
    if (container === 3) {
      TaskState?.setDoneTasks((prev) => {
        return prev.filter((task) => {
          return task.id !== id;
        });
      });
    }
  };
};

export const useAllTasksLenth = () => {
  const TaskState = useContext(TaskContext);
  return (
    (TaskState?.doneTasks ? TaskState?.doneTasks?.length : 0) +
    (TaskState?.inProgressTasks ? TaskState?.inProgressTasks?.length : 0) +
    (TaskState?.todoTasks ? TaskState?.todoTasks?.length : 0)
  );
};

export const useUpdateTaskHook = () => {
  const TaskState = useContext(TaskContext);
  return (id: number, container: number, updatedTask: string) => {
    if (container === 1) {
      TaskState?.setTodoTasks((prev) => {
        return prev.map((todoTask) => {
          if (todoTask.id === id) todoTask.task = updatedTask;
          return todoTask;
        });
      });
    } else if (container === 2) {
      TaskState?.setInProgressTasks((prev) => {
        return prev.map((inProgressTask) => {
          if (inProgressTask.id === id) inProgressTask.task = updatedTask;
          return inProgressTask;
        });
      });
    } else {
      TaskState?.setDoneTasks((prev) => {
        return prev.map((doneTask) => {
          if (doneTask.id === id) doneTask.task = updatedTask;
          return doneTask;
        });
      });
    }

    return updatedTask;
  };
};

export const useTaskStatusUpdateHook = () => {
  const TaskState = useContext(TaskContext);
  return (task: TaskInt, container: number, currentContainer: number) => {
    if (currentContainer === 1) {
      TaskState?.setTodoTasks((prev) =>
        prev.filter((todoTask) => todoTask.id !== task.id)
      );
    } else if (currentContainer === 2) {
      TaskState?.setInProgressTasks((prev) =>
        prev.filter((progressTask) => progressTask.id !== task.id)
      );
    } else if (currentContainer === 3) {
      TaskState?.setDoneTasks((prev) =>
        prev.filter((doneTask) => task.id !== doneTask.id)
      );
    }

    if (container === 1) {
      toast.success("task added to list");
      TaskState?.setTodoTasks((prev) => [task, ...prev]);
    } else if (container === 2) {
      toast.success("task is in progress");
      TaskState?.setInProgressTasks((prev) => [task, ...prev]);
    } else if (container === 3) {
      toast.success("task is done");
      TaskState?.setDoneTasks((prev) => [task, ...prev]);
    }

    const updateBackend = async () => {
      try {
        const axiosInstance = createAxiosInstance();
        let status = "";

        if (container === 1) status = "t";
        else if (container === 2) status = "i";
        else status = "d";

        const res = await axiosInstance({
          method: "PATCH",
          url: `api/tasks/update-task-status/${task.id}/${status}/`,
        });

        if (!res.data.success) {
          toast.error("status updation failed");
          console.log(res);
        }
      } catch (err) {
        toast.error("unable to update status");
        console.log(err);
      }
    };

    updateBackend();
  };
};
