import React from "react";
import { FormControl, Autocomplete, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const FormInputSelectAutoComplete = ({
  name,
  control,
  label,
  options,
  errors,
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
            options={options}
            getOptionLabel={(option) => (option.name ? option.name : "")}
            value={options.find((opt) => opt.name === field.value) || null}
            onChange={(_, value) => {
              handleChange(value);
              field.onChange(value ? value.name : "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                className={className}
                label={label}
                error={!!errors}
                helperText={errors?.message}
              />
            )}
          />
        )}
      />
    </FormControl>
  );
};

export default FormInputSelectAutoComplete;
