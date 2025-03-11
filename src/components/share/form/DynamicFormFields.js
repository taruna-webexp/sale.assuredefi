"use client";
import React, { useState } from "react";
import {
  Grid,
  Button,
  Stack,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useFieldArray } from "react-hook-form";
import FormInputSelectAutoComplete from "./FormInputSelectAutoComplete";
import { quoteServices } from "@/utils/static";
import { DeleteOutline } from "@mui/icons-material";
import FormRepeaterInput from "./FormRepeaterInput";

const DynamicFormFields = ({
  control,
  errors,
  clearErrors,
  setValue,
  register,
  watch,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "productServices",
  });
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (fields.length === 0) {
        append(
          { productService: "", amount: "", qty: 1 },
          { shouldFocus: false }
        );
      }
    }
  }, [fields.length, append]);

  const removeField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);

    setValue("productServices", updatedFields, { shouldValidate: true });

    if (updatedFields.length === 0) {
      setValue("productServices", [], { shouldValidate: true });
    }
  };

  React.useEffect(() => {
    clearErrors("productServices");
  }, [fields, clearErrors]);

  return (
    <Stack spacing={1} className="line-item-collunm">
      <Grid container spacing={2}>
        {fields.length > 0 && (
          <div
            className={`flex w-full gap-3 add-item-collunm items-start mobile-hidden`}
          >
            <Grid item xs={12} md={5} className="relative !p-0">
              <label className="line-item-lable w-full mb-3 ">Line Item</label>
            </Grid>
            <Grid item xs={12} md={3} className="relative !p-0">
              <label className="line-item-lable w-full mb-3">Price/Cost</label>
            </Grid>
            <Grid item xs={12} md={4} className="relative !p-0">
              <label className="line-item-lable w-full mb-3">QTY</label>
            </Grid>
          </div>
        )}
        {fields.length > 0 &&
          fields.map((field, index) => {
            return (
              <>
                <div
                  key={field.id}
                  className="w-full flex gap-4 pb-4 pe-4 item-row flex-wrap relative items-center"
                >
                  <div
                    className={`flex w-full gap-3 add-item-collunm items-start product-service-outer`}
                  >
                    <Grid item xs={12} md={5} className="relative">
                      <label className="line-item-lable mb-2 !mt-0 !hidden">
                        Line Item
                      </label>
                      <Autocomplete
                        name={`productServices[${index}].productService`}
                        className="capitalize form-login-input"
                        freeSolo
                        clearIcon={null}
                        options={quoteServices.map((project) => project.label)}
                        value={
                          watch(`productServices[${index}].productService`) ||
                          ""
                        }
                        onChange={(event, newValue) => {
                          setValue(
                            `productServices[${index}].productService`,
                            newValue,
                            {
                              shouldValidate: true,
                            }
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Product/Service"
                            variant="outlined"
                            placeholder="Search or type to create a project"
                            {...register(
                              `productServices[${index}].productService`,
                              {
                                required: "Product/Service is required",
                              }
                            )}
                            error={
                              !!errors?.productServices?.[index]?.productService
                            }
                            helperText={
                              errors?.productServices?.[index]?.productService
                                ?.message
                            }
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={3} className="relative cost-field">
                      <FormRepeaterInput
                        control={control}
                        label="Price/Cost"
                        defaultValue=""
                        name={`productServices[${index}].amount`}
                        type="text"
                        errors={errors}
                        className="form-login-input "
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={4}
                      className="relative quanity-field"
                    >
                      <FormRepeaterInput
                        control={control}
                        label="QTY"
                        defaultValue="1"
                        name={`productServices[${index}].qty`}
                        type="number"
                        errors={errors}
                        variant="outlined"
                        className={
                          index == 0
                            ? "form-login-input add-qty-fields-space"
                            : " form-login-input add-qty-fields-space"
                        }
                      />
                    </Grid>
                  </div>

                  {
                    <Grid
                      item
                      xs={12}
                      md={12}
                      className="text-end remove-filed"
                    >
                      <Typography
                        variant="p-bod"
                        className="text-red-500 text-right cursor-pointer remove-service text-sm"
                        onClick={() => {
                          removeField(index);
                          clearErrors(`productServices.${index}`);
                        }}
                      >
                        <DeleteOutline />
                      </Typography>
                    </Grid>
                  }
                </div>
              </>
            );
          })}

        <Grid item xs={4} md={4} className="!ps-0 item-button">
          <Button
            variant="contained"
            className="button-color !capitalize"
            onClick={() => append({ productService: "", amount: "", qty: 1 })}
          >
            + Add Line Item
          </Button>

          {errors.productServices &&
            typeof errors.productServices.message === "string" && (
              <Typography className="text-red-500 text-sm pt-4">
                {errors.productServices.message}
              </Typography>
            )}
        </Grid>
      </Grid>
    </Stack>
  );
};

export default DynamicFormFields;
