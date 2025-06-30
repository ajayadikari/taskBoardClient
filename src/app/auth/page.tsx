"use client";

import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import createAxiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { server } from "@/utils/constants";
import { decodeJwtAndStore } from "@/utils/helper";

const Page = () => {
  const router = useRouter();
  const axiosInstance = createAxiosInstance();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) router.push("/");
  }, [router]);

  const loginHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      const res = await axiosInstance({
        method: "POST",
        url: "api/auth/login/",
        data: formData,
      });
      if (res.status === 200) {
        decodeJwtAndStore(res.data.access)
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        router.push("/");
      } else {
        toast.error("login failed");
      }
    } catch (err) {
      toast.error("login failed");
      console.log(err);
    }
  };

  const registerHandler = async (e) => {
    const isOnlyLetters = (str: string) => /^[A-Za-z]+$/.test(str);
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      if (formData.get("username") === null) {
        toast.error("username cannot be empty!");
        return;
      }
      if (isOnlyLetters(formData.get("password") + "")) {
        toast.error("password should be a mix of letters and numbers");
        return;
      }
      if (formData.get("cpass") != formData.get("password")) {
        toast.error("password and confirm password should match!");
        return;
      }
      interface DataInt {
        username: string, 
        first_name: string, 
        last_name: string, 
        password: string
      }
      const data: DataInt = {} as DataInt

      for(const [key, value] of formData.entries()){
        if(key == 'cpass') continue
        data[key] = value
      }
      const res = await axios({
        method: "post",
        url: `${server}/api/auth/register/`,
        data: data,
      });
      if (!res.data.success) {
        toast.error("registration failed");
        console.log(res);
      } else {
        toast.success("registration successful, please login");
      }
    } catch (err) {
      toast.error("registration failed");
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Tabs defaultValue="login">
        <TabsList>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register"> Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card className="w-[300px] p-3">
            <CardTitle>Login</CardTitle>
            <CardDescription>Already a user? please login.</CardDescription>
            <CardContent className="p-1">
              <form
                onSubmit={(e) => loginHandler(e)}
                method="post"
                className="flex flex-col gap-1"
              >
                <input
                  placeholder="Enter your username..."
                  required
                  name="username"
                  type="text"
                  autoFocus
                  className="outline-0 p-2 bg-gray-50"
                ></input>
                <input
                  name="password"
                  required
                  placeholder="enter your password..."
                  type="password"
                  className="outline-0 p-2 bg-gray-50 mb-4"
                ></input>
                <Button type="submit">Login</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card className="w-[300px] p-3">
            <CardTitle>Register</CardTitle>
            <CardDescription>Not a member? register here.</CardDescription>
            <CardContent className="p-1">
              <form
                onSubmit={registerHandler}
                method="post"
                className="flex flex-col gap-1"
              >
                <Input
                  placeholder="Enter your username..."
                  required
                  name="username"
                  type="text"
                ></Input>
                <Input
                  name="first_name"
                  placeholder="Enter your first name..."
                  className="outline-0 p-2 bg-gray-50"
                  type="text"
                ></Input>
                <Input
                  name="last_name"
                  placeholder="Enter your last name..."
                  className="outline-0 p-2 bg-gray-50"
                  type="text"
                ></Input>
                <Input
                  name="password"
                  required
                  placeholder="enter your password..."
                  className="outline-0 p-2 bg-gray-50"
                  type="password"
                ></Input>
                <Input
                  name="cpass"
                  required
                  placeholder="enter your password again..."
                  className="outline-0 p-2 bg-gray-50"
                  type="password"
                ></Input>
                <Button className="mt-4" type="submit">
                  Register
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
