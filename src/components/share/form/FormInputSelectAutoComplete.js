import React from "react";
import { FormControl, Autocomplete, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const FormInputSelectAutoComplete = ({
  name,
  control,
  label,
  options,
  errors = {},
  handleChange,
  className,
}) => {
  return (
    <FormControl fullWidth>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            options={options} // Ensure options are passed correctly
            getOptionLabel={(option) => (option.name ? option.name : "")} // Fix getOptionLabel
            value={options.find((opt) => opt.name === field.value) || null} // Fix value mapping
            onChange={(_, value) => {
              handleChange(value);
              field.onChange(value ? value.name : ""); // Ensure value update
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                className={className}
                label={label}
                error={!!errors[name]}
                helperText={errors[name]?.message}
              />
            )}
          />
        )}
      />
    </FormControl>
  );
};

export default FormInputSelectAutoComplete;
