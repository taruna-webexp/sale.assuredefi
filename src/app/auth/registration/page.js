"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Box,
  Typography,
  Container,
  Grid,
  CircularProgress,
} from "@mui/material";
import FormInput from "@/components/share/form/FormInput";
import { registerValdation } from "@/components/share/validation/registerValdation";
import Link from "next/link";
import AuthServices from "@/services/authService";
import { useRouter } from "next/navigation";
import { errorMsg, successMsg } from "@/components/toaster/msg";
import { useState } from "react";

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerValdation),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const res = await AuthServices.registerApi(data);
      successMsg(res.message);
      router.push("/");
      reset();
    } catch (error) {
      errorMsg(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark-purple-bg login-container">
      <Container component="main" maxWidth="sm">
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
              Register a New User
            </Typography>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="form-login gap-4 w-full"
            >
              <Grid container spacing={2}>
                {/* Name & Email - Responsive */}
                <Grid item xs={12} sm={6}>
                  <FormInput
                    control={control}
                    name="name"
                    type="text"
                    errors={errors}
                    className="form-login-input  !mb-4 !mt-6"
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormInput
                    control={control}
                    name="email"
                    type="email"
                    errors={errors}
                    className="form-login-input !mb-4 !mt-6"
                    label="Email"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                {/* Password & Confirm Password - Always Full Width */}
                <Grid item xs={12}>
                  <FormInput
                    control={control}
                    name="password"
                    type="password"
                    errors={errors}
                    className="form-login-input mt-6 !mb-4"
                    label="Password"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormInput
                    control={control}
                    name="confirmPassword"
                    type="password"
                    errors={errors}
                    className="form-login-input mt-6 !mb-4"
                    label="Confirm Password"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              </Grid>

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
                  "Register"
                )}
              </Button>
            </form>

            <Box mt={2}>
              <Typography variant="body2">
                <Link href="/" className="theme-color underline">
                  Back to home
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
