"use client";
import DynamicFormFields from "@/components/share/form/DynamicFormFields";
import FormInput from "@/components/share/form/FormInput";
import FormInputSelect from "@/components/share/form/FormInputSelect";
import { addQuoteSchema } from "@/components/share/validation/quoteValidation";

import { errorMsg, successMsg } from "@/components/toaster/msg";
import QuoteServices from "@/services/quoteService";
import { createGoogleDoc } from "@/services/template";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import {useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
export default function EditQuotes({ quoteId, source }) {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const router = useRouter();

  const currencyOptions = [
    { label: "USD", value: "USD" },
    { label: "ETH", value: "ETH" },
    { label: "BNB", value: "BNB" },
    { label: "SOL", value: "SOL" },
  ];

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addQuoteSchema),
    defaultValues: {
      productServices: [{ productService: "", amount: 0 }],
      currency: currencyOptions[0].value,
    },
  });

  //get quote by id
  const getQuoteById = async () => {
    try {
      const result = await QuoteServices.getQuoteById(quoteId);
      if (result.status === true) {
        let data = result.data;

        if (typeof data.productServices === "string") {
          data = { ...data, productServices: JSON.parse(data.productServices) };
        }
        setSelectedProject(data.projectName || "");
        reset({ ...data, projectName: data.projectName || "" });
      }
    } catch (error) {
      errorMsg(error);
      router.push("/");
    }
  };

  const productServicesFiled =
    useWatch({ control, name: "productServices" }) || [];
  const selectedCurrency = watch("currency", "USD");

  // Calculate total
  const total = productServicesFiled
    .reduce((sum, item) => sum + (Number(item.amount) * item.qty || 0), 0)
    .toFixed(2);

  /// update quote
  const onSubmit = async (data) => {
    setIsLoading(true);
    const formattedData = { ...data, total, date: new Date().toISOString() };
    try {
      const response = await createGoogleDoc(formattedData);
      if (response.status === "success" && response.documentId) {
        const googleDocUrl = `${process.env.NEXT_PUBLIC_GOOGLE_DOC_BASE_URL}${response.documentId}`;
        const formattedUpdatedData = {
          ...formattedData,
          docUrl: googleDocUrl,
          templateId: response.documentId,
        };
        if (source == "clonequote") {
          const res = await QuoteServices.addQutote(formattedUpdatedData);

          if (res.status == true) {
            successMsg("Quote clone successfully");
            router.push("/");
          }
        } else {
          const res = await QuoteServices.quoteupdate(
            quoteId,
            formattedUpdatedData
          );
          if (res.status == true) {
            successMsg(res.message);
            router.push("/");
          }
        }
      }
    } catch (error) {
      errorMsg(error);
    } finally {
      setIsLoading(false);
    }
  };

  /// get project handler
  const getProjecProjects = async () => {
    try {
      const response = await QuoteServices.getproject();
      if (response.status === true && response.data.length > 0) {
        const formattedProjects = response.data.map((project) => ({
          label: project.name,
          value: project.name,
        }));

        setProjects(formattedProjects);
      }
    } catch (error) {
      errorMsg(error);
    }
  };

  useEffect(() => {
    getProjecProjects();

    getQuoteById(); // get quote by id
  }, []);

  return (
    <div className=" items-center justify-center min-h-screen  dark-purple-bg py-6 px-6 generate-quote">
      <h1 className="text-3xl text-bold theme-color text-center pt-6">
        {!source || source !== "clonequote" ? " Edit  Quote" : "Clone Quote"}
      </h1>
      <Container className=" p-8 rounded-lg shadow-md !max-w-3xl mt-12 theme-border-light generate-quote-form">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Grid container spacing={2} className="">
            <Grid item xs={12} md={12} lg={12}>
              <Autocomplete
                className={`form-login-input  ${
                  !source && (source !== "clonequote" ? "project-field" : "")
                }`}
                freeSolo
                options={projects.map((project) => project.label)}
                value={selectedProject}
                clearIcon={null}
                onChange={(event, newValue) => {
                  setSelectedProject(newValue);
                  setValue("projectName", newValue, { shouldValidate: true });
                }}
                disabled={!source || source !== "clonequote"}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      !source || (source !== "clonequote" && "Project Name")
                    }
                    disabled={!source || source !== "clonequote"}
                    variant="outlined"
                    placeholder="Search or type to create a project"
                    {...register("projectName", {
                      required: "Project name is required",
                    })}
                    error={!!errors.projectName}
                    helperText={errors.projectName?.message}
                  />
                )}
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
                required
              />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <FormInput
                control={control}
                name="clientEmail"
                type="email"
                className="form-login-input"
                placeholder="Enter email"
                errors={errors}
                label="Email"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <FormInputSelect
                options={currencyOptions}
                control={control}
                errors={errors}
                defaultValue={currencyOptions[0]}
                className="form-login-input select-currency"
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
                watch={watch}
                register={register}
                clearErrors={clearErrors}
                setValue={setValue}
                className="form-login-input"
              />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <FormInput
                className="shadow-lg relative quoteNotes form-login-input sales-textarea"
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
            <Grid
              item
              xs={5}
              md={5}
              lg={5}
              className="pt-px sales-save-button
"
            >
              <div className="flex gap-2 ">
                <Button
                  type="submit"
                  className="button-color"
                  variant="contained"
                  fullWidth
                  sx={{ marginTop: 2 }}
                >
                  {isLoading ? (
                    <CircularProgress
                      className="theme-color !text-sm !w-5 !h-5"
                      fontSize="small"
                    />
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
