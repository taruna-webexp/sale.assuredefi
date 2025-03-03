import React from "react";
import { Grid, Button, Stack, Typography } from "@mui/material";
import { useFieldArray } from "react-hook-form";
import FormInput from "./FormInput";
import FormInputSelectAutoComplete from "./FormInputSelectAutoComplete";
import { quoteServices } from "@/utils/static";
import { DeleteOutline } from "@mui/icons-material";
import FormRepeaterInput from "./FormRepeaterInput";

const DynamicFormFields = ({ control, errors, clearErrors, setValue }) => {
  console.log("errors", errors);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "productServices",
  });
  {
    fields.map((field, index) => {
      // console.log(
      //   "Errors for amount:",
      //   errors?.productServices?.[index]?.amount
      // );
      return (
        <FormInput
          control={control}
          label="Price/Cost"
          defaultValue=""
          name={`productServices[${index}].amount`}
          type="text"
          errors={
            fields.length > 0
              ? errors?.productServices?.[index]?.amount ?? undefined
              : undefined
          }
          className="form-login-input"
          variant="outlined"
        />
      );
    });
  }
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
      clearErrors("productServices"); // Remove validation error if all fields are deleted
    }
  };

  React.useEffect(() => {
    clearErrors("productServices"); // Clears validation errors when fields are removed
  }, [fields, clearErrors]);

  const handleProductChange = () => {};

  return (
    <Stack spacing={1} className="line-item-collunm">
      <Grid container spacing={2}>
        <label className="line-item-lable w-full">Line Item</label>
        {fields.length > 0 &&
          fields.map((field, index) => {
            console.log("field-index", index);

            return (
              <>
                <div
                  key={field.id}
                  className="w-full flex gap-4 pb-4 pe-4 item-row flex-wrap relative items-center"
                >
                  {/* Autocomplete Input (Select) */}
                  <div
                    className={`flex w-full gap-3 add-item-collunm items-center `}
                  >
                    <Grid item xs={12} md={6} className="relative">
                      <label className="line-item-lable invisible">
                        Line Item
                      </label>

                      <FormInputSelectAutoComplete
                        name={`productServices[${index}].productService`}
                        control={control}
                        label="Product/Service"
                        options={quoteServices}
                        className="capitalize form-login-input"
                        handleChange={handleProductChange}
                        errors={
                          fields.length > 0 &&
                          errors?.productServices?.[index]?.productService
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={3} className="relative">
                      <FormRepeaterInput
                        control={control}
                        label="Price/Cost"
                        defaultValue=""
                        name={`productServices[${index}].amount`}
                        type="text"
                        errors={errors}
                        className="form-login-input"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={3} className="relative">
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
        </Grid>
      </Grid>
    </Stack>
  );
};

export default DynamicFormFields;
