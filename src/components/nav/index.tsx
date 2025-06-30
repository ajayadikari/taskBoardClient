import React from "react";
import { DoorOpen, ArrowDownToLine } from "lucide-react";
import createAxiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";

const Index = () => {
  const axiosInstance = createAxiosInstance();
  const router = useRouter();
  async function downloadReportHandler() {
    try {
      const userId = localStorage.getItem('id')
      const res = await axiosInstance.get(`/api/board/${userId}/export-pdf/`, {
        responseType: "blob",
      });

      console.log("Status:", res.status);
      if (res.status !== 200) {
        throw new Error(`Failed to download: ${res.status}`);
      }

      const blob = res.data;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "board_report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to download PDF.");
    }
  }

  return (
    <div className="w-full h-[50px] bg-black flex justify-between items-center px-4">
      <h1 className="text-blue-200 text-2xl">TaskBoard App</h1>
      <p className="text-red-300 hidden md:block">you can drag and drop task to update status</p>
      <div className="flex items-center gap-2 cursor-pointer">
        <ArrowDownToLine
          onClick={downloadReportHandler}
          className="text-white hover:text-blue-200 duration-100"
        />
        <div className="group bg-black hover:bg-gray-200 rounded-full p-1 duration-200 ease-in-ou">
          <DoorOpen
            onClick={() => {
              localStorage.clear();
              router.push("/auth");
            }}
            className="text-white group-hover:text-black duration-200"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
