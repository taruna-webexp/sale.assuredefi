import { FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export default function FormInput({
  name,
  control,
  errors,
  label,
  type,
  multiline,
  className,
  placeholder,
  defaultValue,
}) {
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
            error={!!errors?.[name]}
            helperText={errors?.[name]?.message}
            variant="outlined"
            inputProps={type === "number" ? { min: 0 } : {}}
          />
        )}
      />
    </FormControl>
  );
}
