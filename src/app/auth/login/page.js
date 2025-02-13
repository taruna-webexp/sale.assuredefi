"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Box,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import FormInput from "@/components/share/form/FormInput";
import { loginValidationSchema } from "@/components/share/validation/loginValidation";
import AuthServices from "@/services/authService";
import { useRouter } from "next/navigation";
import { errorMsg, successMsg } from "@/components/toaster/msg";
import Cookies from "js-cookie";
import { useState } from "react";
export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
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
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark-purple-bg login-container ">
      <Container component="main" maxWidth="xs">
        <Box
          className="gradient-bg-sharp-login mb-6 !px-0"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",

            padding: 4,
            borderRadius: "8px",
            boxShadow: 3,
          }}
        >
          <div className="relative">
            <img
              src="https://cdn.prod.website-files.com/671146926ff340e4bb778835/67524d8d92d2860c7fa253e2_goldfooterimage.png.webp"
              alt="assuredefi-logo"
              className="!mb-6 h-14"
            />
            <p className="logo-text theme-color">Sales Portal</p>
          </div>
          <Box
            className="theme-border-light gradient-bg-sharp-login !px-5 !py-8"
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

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
              >
                {isLoading ? (
                  <CircularProgress
                    className="theme-color !text-sm !w-5 !h-5"
                    fontSize="small"
                  />
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </Box>{" "}
        </Box>
      </Container>
    </div>
  );
}
