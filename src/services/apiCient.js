// "use client";
import axios from "axios";

const ApiClient = () => {
  const baseURL = "http://localhost:8882/api/v1.0.1/";
  console.log("base url", baseURL);

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
      return Promise.reject(error.response);
    }
  );

  return instance;
};

export default ApiClient();
