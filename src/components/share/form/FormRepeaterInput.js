import { FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
export default function FormInput({
  name,
  control,
  errors = {},
  label,
  type,
  multiline,
  className,
  placeholder,
  defaultValue,
}) {
  // nested error
  const getNestedError = (errorObj, path) => {
    return path.split(".").reduce((acc, key) => {
      if (key.includes("[") && key.includes("]")) {
        const [arrayKey, index] = key.split(/\[|\]/).filter(Boolean);
        return acc?.[arrayKey]?.[parseInt(index, 10)];
      }
      return acc?.[key];
    }, errorObj);
  };

  const fieldError = getNestedError(errors, name);

  return (
    <FormControl fullWidth className={className}>
      {label && <label className="mb-2">{label}</label>}

      <Controller
        name={name}
        defaultValue={defaultValue || ""}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            InputLabelProps={{ shrink: true }}
            fullWidth
            placeholder={placeholder}
            type={type}
            multiline={multiline}
            error={!!fieldError}
            helperText={fieldError?.message}
            variant="outlined"
            inputProps={type === "number" ? { min: 0 } : {}}
          />
        )}
      />
    </FormControl>
  );
}
