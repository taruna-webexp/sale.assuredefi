"use client";
import DynamicFormFields from "@/components/share/form/DynamicFormFields";
import FormInput from "@/components/share/form/FormInput";
import FormInputSelect from "@/components/share/form/FormInputSelect";
import { createGoogleDoc } from "@/services/template";
import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

export default function AddQuote() {
  const [isLoading, setIsLoading] = useState(false);
  const [documentLinks, setDocumentLinks] = useState([]);
  const currencyOptions = [
    { label: "USD", value: "USD" },
    { label: "EUR", value: "EUR" },
    { label: "GBP", value: "GBP" },
    { label: "JPY", value: "JPY" },
    { label: "AUD", value: "AUD" },
    { label: "CAD", value: "CAD" },
    { label: "CHF", value: "CHF" },
    { label: "CNY", value: "CNY" },
    { label: "INR", value: "INR" },
    { label: "BRL", value: "BRL" },
    { label: "KRW", value: "KRW" },
    { label: "MXN", value: "MXN" },
    { label: "ZAR", value: "ZAR" },
  ];
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currency: currencyOptions[0].value,
    },
  });
  //for totoal price
  const productServicesFiled =
    useWatch({ control, name: "productServices" }) || [];
  const selectedCurrency = watch("currency", "USD");

  // Calculate total dynamically
  const total = productServicesFiled.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formattedData = { ...data, date: new Date().toISOString() };
    try {
      const response = await createGoogleDoc(formattedData);
      if (response.status === "success" && response.documentId) {
        const googleDocUrl = `https://docs.google.com/document/d/${response.documentId}`;
        const formattedUpdatedData = { ...formattedData, docUrl: googleDocUrl };
        //store all exist and new data
        const existingProjects =
          JSON.parse(localStorage.getItem("ListOfProjects")) || [];
        const updatedprojectList = [...existingProjects, formattedUpdatedData];
        // and new
        localStorage.setItem(
          "ListOfProjects",
          JSON.stringify(updatedprojectList)
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" items-center justify-center min-h-screen  dark-purple-bg py-6">
      <h1 className="text-3xl text-bold theme-color text-center pt-6">
        Generate New Quote
      </h1>
      <Container className=" p-8 rounded-lg shadow-md !max-w-3xl min-h-screen mt-12 theme-border-light ">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Grid container spacing={2} className="">
            <Grid item xs={12} md={12} lg={12}>
              <FormInput
                control={control}
                name="projectName"
                type="text"
                placeholder="Enter project name"
                errors={errors}
                label="Project Name"
                className="form-login-input"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <FormInput
                control={control}
                name="clientName"
                type="text"
                className="form-login-input"
                placeholder="Enter client name"
                errors={errors}
                label="Client Name"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <FormInputSelect
                options={currencyOptions}
                control={control}
                errors={errors}
                defaultValue={currencyOptions[0]}
                className="form-login-input"
                name="currency"
                type="text"
                placeholder="USD"
                label="Currency"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <DynamicFormFields
                control={control}
                errors={errors}
                className="form-login-input"
              />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <FormInput
                className="shadow-lg relative quoteNotes form-login-input"
                name="notes"
                control={control}
                placeholder="Enter any additional notes here..."
                label="Notes"
                errors={errors}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <Typography variant="h6" className="float-right">
                <span className="theme-color">Total: </span> {total}{" "}
                {selectedCurrency}
              </Typography>
            </Grid>
            <Grid item xs={5} md={5} lg={5}>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="button-color"
                  variant="contained"
                  fullWidth
                  sx={{ marginTop: 2 }}
                >
                  {isLoading ? (
                    <CircularProgress className="theme-color" />
                  ) : (
                    "Save Quote"
                  )}
                </Button>
                <Link href="/">
                  <Button
                    variant="contained"
                    className="button-color"
                    fullWidth
                    sx={{ marginTop: 2 }}
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </Grid>
          </Grid>
        </form>
      </Container>
    </div>
  );
}
