import axios from "axios";
import { server } from "./constants";

// const accessToken = localStorage.getItem("access");

// const axiosInstance = axios.create({
//   baseURL: server,
//   headers: {
//     Authorization: `Bearer ${accessToken}`,
//   },
// });

const createAxiosInstance  = () => {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access") : null

  return axios.create({
    baseURL: server,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// export default axiosInstance;

export default createAxiosInstance 
