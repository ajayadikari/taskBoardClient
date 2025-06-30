"use client";

import React, { SetStateAction, useState } from "react";
import {
  AlarmClockCheck,
  SquarePen,
  Trash,
  Check,
  CircleEllipsis,
  X,
} from "lucide-react";
import { useDeleteTaskHook, useTaskStatusUpdateHook } from "@/utils/hooks";
import createAxiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import { TaskInt } from "@/utils/interfaces";
import cn from "@/utils/cn";

const OptionBar = ({
  status,
  id,
  container,
  setIsUpdateTask,
  isUpdateTask,
  task,
  showOptionBar,
}: {
  status: number;
  id: number;
  container: number;
  setIsUpdateTask: React.Dispatch<SetStateAction<boolean>>;
  isUpdateTask: boolean;
  task: TaskInt;
  showOptionBar: boolean;
}) => {
  const deleteTask = useDeleteTaskHook();
  const upadateTaskStatusHandler = useTaskStatusUpdateHook();
  const [showBar, setShowBar] = useState(false);
  const deleteActionHandler = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      const res = await axiosInstance({
        method: "delete",
        url: `api/tasks/delete-task/${id}/`,
      });
      if (!res.data.success) toast.success("task deletion failed");
    } catch (err) {
      console.log(err);
      toast.error("task deletion failed");
    }
  };

  return (
    <div
      className={cn(
        `hidden md:group-hover:flex justify-between items-center w-full bg-gray-50 p-1 rounded`,
        showOptionBar ? "flex" : ""
      )}
    >
      <div className="flex gap-2">
        {status !== 1 && (
          <AlarmClockCheck
            onClick={() => upadateTaskStatusHandler(task, 1, container)}
            className="text-gray-500 cursor-pointer"
          />
        )}
        {status !== 2 && (
          <CircleEllipsis
            onClick={() => upadateTaskStatusHandler(task, 2, container)}
            className="text-red-500 cursor-pointer"
          />
        )}
        {status !== 3 && (
          <Check
            onClick={() => upadateTaskStatusHandler(task, 3, container)}
            className="text-green-600 cursor-pointer"
          />
        )}
      </div>
      <div className="flex gap-2">
        {!isUpdateTask && (
          <SquarePen
            className="cursor-pointer"
            onClick={() => {
              setIsUpdateTask(true);
            }}
          />
        )}
        <Trash
          onClick={() => {
            deleteTask(id, container);
            deleteActionHandler();
          }}
          className="cursor-pointer"
        />
        {isUpdateTask && (
          <X
            className="text-red-600 cursor-pointer"
            onClick={() => setIsUpdateTask(false)}
          />
        )}
      </div>
    </div>
  );
};

export default OptionBar;
