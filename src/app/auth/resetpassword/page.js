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
import { errorMsg, successMsg } from "@/components/toaster/msg";
import Link from "next/link";
import AuthServices from "@/services/authService";
import { resetPasswordValidationSchema } from "@/components/share/validation/loginValidation";
import { useState } from "react";
export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordValidationSchema),
    defaultValues: {
      email: "",
    },
  });

  /// submit handler
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await AuthServices.resetPasswordApi(data);
      if (res.status == true) {
        successMsg(res.message);
        reset();
        router.push("/auth/login");
      }
    } catch (error) {
      errorMsg(error);
      console.log("Error:", error);
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
            <Link href="/" className="text-2xl font-bold text-white">
              <img
                src="https://cdn.prod.website-files.com/671146926ff340e4bb778835/67524d8d92d2860c7fa253e2_goldfooterimage.png.webp"
                alt="assuredefi-logo"
                className="!mb-6 h-14"
              />
              <p className="logo-text theme-color">Sales Portal</p>
            </Link>
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
              Forgot Password
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
                placeholder="Enter your email address"
                errors={errors}
                className="form-login-input !mt-6 !mb-4"
                label="Email"
                variant="outlined"
              />
              <Typography variant="body2 !mt-4">
                <Link
                  href="/auth/login"
                  className="theme-color hover:underline"
                >
                  Back to login
                </Link>
              </Typography>
              {/* Password Field */}
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
                  "Continue"
                )}
              </Button>
            </form>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
