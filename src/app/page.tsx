'use client'

import HomeComponent from "@/components/home";
import { TaskContextProvider } from "@/context/taskContext";

export default function Home() {
  return (
    <TaskContextProvider>
      <HomeComponent />
    </TaskContextProvider>
  );
}
