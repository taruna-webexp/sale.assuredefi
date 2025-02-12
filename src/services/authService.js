import apiCient from "./apiCient";

const AuthServices = {
  loginApi: (data) => {
    return apiCient.post(`/auth/loginWithAuth0`, data);
  },
};

export default AuthServices;
