"use client";

import React, { useContext, useState } from "react";
import { CirclePlus } from "lucide-react";
import { TaskInt } from "@/utils/interfaces";
import toast from "react-hot-toast";
import creatAxiosInstance from "@/utils/axiosInstance";
import { TaskContext } from "@/context/taskContext";
import { useAllTasksLenth } from "@/utils/hooks";

const AddTask = () => {
  const TaskState = useContext(TaskContext);
  const [addTask, setAddTask] = useState<boolean>(false);
  const [task, setTask] = useState<string>("");
  const totalTasks = useAllTasksLenth();
  const date = new Date();

  const addTaskFunc = async () => {
    try {
      const axiosInstance = creatAxiosInstance();
      const res = await axiosInstance({
        method: "POST",
        url: "api/tasks/create-task/",
        data: {
          task: task,
        },
      });
      if (res.data.success) {
      } else {
        toast.error(res.data.error);
      }
      console.log(res);
    } catch (err) {
      toast.error("something went wrong");
      console.log(err);
    }
  };

  const keyDownHandler = (e) => {
    if (e.key === "Enter") {
      if (task.length === 0) {
        setAddTask(false)
        return;
      }
      let taskExists = false;
      TaskState?.todoTasks.forEach((todoTask) => {
        if (task == todoTask.task) taskExists = true;
      });
      if (taskExists) {
        toast.error("task already exists!");
        return;
      }
      setAddTask(false);
      try {
        const taskObj: TaskInt = {
          id: totalTasks + 1,
          task: task,
          status: "t",
          created_at: date.toDateString(),
          updated_at: date.toDateString(),
        };
        TaskState?.setTodoTasks((prev) => [taskObj, ...prev]);
        toast.success("task added");
        setTask("");
        addTaskFunc();
      } catch (err) {
        toast.error("unable to add new task");
        console.log(err);
      }
    }
  };
  return (
    <div className="group min-h-[100px] max-h-[130px] h-full flex justify-center items-center rounded-md p-2 text-md tracking-wider overflow-auto cursor-pointer bg-gray-100 hover:bg-gray-200">
      {addTask ? (
        <textarea
          className="h-full w-full outline-0"
          placeholder="type your task and hit enter to add and close..."
          onChange={(e) => setTask(e.target.value)}
          value={task}
          onKeyDown={keyDownHandler}
          autoFocus
        ></textarea>
      ) : (
        <CirclePlus
          className="size-[30px] group-hover:size-[35px] duration-200"
          onClick={() => setAddTask(!addTask)}
        />
      )}
    </div>
  );
};

export default AddTask;
