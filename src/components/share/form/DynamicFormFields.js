import React from "react";
import { Grid, Button, Stack } from "@mui/material";
import { useFieldArray } from "react-hook-form";
import FormInput from "./FormInput";
import FormInputSelectAutoComplete from "./FormInputSelectAutoComplete";

const DynamicFormFields = ({ control, errors, className }) => {
  const { fields, append } = useFieldArray({
    control,
    name: "productServices", // Unique array name for React Hook Form
  });

  const productServices = [
    { id: 1, name: "kyc" },
    { id: 2, name: "premium package" },
    { id: 3, name: "ultimate package" },
    { id: 4, name: "pr package" },
    { id: 5, name: "ama" },
  ];

  // Ensure at least one field is displayed by default
  React.useEffect(() => {
    if (fields.length === 0) {
      append({ productService: "", amount: "" }, { shouldFocus: false });
    }
  }, [fields.length, append]);

  const handleProductChange = () => {
    console.log("sdfgh");
  };
  return (
    <Stack spacing={1}>
      <label> Line Item </label>
      <Grid container spacing={2}>
        {fields.map((field, index) => (
          <div key={field.id} className="w-full flex gap-4 pb-4 pe-4">
            {/* Autocomplete Input (Select) */}
            <Grid item xs={12} md={6}>
              <FormInputSelectAutoComplete
                name={`productServices[${index}].productService`}
                control={control}
                label="Product/Service"
                options={productServices}
                errors={errors}
                className="capitalize form-login-input"
                handleChange={handleProductChange}
              />
            </Grid>

            {/* Text Input */}
            <Grid item xs={12} md={6}>
              <FormInput
                control={control}
                label=""
                defaultValue="0"
                name={`productServices[${index}].amount`}
                type="number"
                errors={errors}
                className="form-login-input"
                variant="outlined"
              />
            </Grid>
          </div>
        ))}
        <Grid item xs={4} md={4} className="!ps-0">
          <Button
            variant="contained"
            className="button-color"
            onClick={() => append({ productService: "", number: "" })}
          >
            Add Line Item
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default DynamicFormFields;
