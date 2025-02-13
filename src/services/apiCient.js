// "use client";
import axios from "axios";

const ApiClient = () => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  const instance = axios?.create({
    baseURL,
  });

  instance.interceptors.request.use(async (request) => {
    request.headers["token"] = "qdt8WHF5ecw-ayv.gmy" || "";

    return request;
  });

  instance.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      return Promise.reject(error.response.data.message);
    }
  );

  return instance;
};

export default ApiClient();
