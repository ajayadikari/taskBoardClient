"use client";

import { TaskInt, DraggedElement } from "@/utils/interfaces";
import React, { SetStateAction, useEffect, useState } from "react";
import OptionBar from "./OptionBar";
import { useUpdateTaskHook } from "@/utils/hooks";
import createAxiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";

const Index = ({
  task,
  container,
  setCurrentDraggedEle,
  status,
}: {
  task: TaskInt;
  container: number;
  setCurrentDraggedEle: React.Dispatch<SetStateAction<DraggedElement | null>>;
  status: number;
}) => {
  const [date, setDate] = useState<string>("");
  const [isUpdateTask, setIsUpdateTask] = useState<boolean>(false);
  const [updatedTask, setUpdatedTask] = useState<string>(task.task);
  const [showOptionBar, setShowOptionBar] = useState<boolean>(false)
  const updateHandler = useUpdateTaskHook();

  useEffect(() => {
    const updated_at = new Date(task.updated_at).toLocaleDateString();
    setDate(updated_at);
  }, []);

  const dragStartHandler = (e) => {
    setIsUpdateTask(false);
    setUpdatedTask(task.task);
    e.target.style.opacity = "0.5";
    setCurrentDraggedEle({
      task: task,
      container: container,
    });
  };
  const dragEndHandler = (e) => {
    e.target.style.opacity = "1";
  };

  const keyDownHandler = async (e) => {
    if (e.key === "Enter") {
      setIsUpdateTask(false);
      setUpdatedTask(updateHandler(task.id, container, updatedTask));
      try {
        const axiosInstance = createAxiosInstance();
        const res = await axiosInstance({
          method: "PATCH",
          url: `api/tasks/update-task/${task.id}/`,
          data: {
            task: updatedTask,
          },
        });
        if (!res.data.success) {
          toast.error("task updation failed");
          console.log(res);
        }
      } catch (err) {
        toast.error("task updation failed");
        console.log(err);
      }
    }
  };

  return (
    <div
      className="group h-full hover:shadow-md flex flex-col gap-1.5 max-h-[100px] min-h-[100px] rounded-md p-2 text-md tracking-wider overflow-auto cursor-move bg-gray-100 hover:opacity-95 hover:min-h-[150px] duration-200 ease-in-out"
      draggable
      onDragStart={(e) => dragStartHandler(e)}
      onDragEnd={(e) => dragEndHandler(e)}
      onClick={()=>{
        setShowOptionBar(!showOptionBar)
      }}
    >
      <OptionBar
        isUpdateTask={isUpdateTask}
        setIsUpdateTask={setIsUpdateTask}
        container={container}
        id={task.id}
        status={status}
        task={task}
        showOptionBar={showOptionBar}
      />
      {isUpdateTask ? (
        <textarea
          className="h-full w-full outline-0 bg-gray-300 rounded p-1"
          placeholder="edit task and hit enter to add and close..."
          onChange={(e) => setUpdatedTask(e.target.value)}
          value={updatedTask}
          onKeyDown={keyDownHandler}
          autoFocus
        ></textarea>
      ) : (
        <p className="bg-white rounded p-1 min-h-[50px]">{task?.task}</p>
      )}
      <div className=" text-gray-700 px-1 text-end rounded text-[10px]">
        {date}
      </div>
    </div>
  );
};

export default Index;
