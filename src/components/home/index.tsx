"use client";

import Item from "@/components/Item";
import NavBar from "@/components/nav";
// import { todoDummy, doneDummy, inprogressDummy } from "@/utils/dummy";
import { useContext, useEffect, useState } from "react";
import { DraggedElement } from "@/utils/interfaces";
import toast from "react-hot-toast";
import createAxiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import AddTask from "@/components/Item/AddTask";
import { TaskContext } from "@/context/taskContext";
import { AxiosInstance } from "axios";
import { useTaskStatusUpdateHook } from "@/utils/hooks";

export default function Home() {
  const TaskState = useContext(TaskContext);
  const taskStatusUpdate = useTaskStatusUpdateHook();

  const [currDraggedEle, setCurrentDraggedEle] =
    useState<DraggedElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        toast.error("login required");
        router.push("/auth");
      }
    } catch (err) {
      toast.error("unable to get access token from local storage");
      console.log(err);
    }
  }, [router]);

  useEffect(() => {
    const fetchTasks = async () => {
      const axiosInstance: AxiosInstance = createAxiosInstance();
      try {
        const res = await axiosInstance({
          method: "GET",
          url: "api/tasks/get-all-tasks",
        });

        TaskState?.setTodoTasks(res.data.tasks.todo_tasks);
        TaskState?.setInProgressTasks(res.data.tasks.inprogress_tasks);
        TaskState?.setDoneTasks(res.data.tasks.done_tasks);
        console.log(res.data.tasks.todo_tasks);
      } catch (err) {
        toast.error("unable to fetch tasks");
        console.log(err);
      }
    };

    fetchTasks();
  }, []);

  const dropHandler = (
    e: React.DragEvent<HTMLDivElement>,
    container: number
  ) => {
    e.preventDefault();
    if (currDraggedEle?.container === container) return;
    if (!currDraggedEle) return;

    taskStatusUpdate(currDraggedEle.task, container, currDraggedEle?.container);

    setCurrentDraggedEle(null);
  };

  const dragOverHandler = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  return (
    <div className="h-screen bg-gray-100">
      <NavBar />
      <div className="grid grid-cols-1 gap-5 h-[calc(100vh-100px)] mt-[25px] overflow-y-auto px-[50px] md:grid-cols-2 lg:grid-cols-3">
        <div
          onDrop={(e) => dropHandler(e, 1)}
          onDragOver={dragOverHandler}
          className="flex flex-col h-[calc(100vh-100px)] bg-white shadow-lg border-gray-300 border-t-4 rounded-t"
        >
          <h1 className="w-full text-center text-2xl font-bold h-[50px] flex justify-center items-center">
            To Do
          </h1>
          <div className="p-3 flex flex-col gap-1 overflow-y-auto hide-scrollbar h-[calc(100%-50px)]">
            <AddTask />
            {TaskState && TaskState?.todoTasks.length > 0 ? (
              TaskState?.todoTasks.map((task, i) => (
                <Item
                  task={task}
                  key={i}
                  container={1}
                  setCurrentDraggedEle={setCurrentDraggedEle}
                  status={1}
                />
              ))
            ) : (
              <p>what are your tasks today?</p>
            )}
          </div>
        </div>

        <div
          onDrop={(e) => dropHandler(e, 2)}
          onDragOver={dragOverHandler}
          className="h-[calc(100vh-100px)] overflow-y-auto hide-scrollbar bg-white shadow-lg border-red-200  border-t-4 rounded-t"
        >
          <h1 className="w-full text-center text-2xl font-bold h-[50px] flex items-center justify-center">
            In Progress
          </h1>
          <div className="p-4 flex flex-col gap-1 overflow-y-auto hide-scrollbar h-[calc(100%-50px)]">
            {TaskState && TaskState?.inProgressTasks?.length > 0 ? (
              TaskState?.inProgressTasks?.map((task, i) => (
                <Item
                  task={task}
                  key={i}
                  container={2}
                  setCurrentDraggedEle={setCurrentDraggedEle}
                  status={2}
                />
              ))
            ) : (
              <p>start some tasks</p>
            )}
          </div>
        </div>

        <div
          onDrop={(e) => dropHandler(e, 3)}
          onDragOver={dragOverHandler}
          className="flex flex-col gap-1 h-[calc(100vh-100px)] overflow-y-auto hide-scrollbar bg-white shadow-lg border-t-4 rounded-t border-green-200"
        >
          <h1 className="w-full text-center text-2xl font-bold h-[50px] flex items-center justify-center">
            Done
          </h1>
          <div className="p-3 flex flex-col gap-1 overflow-y-auto hide-scrollbar h-[calc(100%-50px)]">
            {TaskState && TaskState?.doneTasks?.length > 0 ? (
              TaskState &&
              TaskState?.doneTasks?.map((task, i) => (
                <Item
                  task={task}
                  key={i}
                  container={3}
                  setCurrentDraggedEle={setCurrentDraggedEle}
                  status={3}
                />
              ))
            ) : (
              <p>you didnt complete any task</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
