import apiCient from "./apiCient";

const AuthServices = {
  loginApi: (data) => {
    return apiCient.post(`/auth/loginWithAuth0`, data);
  },
  registerApi: (data) => {
    return apiCient.post(`/auth/signUpWithAuth0`, data);
  },
  resetPasswordApi: (email) => {
    return apiCient.post(`/auth/ForgotPasswordWithAuth0`, email);
  },
};

export default AuthServices;
