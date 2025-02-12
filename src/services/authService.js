import apiCient from "./apiCient";

const AuthServices = {
  registerApi: (email, password) => {
    return apiCient.post("/auth/signUpWithAuth0", {
      email,
      password,
    });
  },
  loginApi: (data) => {
    return apiCient.post(`/auth/loginWithAuth0`, data);
  },
};

export default AuthServices;
