import React from "react";
import { FormControl, Select, MenuItem } from "@mui/material";
import { Controller } from "react-hook-form";

const FormInputSelectWithHandler = ({
  name,
  control,
  label,
  options,
  errors,
  className,
  defaultValue,
  onChange,
}) => {
  return (
    <FormControl fullWidth>
      <label className="mb-2">{label}</label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue || ""}
        render={({ field }) => (
          <Select
            id={name}
            {...field}
            error={!!errors?.[name]}
            className={className}
            onChange={(e) => {
              field.onChange(e);
              onChange?.(e.target.value);
            }}
          >
            {options?.map((option) => (
              <MenuItem
                className="capitalize"
                key={option.value}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />

      {errors?.[name] && (
        <p className="text-red-600 text-xs">{errors[name]?.message}</p>
      )}
    </FormControl>
  );
};

export default FormInputSelectWithHandler;
