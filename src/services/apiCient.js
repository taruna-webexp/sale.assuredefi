// "use client";
import axios from "axios";
import Cookies from "js-cookie";

const ApiClient = () => {
  let token = "";

  try {
    const getUser = Cookies.get("userDetail");
    if (getUser) {
      const extractUser = JSON.parse(decodeURIComponent(getUser));
      token = extractUser?.access_token || "";
    }
  } catch (error) {
    console.error("Error parsing userDetail cookie:", error);
  }

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  const instance = axios.create({
    baseURL,
  });

  instance.interceptors.request.use(async (request) => {
    request.headers["token"] = token;
    return request;
  });

  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      return Promise.reject(
        error?.response?.data?.message || "An error occurred"
      );
    }
  );

  return instance;
};

export default ApiClient();
