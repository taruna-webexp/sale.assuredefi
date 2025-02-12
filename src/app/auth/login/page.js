"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Box, Typography, Container } from "@mui/material";
import FormInput from "@/components/share/form/FormInput";
import Image from "next/image";
import { loginValidationSchema } from "@/components/share/validation/loginValidation";
import AuthServices from "@/services/authService";
import { useRouter } from "next/navigation";
import { errorMsg, successMsg } from "@/components/toaster/msg";
import Cookies from "js-cookie";
export default function Login() {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    console.log("Submitted Data:", data);
    try {
      const res = await AuthServices.loginApi(data);
      Cookies.set("accessToken", JSON.stringify(res.data[0].access_token), {
        expires: 7,
        sameSite: "Strict",
      });
      Cookies.set("userDetail", JSON.stringify(res.data[0]), {
        expires: 7,
        sameSite: "Strict",
      });

      successMsg(res.message);

      router.push("/");
    } catch (error) {
      errorMsg(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark-purple-bg login-container ">
      <Container component="main" maxWidth="xs">
        <Box
          className="gradient-bg-sharp-login mb-6"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",

            padding: 4,
            borderRadius: "8px",
            boxShadow: 3,
          }}
        >
          <Image
            src="/assets/logo-a.webp"
            width={170}
            height={80}
            alt="assuredefi-logo"
            className="!mb-6 h-12"
          />
          <Box
            className="theme-border-light gradient-bg-sharp-login"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "white",
              padding: 4,
              borderRadius: "8px",
              boxShadow: 3,
            }}
          >
            <Typography
              variant="h5"
              component="h1"
              gutterBottom
              className="theme-color"
            >
              Log In
            </Typography>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="form-login gap-2"
            >
              {/* Email Field */}
              <FormInput
                control={control}
                name="email"
                type="email"
                placeholder=""
                errors={errors}
                className="form-login-input !mt-6 !mb-4"
                label="Email"
                variant="outlined"
              />

              {/* Password Field */}
              <FormInput
                className="form-login-input !mb-4"
                label="Password"
                name="password"
                variant="outlined"
                control={control}
                placeholder=""
                errors={errors}
                type="password"
              />
              <Typography variant="body2 !mt-4">
                <a href="/auth/login" className="theme-color hover:underline">
                  Forgot Password?
                </a>
              </Typography>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
              >
                Log In
              </Button>
            </form>

            {/* Footer */}
            <Box mt={2} className="text-center">
              <Typography variant="body2">
                Don&apos;t have an account?{" "}
                <a href="/auth/login" className="theme-color hover:underline">
                  Sign Up
                </a>
              </Typography>
            </Box>
          </Box>{" "}
        </Box>
      </Container>
    </div>
  );
}
