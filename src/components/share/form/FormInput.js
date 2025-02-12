import { FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export default function FormInput({
  name,
  control,
  errors, // Corrected prop name
  label,
  type,
  multiline,
  className,
  placeholder,
  defaultValue,
}) {
  return (
    <FormControl fullWidth className={className}>
      <label className="text-black">{label}</label>
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
            error={!!errors?.[name]} // Corrected
            helperText={errors?.[name]?.message} // Corrected
            variant="outlined"
          />
        )}
      />
    </FormControl>
  );
}
